import path from "path";
import ytdl from "ytdl-core";
import * as fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import ffmpeg from 'ffmpeg';
import {IYoutubeSearch} from "../interface/youtube";
const youtubesearchapi = require('youtube-search-api');

export class YoutubeUtil {
	static async searchInYoutube(searchKeyword: string): Promise<Array<IYoutubeSearch>> {
		console.log('searchKeyword', searchKeyword)
		try {
			const list = (await youtubesearchapi.GetListByKeyword(searchKeyword)).items ?? [];
			console.log(list)

			return list;
		} catch (err) {
			console.log('err', err);
			return [];
		}
	}

	static async downloadYoutube(id: string): Promise<string> {
		const fileName = uuidv4() + '.mp4';
		const stream = await ytdl(`https://www.youtube.com/watch?v=${id}`, { quality: 'highestaudio' });


		console.log('path.resolve(process.cwd())', path.resolve(process.cwd()))
		stream.pipe(fs.createWriteStream(`${path.resolve(process.cwd())}/temp/${fileName}`));

		return new Promise((resolve, reject) => {
			stream.on('end', () => {
				console.log('end', `../temp/${fileName}`)
				resolve(fileName);
			})

			stream.on('error', (err) => {
				reject(err);
			})
		})
	}

	static async mp4ToMp3(id: string): Promise<string> {
		let fileName = '';
		try {
			fileName = await this.downloadYoutube(id)
		} catch (err) {
			console.log('err downloadYoutube', err);
		}

		return new Promise((resolve, reject) => {
			new ffmpeg(`${path.resolve(process.cwd())}/temp/${fileName}`, function (err, video) {
				if (!err) {
					console.log('The video is ready to be processed');
					const ranId = uuidv4();
					const savePath = `${path.resolve(process.cwd())}/mp3Temp/${ranId}.mp3`;
					console.log('savePath', savePath)
					video.fnExtractSoundToMP3(savePath, function ( error, file ) {
						if (!error) {
							try {
								fs.unlink(`${path.resolve(process.cwd())}/temp/${fileName}`, function (err) {
									console.log(`failed remove data /temp/${fileName}`, err)
								})
							} catch (err) {

							} finally {
								resolve(savePath);
							}
						}
						else
							reject('')
					})
				} else {
					console.log('Error: ' + err);
				}
			})
		})

	}
}
