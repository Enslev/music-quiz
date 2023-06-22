export interface MongoDoc {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
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


export interface SearchSpotifyResponseBody {
    tracks : {
        href : string,
        items : SpotifyTrackObject[],
        limit : number,
        next : string,
        offset : number,
        previous : null,
        total : number,
    }
}

export interface GetPlaybackStateResponseBody {
    shuffle_state: boolean,
    repeat_state: 'off' | 'track' | 'context',
    timestamp: number,
    progress_ms: number,
    is_playing: boolean,
    device: SpotiyDeviceObject,
    item: SpotifyTrackObject,
}

export interface SpotiyDeviceObject {
    id: string,
    is_active: boolean,
    is_private_session: boolean,
    is_restricted: boolean,
    name: string,
    type: string,
    volume_percent: number
}

export interface SpotifyTrackObject {
    error?: {
        status: number,
        message: string,
    },
    album : {
      album_group : string,
      album_type : string,
      artists : [ {
        external_urls : {
          spotify : string,
        },
        href : string,
        id : string,
        name : string,
        type : string,
        uri : string,
      } ],
      external_urls : {
        spotify : string,
      },
      href : string,
      id : string,
      images : [ {
        height : number,
        url : string,
        width : number
      }, {
        height : number,
        url : string,
        width : number
      }, {
        height : number,
        url : string,
        width : number
      } ],
      is_playable : boolean,
      name : string,
      release_date : string,
      release_date_precision : string,
      total_tracks : number,
      type : string,
      uri : string,
    },
    artists : [ {
      external_urls : {
        spotify : string,
      },
      href : string,
      id : string,
      name : string,
      type : string,
      uri : string,
    } ],
    disc_number : number,
    duration_ms : number,
    explicit : boolean,
    external_ids : {
      isrc : string,
    },
    external_urls : {
      spotify : string,
    },
    href : string,
    id : string,
    is_local : boolean,
    is_playable : boolean,
    name : string,
    popularity : number,
    preview_url : string,
    track_number : number,
    type : string,
    uri : string,
  }
