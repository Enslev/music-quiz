import React, { RefObject, forwardRef, useImperativeHandle, useRef } from 'react';
import { styled } from '@mui/material';
import { ReactComponent as XIconRaw } from '../../assets/x.svg';
import { ReactComponent as SearchIconRaw } from '../../assets/search.svg';
import { useDebouncedCallback } from 'use-debounce';

export type TrackSearchBarRefHandler = {
  inputRef: RefObject<HTMLInputElement>;
  focusSearch: () => void;
}

interface Props {
    value: string;
    onChange: (value: string) => void;
    onSearch: (value: string) => void;
    onClear: () => void;
}

const TrackSearchBar= forwardRef<TrackSearchBarRefHandler, Props>(function trackSearchBar(props, ref) {

    const { value, onChange, onSearch, onClear } = props;
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        inputRef: inputRef,
        focusSearch: () => {
            setTimeout(() => inputRef.current?.focus(), 200);
        },
    }));

    const debouncedSearch = useDebouncedCallback(() => {
        if (!value) return;
        onSearch(value);
    }, 500);

    return <SearchBar>
        <SearchIcon/>
        <input
            value={value}
            onChange={(e) => {
                onChange(e.target.value);
                debouncedSearch();
            }}
            ref={inputRef}
        ></input>
        <XIcon onClick={() => {
            onChange('');
            onClear();
            inputRef.current?.focus();
        }}/>
    </SearchBar>;
});

const SearchBar = styled('div')(({
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '25px',
    marginBottom: '10px',

    'input': {
        width: '78%',
        border: 'none',
        height: '50px',
        fontSize: '20px',
        margin: '0px 10px',
    },

    'input:focus': {
        outline: 'none',
    },
}));

const SearchIcon = styled(SearchIconRaw)(({
    width: '30px',
    height: '30px',
    color: 'black',
}));

const XIcon = styled(XIconRaw)(({
    width: '30px',
    height: '30px',
    color: 'black',
    cursor: 'pointer',
    transition: '200ms',

    '&:hover': {
        scale: 1.2,
    },
}));

export default TrackSearchBar;
