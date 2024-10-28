import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {imagesURL, IProduct} from "../api";
import {ReactEventHandler, useState} from "react";
import {TextField, useTheme} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {useAppContext} from "../contexts/appContext.tsx";
import {ItemSnackBar} from "./SnackBar.tsx";

type IItemCard = {
    item: IProduct;
}


export const ItemCard = ({item}: IItemCard) => {
    const {getState, updateState} = useAppContext()
    const [isSnackOpen, setSnackOpen] = useState(false);
    const state = getState()
    const theme = useTheme()
    const inProgress = state.selectedItems.find(({id}) => item.id === id)
    const inSaved = state.selectedItems.find(({id}) => item.id === id)?.saved
    const amount = state.selectedItems.find(({id}) => item.id === id)?.amount ?? 0

    const handleImageError = (e: { target: { onerror: null, src: string } }) => {
        e.target.onerror = null;
        e.target.src = "/notFound.png"
        item.image = "/notFound.png"
    }

    const updateItem = (amount: number) => {
        if (amount && amount <= 0) {
            amount = 0
        }
        const state = getState()
        const isSaved = state.selectedItems.find(({id}) => item.id === id)
        if (isSaved && amount !== 0) {
            const newState = state.selectedItems.filter(({id}) => item.id !== id)
            updateState({
                ...state,
                selectedItems: [...newState, {...item, amount}]
            })
        } else if (amount === 0) {
            const isSaved = state.selectedItems.find(({id}) => item.id === id)
            if (isSaved) {
                const newState = state.selectedItems.filter(({id}) => item.id !== id)
                updateState({
                    ...state,
                    selectedItems: newState
                })
            }
        } else {
            updateState({
                ...state,
                selectedItems: [...state.selectedItems, {...item, amount}]
            })
        }
    }

    const saveInCart = () => {
        const state = getState()
        const currentItem = state.selectedItems.find(({id}) => item.id === id) as IProduct
        if (!currentItem?.amount ||
            currentItem?.amount && (currentItem?.amount > currentItem?.maxAmount
                || currentItem.amount < currentItem.minAmount)) {
            setSnackOpen(true)
            return
        }
        const newState = state.selectedItems.filter(({id}) => item.id !== id)
        updateState({
            ...state,
            selectedItems: [...newState, {...currentItem, saved: !inSaved}]
        })
    }


    return (
        <>
            <ItemSnackBar
                message={`The amount should be between ${item.minAmount} and ${item.maxAmount}`}
                open={isSnackOpen}
                setOpen={setSnackOpen}/>
            <Grid size={{xs: 12, md: 6, lg: 4}} width='100%' position='relative'>
                <Card aria-disabled={!item?.available} sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <CardHeader
                        title={item.name}

                    />
                    <CardMedia
                        component="img"
                        height={400}
                        sx={{
                            filter: item?.available ? '' : 'blur(10px)',
                            '& .MuiCardMedia-img': {
                                objectFit: 'contain'
                            }
                        }}
                        image={`${imagesURL}/${item.image}`}
                        alt="Image"
                        onError={handleImageError as unknown as ReactEventHandler<HTMLImageElement> | undefined}
                    />
                    <CardContent>
                        <Typography variant="body2" sx={{color: 'text.secondary'}}>
                            {item.description}
                        </Typography>
                    </CardContent>
                    <Grid container direction='column' justifyContent={'end'} flexGrow={1}>
                        {item.available && <CardActions disableSpacing>
                            <IconButton aria-label="Reduce amount" onClick={() => updateItem((amount ?? 0) - 1)}>
                                <KeyboardArrowLeftIcon/>
                            </IconButton>

                            <TextField
                                id="amount"
                                type="number"
                                variant="standard"
                                value={amount ?? ''}
                                sx={{width: '50px'}}
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                    htmlInput: {
                                        min: item.minAmount,
                                        max: item.maxAmount,
                                        step: 1,
                                    }
                                }}
                                onChange={(e) => updateItem(parseInt(e.target.value))}
                            />
                            <IconButton aria-label="increase amount" onClick={() => updateItem((amount ?? 0) + 1)}>
                                <KeyboardArrowRightIcon/>
                            </IconButton>
                            <Typography ml='auto'>{item.price} {item.currency}</Typography>
                            <IconButton sx={{marginLeft: '15px'}} aria-label="increase amount" onClick={saveInCart}>
                                <ShoppingCartIcon
                                    sx={{fill: inSaved ? 'green' : isSnackOpen ? 'red' : inProgress ? 'yellow' : theme.palette.contrastThreshold}}/>
                            </IconButton>
                        </CardActions>}
                        {!item.available && (<Typography pb={1} pl={1}>
                            This item is not available
                        </Typography>)}
                    </Grid>
                </Card>
            </Grid>
        </>
    );
}