import { styled } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
    text: string,
    className?: 'string'
}

export const TextWithScroll: React.FC<Props> = (props) => {

    const { text, className } = props;

    const [ titleHovered, setTitleHovered ] = useState<boolean>(false);
    const [ scrollInterval, setScrollInterval ] = useState<NodeJS.Timer | null>(null);
    const [ scrollOffset, setScrollOffset ] = useState<number>(0);

    const divRef = useRef<HTMLDivElement>(null);
    let offset = 0;

    useEffect(() => {
        const overflowWidth = getOverFlowWidth();
        if (titleHovered && overflowWidth > 0) {
            setScrollInterval(setInterval(() => {
                offset -= 4;
                setScrollOffset(offset);
            }, 50));
        } else {
            if (scrollInterval) clearInterval(scrollInterval);
            setScrollInterval(null);
            offset = 0;
            setScrollOffset(0);
        }

        return () => {
            if (scrollInterval) clearInterval(scrollInterval);
        };

    }, [ titleHovered ]);

    useEffect(() =>{
        const overflowWidth = getOverFlowWidth();
        if (scrollOffset < -overflowWidth) {
            if (scrollInterval) clearInterval(scrollInterval);
            setScrollInterval(null);
            return;
        }
    }, [ scrollOffset ]);

    const getOverFlowWidth = () =>{
        const divScrollWidth = (divRef.current?.scrollWidth) ?? 0;
        const divWidth = (divRef.current?.clientWidth) ?? 0;
        return divScrollWidth - divWidth;
    };

    return <div className={className}
        onMouseEnter={() => setTitleHovered(true)}
        onMouseLeave={() => setTitleHovered(false)}
    >
        {titleHovered ?
            <Scrolling >
                <div
                    ref={divRef}
                    style={({
                        transform: `translate(${scrollOffset}px)`,
                        transition: '50ms',
                    })}>
                    {text}
                </div>
            </Scrolling>
            :
            <Ellipsed>{text}</Ellipsed>
        }
    </div>;

};

const Ellipsed = styled('span')(({
    display: 'block',
    width: '100%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    boxSizing: 'border-box',
}));

const Scrolling = styled('span')(({
    display: 'block',
    width: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
}));
