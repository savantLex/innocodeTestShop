import {CssBaseline, ThemeProvider} from "@mui/material";
import Grid from '@mui/material/Grid2';
import themeController from "./themeController";
import Header from "./sections/Header.tsx";

import SwipeableTemporaryDrawer from "./components/Drawer.tsx";
import {AppProvider, useAppContext} from "./contexts/appContext.tsx";
import {ReactNode} from "react";
import Main from "./components/Main.tsx";
import {QueryClient, QueryClientProvider} from "react-query";


const App = () => {
    const queryClient = new QueryClient();

    const ThemeWrapper = ({children}: { children: ReactNode }) => {
        const appContext = useAppContext()
        return (
            <ThemeProvider theme={themeController(appContext.getState()?.theme)}>
                {children}
            </ThemeProvider>)
    }
    return (
        <AppProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeWrapper>
                    <CssBaseline/>
                    <Header/>
                    <Grid container wrap='nowrap'>
                        <SwipeableTemporaryDrawer/>
                        <Main/>
                    </Grid>

                </ThemeWrapper>
            </QueryClientProvider>
        </AppProvider>
    )
}

export default App
