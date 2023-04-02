import express from 'express';
import bodyParser from "body-parser";
// import * as path from "path";
import { YoutubeUtil } from "./util/youtubeUtil";
import {IYoutubeSearch} from "./interface/youtube";
import * as fs from "fs";
// const __dirname = path.resolve();
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000' // 허용할 도메인을 지정합니다.
}));

app.post('/search', async (req, res) => {
    const searchKeyword = req.body.searchKeyword;
    res.send(JSON.stringify(await YoutubeUtil.searchInYoutube(searchKeyword)));

});

app.post('/convert', async (req, res) => {
    const data:IYoutubeSearch = req.body.data;
    console.log('data.id',data.id, data.title)

    const savePath = await YoutubeUtil.mp4ToMp3(data.id);
    try {
        res.download(savePath, function(err) {
            if (err) {
                console.log(err);
                res.status(500).send({error: 'Could not download file'});
            }
        });
    } catch (err) {

    } finally {
        fs.unlink(savePath, function (err) {
            console.log('삭제 실패', err)
        })
    }
});

app.listen(port, async () => {
    console.log('Server Start...');
    // await YoutubeUtil.test();
})
