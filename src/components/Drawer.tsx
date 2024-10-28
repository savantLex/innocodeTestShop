import * as React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {useMediaQuery, useTheme} from "@mui/material";
import {useQuery} from "react-query";
import {getCategories} from "../api";
import Typography from "@mui/material/Typography";
import {useAppContext} from "../contexts/appContext.tsx";


const drawerWidth = 240


export default function SwipeableTemporaryDrawer() {
    const {getState, updateState} = useAppContext()
    const [categories, setCategories] = useState<{ name: string, id: number }[] | null>(null)
    const theme = useTheme();
    const state = getState()
    const greaterThanMid = useMediaQuery(theme.breakpoints.up("md"));
    const {isSuccess} = useQuery('categories', getCategories, {
        retry: 3,
        onSuccess: (data) => {
            setCategories(data ?? null)
        }
    })

    const updateCategory = (id: number) => {
        if (state.selectedCategories.includes(id)) {
            updateState({selectedCategories: state.selectedCategories.filter((item) => item !== id)})
        } else {
            updateState({selectedCategories: [...state.selectedCategories, id]})
        }
    }

    const toggleDrawer =
        (open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event &&
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                updateState({isDrawerOpen: open});
            };

    const list = () => (
        <Box
        >
            <List>
                {isSuccess && categories && categories.map(({name, id}) => (
                    <ListItem key={name} disablePadding>
                        <ListItemButton
                            onClick={() => updateCategory(id)}>
                            <ListItemText
                            >
                                <Typography component='p'
                                            sx={{fontWeight: state.selectedCategories.includes(id) ? '800' : '400'}}>
                                    {name}
                                </Typography>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <SwipeableDrawer
            sx={{
                width: drawerWidth,
                height: '100%',
                position: {xs: 'fixed', md: 'static'},
                top: 0,
                left: 0,
                '& .MuiDrawer-paper': {
                    height: '100%',
                    boxSizing: 'border-box',
                    width: drawerWidth,
                    display: {xs: 'block', md: 'flex'},
                    position: {xs: 'fixed'},
                    top: 'auto',
                    left: 0
                },
            }}
            variant={greaterThanMid ? "permanent" : "temporary"}
            anchor={'left'}
            open={greaterThanMid ? true : state.isDrawerOpen}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
        >
            {list()}</SwipeableDrawer>
    );
}