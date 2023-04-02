interface IYoutubeSearch {
    id: string;
    title: string;
    thumbnail: IThumbnail;
    channelTitle: string;
}

interface IThumbnail {
    thumbnails: Array<IThumbnailInfo>
}

interface IThumbnailInfo {
    url: string;
    width: number;
    height: number;
}

export type {
    IYoutubeSearch,
    IThumbnail,
    IThumbnailInfo
}
