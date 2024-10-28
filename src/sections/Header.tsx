import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {useAppContext} from "../contexts/appContext.tsx";
import {useState} from "react";
import {ModalBuyNow} from "../components/ModalBuyNow.tsx";
import {availableThemes, getTheme} from "../themeController";
import Circle from "../components/Circle.tsx";


export default function Header() {
    const {getState, updateState} = useAppContext()
    const [isCartOpen, setCartOpen] = useState(false);
    const {selectedItems} = getState()
    const savedItems = selectedItems.filter(({saved}) => saved)

    const handleDrawerOpen = () => {
        updateState({isDrawerOpen: !getState().isDrawerOpen});
    };

    return (
        <>
            <ModalBuyNow savedItems={savedItems} isCartOpen={isCartOpen} setCartOpen={setCartOpen}/>
            <AppBar position="sticky" sx={{top: 0}}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{mr: 2, display: {xs: 'block', md: 'none'}}}
                        onClick={handleDrawerOpen}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{display: {xs: 'block'}}}
                    >
                        Shopping center
                    </Typography>
                    <Box sx={{flexGrow: 1}}/>
                    <Box sx={{display: {xs: 'flex'}}}>
                        {Object.values(availableThemes).map((theme) => {
                                // @ts-ignore
                                const color = getTheme(theme)?.palette?.primary?.main
                                return (<div onClick={() => updateState({theme})} key={theme}><Circle color={color}/></div>)
                            }
                        )}
                    </Box>
                    <Box sx={{display: {xs: 'flex'}}}>
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                        >

                            <Badge badgeContent={savedItems?.length}
                                   color="error"
                                   onClick={() => setCartOpen(!!savedItems?.length && !isCartOpen)}>
                                <ShoppingCartIcon/>
                            </Badge>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    )
        ;
}
