import { useEffect, useRef, useState } from 'react';
import { useThrottledCallback } from 'use-debounce';

export const useKeyboardShortcut = <T extends string>(
    keysToListenOn: T | T[],
    callback: (keysPressed?: T) => void,
    throttleTime = 200,
) => {
    const ref = useRef<{ [key in T]: boolean; } | null>(null);
    const keysArr = Array.isArray(keysToListenOn) ? keysToListenOn : [ keysToListenOn ];
    const initial = Object.fromEntries(keysArr.map((key) => [ key, false ])) as {[key in T]: boolean};
    const [ keysDown, setKeyIsDown ] = useState<{[key in T]: boolean}>(initial);
    const [ latestKey, setLatestKey ] = useState<T | null>(null);
    const throttledCallback = useThrottledCallback(callback, throttleTime, { leading: true, trailing: false });

    const keyDownHandler = (event: KeyboardEvent) => {
        if (!keysArr.some((activeKey) => activeKey == event.key)) return;
        const keyDown = event.key as T;

        if (keysArr.every((key) => key != event.key)) return;
        if (!ref.current) return;
        setKeyIsDown({
            ...ref.current,
            [keyDown]: true,
        });
        setLatestKey(keyDown);
    };

    const keyUpHandler = (event: KeyboardEvent) => {
        if (!keysArr.some((activeKey) => activeKey == event.key)) return;
        const keyDown = event.key as T;

        if (keysArr.every((key) => key != event.key)) return;
        if (!ref.current) return;
        setKeyIsDown({
            ...ref.current,
            [keyDown]: false,
        });
        setLatestKey(null);
    };

    useEffect(() => {
        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('keyup', keyUpHandler);
        };
    }, []);

    useEffect(() => {
        if (keydownAreEqual(keysDown, ref.current ?? {})) return;
        ref.current = keysDown;
    }, [ keysDown ]);

    useEffect(() => {
        if (latestKey == null) return;
        throttledCallback(latestKey);
    }, [ latestKey ]);
};

const keydownAreEqual = (obj1: {[key: string]: unknown}, obj2: {[key: string]: unknown}) => {
    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);

    if (obj1Keys.length != obj2Keys.length) return false;
    if (!obj1Keys.every((obj1Key) => obj2Keys.includes(obj1Key))) return false;
    if (!obj1Keys.every((key) => obj1[key] == obj2[key])) return false;

    return true;
};
