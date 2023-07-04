import { useEffect, useState } from 'react';
import { useThrottledCallback } from 'use-debounce';

export const useKeyboardShortcut = (keyStr: string, callback: () => void, throttleTime = 200) => {
    const [keyIsDown, setKeyIsDown] = useState<boolean>(false);
    const throttledCallback = useThrottledCallback(callback, throttleTime, { leading: true, trailing: false });

    const keyDownHandler = (event: KeyboardEvent) => {
        if (event.key != keyStr) return;
        setKeyIsDown(true);
    };

    const keyUpHandler = (event: KeyboardEvent) => {
        if (event.key != keyStr) return;
        setKeyIsDown(false);
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
        if (!keyIsDown) return;
        throttledCallback();
    }, [keyIsDown]);
};
