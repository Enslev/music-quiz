// import { ThemeOptions } from '@mui/material/styles';

import { ThemeOptions, createTheme } from '@mui/material';

export const themeOptions: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#2DC4B5',
        },
        secondary: {
            main: '#009cd9',
        },
        background: {
            default: '#326670',
        },
    },
};

export const theme = createTheme(themeOptions);
