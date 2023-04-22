import React, { useRef, useState } from 'react';
import { styled } from '@mui/material';
import { ReactComponent as XIconRaw } from '../assets/x.svg';
import { ReactComponent as SearchIconRaw } from '../assets/search.svg';

interface Props {
    onSearch: (value: string) => void;
}

const TrackSearchBar: React.FC<Props> = (props) => {

    const { onSearch } = props;
    const ref = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState<string>('');

    return <SearchBar>
        <SearchIcon onClick={() => onSearch(value)}/>
        <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            ref={ref}
        ></input>
        <XIcon onClick={() => {
            setValue('');
            ref.current?.focus();
        }}/>
    </SearchBar>;
};

const SearchIcon = styled(SearchIconRaw)`
    width: 30px;
    height: 30px;
    color: black;
    cursor: pointer;
    transition: 200ms;

    &:hover {
        scale: 1.2;
    }
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

const SearchBar = styled('div')`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: 25px;

    input {
        border: none;
        width: 80%;
        height: 50px;
        font-size: 20px;
        margin: 0px 10px;
    }
    input:focus{
        outline: none;
    }
`;

export default TrackSearchBar;
