import {Button, Modal} from "@mui/material";
import Box from "@mui/material/Box";
import DenseTable from "./Table.tsx";
import Typography from "@mui/material/Typography";
import {IProduct, sendOrder} from "../api";
import {useState} from "react";
import {ItemSnackBar} from "./SnackBar.tsx";
import {useAppContext} from "../contexts/appContext.tsx";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
};
type IModalBuyNow = {
    isCartOpen: boolean;
    setCartOpen: (value: boolean) => void;
    savedItems: IProduct[];
}

enum messages {
    success = 'Suceessfully sent order!',
    error = 'Error while sending order, please try again later'
}

export const ModalBuyNow = ({isCartOpen, setCartOpen, savedItems}: IModalBuyNow) => {
    const [isSnackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('Suceessfully sent order!');
    const {updateState} = useAppContext();
   
    const onBuyNow = async () => {
        try {
            const data = savedItems.map(({id, amount}) => ({productId: id, qty: amount}))
            const resp = await sendOrder({data})
            if (!resp.data) {
                throw 'Error while sending order'
            }
            setSnackMessage(messages.success)
            setSnackOpen(true)
            updateState({selectedItems: []})
            setTimeout(() => setCartOpen(false), 3000)
        } catch (e) {
            setSnackMessage('Error while sending order, please try again later')
            setSnackOpen(true)
            setCartOpen(false)
            console.error(e)
        }
    }

    return (<>
            <ItemSnackBar message={snackMessage} open={isSnackOpen} setOpen={setSnackOpen}/>
        {!!savedItems.length && <Modal
                open={isCartOpen}
                onClose={() => setCartOpen(false)}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={modalStyle}>
                    <h2 id="parent-modal-title">List</h2>
                    <DenseTable items={savedItems}/>

                    <Button sx={{mt: 2}}>
                        <Typography color='textSecondary' variant={'body1'} component='span' onClick={onBuyNow}>Buy
                            NOW!</Typography></Button>
                </Box>
            </Modal>}
        </>
    )
}