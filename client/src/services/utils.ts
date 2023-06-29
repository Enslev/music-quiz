// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

export function hasProp<K extends PropertyKey>(obj: unknown, key: K | null | undefined): obj is Record<K, unknown> {
    return key != null && obj != null && typeof obj === 'object' && key in obj;
}

export const pad = (n: number, size: number) => {
    let numberString = n.toString();
    while (numberString.length < size) numberString = '0' + numberString;
    return numberString;
};

export const clone = <T>(object: T): T => {
    return JSON.parse(JSON.stringify(object));
};

export const formatMs = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms - (minutes * 60000)) / 1000);
    return `${pad(minutes, 2)}:${pad(seconds, 2)}`;
};
