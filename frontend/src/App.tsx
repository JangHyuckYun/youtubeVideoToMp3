import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    IconButton,
    Input,
    TextField,
    Typography
} from "@mui/material";
import axios from "axios";
import {IYoutubeSearch} from "./interface/youtube";
import {idID} from "@mui/material/locale";
import {Blob} from "buffer";
import loadingGif from './static/gif/loading.gif';

const client = axios.create({
    baseURL:'http://localhost:3001'
})

const fileClient = axios.create({
    baseURL:'http://localhost:3001',
    responseType:'blob',
})
declare global {
    interface Window {
        URL: typeof URL;
    }
}

function App() {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchResultList, setSearchResultList] = useState<Array<IYoutubeSearch>>([]);

    const searchKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
        if(e.key === 'Enter') {
            const result = await client.post('/search', {
                searchKeyword
            });

            setSearchResultList(result.data);
            // await YoutubeUtil.searchInYoutube(searchKeyword);
        }
    }

    const selectItem = (id: string) => {
        console.log('click', id)
        const findIndex = searchResultList.findIndex(d => d.id === id);
        if (findIndex !== -1) {
            searchResultList[findIndex].select = !searchResultList[findIndex]?.select;

            setSearchResultList([...searchResultList]);
        }
    }

    const convert = async () => {
        const filterList = searchResultList.filter(d => d.select);

        if (filterList.length === 0) {
            return alert('영상을 선택해 주세요.');
        }

        setLoading(true);
        try {
            for (const data of filterList) {
                await fileClient.post('/convert', {
                    data
                }).then(response => {
                    // const blob:Blob = new Blob([response.data], { type: 'audio/mpeg' });
                    console.log(response)
                    const url = window.URL.createObjectURL(response.data);
                    const link = document.createElement('a');
                    link.href = url;
                    console.log('title.replaceAll(/\\s/, \'\')', (data.title ?? '').replace(/\s/g, ''));
                    link.download = data.title.replace(/\s/g, '')+'.mp3';
                    document.body.appendChild(link);
                    link.click();
                })
            }
        } catch (err) {

        } finally {
            setLoading(false);
        }

        // for await (const data of filterList) {
        //     console.log('data', data)
        //     await client.post('/convert', {
        //         data
        //     })
        // }

    }

  return (
    <Container>
        <Box sx={{width:'100%', height:'100%', position:'fixed', left:0, top:0, display: loading ? 'flex' : 'none', alignItems:'center', justifyContent:'center', zIndex:10, backgroundColor:'rgba(0,0,0, .2)' }}>
            <img src={loadingGif} alt=""/>
        </Box>
        <Box>
            <TextField fullWidth id="standard-basic" label="Standard" variant="standard" value={searchKeyword} onKeyDown={(e) => searchKeyDown(e)} onChange={(e) => setSearchKeyword(e.target.value)} />
        </Box>
      <Button variant={'contained'} onClick={() => convert()}>Convert mp4 To mp3</Button>
        <Box>
            selected: {searchResultList.filter(d => d.select).length}
        </Box>
        <Box sx={{padding:'0 20px'}}>
            {searchResultList.map(searchResult => (
                <Card key={searchResult.id} onClick={() => selectItem(searchResult.id)} sx={{ display: 'flex', justifyContent:'space-between', margin:'8px 0', backgroundColor:`${searchResult.select ? 'rgba(0,0,0, .2)' : 'white'}` }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="h5">
                            {searchResult.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            {searchResult.channelTitle}
                        </Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>

                    </Box>
                </Box>
                <CardMedia
                    component="img"
                    sx={{ width: 151 }}
                    image={searchResult.thumbnail.thumbnails[0]?.url ?? ''}
                    alt="Live from space album cover"
                />
            </Card>))}
        </Box>
    </Container>
  );
}

export default App;
