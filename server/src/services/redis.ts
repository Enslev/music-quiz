import { RedisClientType, createClient } from 'redis';
import { TrackFromSpotify } from '../types/spotify';

let client: RedisClientType | null = null;

export const initRedis = async () => {
    client = createClient({
        url: 'redis://redis:6379',
    });

    client.on('error', err => console.log('❗️ Redis Client Error', err));

    await client.connect();
    console.log(`⚡️[server]: Redis initialized`);
};

const getClient = (): RedisClientType => {
    if (!client) throw Error('Trying to access Redis before it has initialized!');
    return client;
};

export const set = async (key: string, value: unknown): Promise<void> => {
    const client = getClient();

    await client.set(key, JSON.stringify(value), {
        EX: 600,
    });
};

export const get = async (key: string): Promise<TrackFromSpotify | null> => {
    const client = getClient();

    const value = await client.get(key);

    if (!value) {
        return null;
    }

    return JSON.parse(value) as TrackFromSpotify;
};
