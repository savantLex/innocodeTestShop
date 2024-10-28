import {Snackbar} from "@mui/material";

type IItemSnackBar = {
    message: string;
    open: boolean;
    setOpen: (val: boolean) => void;
}

export const ItemSnackBar = ({message, open, setOpen}: IItemSnackBar) => {

    return (
        <Snackbar open={open}
                  anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                  autoHideDuration={6000}
                  message={message}
                  onClose={() => setOpen(false)}
        />
    )

}