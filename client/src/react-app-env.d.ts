/// <reference types="react-scripts" />

declare module '@mui/material/styles' {
    interface Theme {
        palette: {
            mode: string,
            primary: {
                main: sting,
            },
            secondary: {
                main: string,
            },
            background: {
                default: string
            },
        },
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        palette: {
            mode: string,
            primary: {
                main: string,
            },
            secondary: {
                main: string,
            },
            background: {
                default: string
            },
        },
    }
  }
