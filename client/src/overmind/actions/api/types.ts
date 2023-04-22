export interface createQuizRequestBody {
    title: string;
}

export interface putQuizRequestBody {
    _id: string;
    title: string;
    categories: {
        _id: string;
        title: string;
        tracks: {
            _id: string;
            title: string;
            artist: string;
            trackUrl: string;
            points: number;
        }[]
    }[]
}
