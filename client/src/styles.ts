import { ThemeOptions, createTheme } from '@mui/material';

declare module '@mui/material/styles/createPalette' {
    export interface PaletteOptions {
        custom: {
            darkerBackground: string,
        }
    }
    export interface Palette {
        custom: {
            darkerBackground: string,
        }
    }
}

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
        custom: {
            darkerBackground: '#282c34',
        },
    },
};

export const theme = createTheme(themeOptions);
