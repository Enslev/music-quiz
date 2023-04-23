import React, { useRef, useState } from 'react';
import { styled } from '@mui/material';
import { ReactComponent as XIconRaw } from '../../assets/x.svg';
import { ReactComponent as SearchIconRaw } from '../../assets/search.svg';
import { useDebouncedCallback } from 'use-debounce';

interface Props {
    onSearch: (value: string) => void;
    onClear: () => void;
}

const TrackSearchBar: React.FC<Props> = (props) => {

    const { onSearch, onClear } = props;
    const ref = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState<string>('');

    const debouncedSearch = useDebouncedCallback(() => {
        onSearch(value);
    }, 500);

    return <SearchBar>
        <SearchIcon/>
        <input
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
                debouncedSearch();
            }}
            ref={ref}
        ></input>
        <XIcon onClick={() => {
            setValue('');
            onClear();
            ref.current?.focus();
        }}/>
    </SearchBar>;
};

const SearchBar = styled('div')`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: 25px;
    margin-bottom: 10px;

    input {
        width: 78%;
        border: none;
        height: 50px;
        font-size: 20px;
        margin: 0px 10px;
    }
    input:focus{
        outline: none;
    }
`;

const SearchIcon = styled(SearchIconRaw)`
    width: 30px;
    height: 30px;
    color: black;
`;

const XIcon = styled(XIconRaw)`
    width: 30px;
    height: 30px;
    color: black;
    cursor: pointer;
    transition: 200ms;

    &:hover {
        scale: 1.2;
    }
`;

export default TrackSearchBar;
