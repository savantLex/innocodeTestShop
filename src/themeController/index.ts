import {createTheme, responsiveFontSizes, Theme, ThemeOptions} from "@mui/material";


const defaultTheme: ThemeOptions = {

};


const lightTheme: ThemeOptions = {
    palette: {
        mode: "light",
        primary: {
            main: "#4bcd53",
        },
        secondary: {
            main: "#dc004e",
        },
    },
}

const darkTheme: ThemeOptions = {
    palette: {
        mode: "dark",
        primary: {
            main: "#2a3740",
        },
        secondary: {
            main: "#4e363c",
        },
    },
}

const blueTheme: ThemeOptions = {
    palette: {
        mode: "light",
        primary: {
            main: "#0020a5",
        },
        secondary: {
            main: "#b3e5fc",
        },
    },
}

export enum availableThemes {
    lightTheme = 'lightTheme',
    darkTheme = 'darkTheme',
    blueTheme = 'blueTheme',
}

export const getTheme = (themeType: string) => {
    switch (themeType) {
        case availableThemes.lightTheme:
            return lightTheme;
        case availableThemes.darkTheme:
            return darkTheme;
        case availableThemes.blueTheme:
            return blueTheme;
        default:
            console.warn(`Unknown theme type: ${themeType}. Falling back to light theme.`);
            return lightTheme; // Default to light theme
    }
}


type IThemeController = (themeType: string) => Theme;
const themeController: IThemeController = (themeType) => {

    return responsiveFontSizes(createTheme({...defaultTheme, ...getTheme(themeType)}))
};

export default themeController;