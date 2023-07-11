import { FormControl, TextField, styled } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useActions } from '../overmind';
import { useNavigate } from 'react-router-dom';

export const JoinSessionPage: React.FC = () => {

    const { hideHeader, showHeader } = useActions().ui;
    const navigate = useNavigate();

    const [ inputValue1, setInputValue1 ] = useState<string>('');
    const [ inputValue2, setInputValue2 ] = useState<string>('');
    const [ inputValue3, setInputValue3 ] = useState<string>('');
    const [ inputValue4, setInputValue4 ] = useState<string>('');
    const [ inputValue5, setInputValue5 ] = useState<string>('');

    const input1Ref = useRef<HTMLInputElement>(null);
    const input2Ref = useRef<HTMLInputElement>(null);
    const input3Ref = useRef<HTMLInputElement>(null);
    const input4Ref = useRef<HTMLInputElement>(null);
    const input5Ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        input1Ref.current?.focus();
        hideHeader();
        return () => { showHeader(); };
    }, []);

    useEffect(() => {
        const sessionCode = inputValue1 + inputValue2 + inputValue3 + inputValue4 + inputValue5;

        if (sessionCode.length == 5) {
            navigate(`/session/${sessionCode}`);
        }
    }, [ inputValue1, inputValue2, inputValue3, inputValue4, inputValue5 ]);

    const sanitizeValue = (value: string): string | null => {
        if (value.length > 1 || !value.match(/[a-zA-Z0-9]/)) return null;
        return value.toUpperCase();
    };

    return <Wrapper>
        <h1>Join Session</h1>
        <StyledFormControl>
            <StyledTextField
                value={inputValue1}
                inputRef={input1Ref}
                onChange={(e) => {
                    const newValue = sanitizeValue(e.target.value);
                    if (!newValue) return;
                    setInputValue1(newValue);
                    input2Ref.current?.focus();
                }}
            />
            <StyledTextField
                value={inputValue2}
                inputRef={input2Ref}
                onChange={(e) => {
                    const newValue = sanitizeValue(e.target.value);
                    if (!newValue) return;
                    setInputValue2(newValue);
                    input3Ref.current?.focus();
                }}
            />
            <StyledTextField
                value={inputValue3}
                inputRef={input3Ref}
                onChange={(e) => {
                    const newValue = sanitizeValue(e.target.value);
                    if (!newValue) return;
                    setInputValue3(newValue);
                    input4Ref.current?.focus();
                }}
            />
            <StyledTextField
                value={inputValue4}
                inputRef={input4Ref}
                onChange={(e) => {
                    const newValue = sanitizeValue(e.target.value);
                    if (!newValue) return;
                    setInputValue4(newValue);
                    input5Ref.current?.focus();
                }}
            />
            <StyledTextField
                value={inputValue5}
                inputRef={input5Ref}
                onChange={(e) => {
                    const newValue = sanitizeValue(e.target.value);
                    if (!newValue) return;
                    setInputValue5(newValue);
                }}
            />
        </StyledFormControl>
    </Wrapper>;
};

const StyledTextField = styled(TextField)(({
    input: {
        width: '200px',
        height: '200px',
        fontSize: '200px',
        textAlign: 'center',
    },
    marginRight: '20px',
}));

const StyledFormControl = styled(FormControl)(({
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
}));

const Wrapper = styled('div')(({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

