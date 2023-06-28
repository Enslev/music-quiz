export interface Quiz {
    _id: string;
    title: string;
    user: string;
    categories: {
        _id: string;
        title: string;
        tracks: {
            _id: string;
            title: string;
            artist: string;
            points:number;
            trackUrl: string;
            startPosition: number;
        }[]
    }[]
}

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

export type Category = Quiz['categories'][number];
export type Track = Quiz['categories'][number]['tracks'][number];
