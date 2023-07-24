import { ThemeOptions, createTheme } from '@mui/material';

declare module '@mui/material/styles/createPalette' {
    export interface PaletteOptions {
        custom: {
            darkerBackground: string;
            highlight: string;
        }
    }
    export interface Palette {
        custom: {
            darkerBackground: string;
            highlight: string;
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
        success: {
            main: '#00c853',
        },
        warning: {
            main: '#f1c40f',
        },
        error: {
            main: '#e74c3c',
        },
        custom: {
            darkerBackground: '#282c34',
            highlight: '#F9F871',
        },
    },
    typography: {
        button: {
            textTransform: 'none',
        },
    },
};

export const theme = createTheme(themeOptions);
