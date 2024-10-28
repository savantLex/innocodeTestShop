import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {IProduct} from "../api";
import {useAppContext} from "../contexts/appContext.tsx";
import {useMediaQuery, useTheme} from "@mui/material";

export default function DenseTable({items}: { items: IProduct[] }) {
    const {getState, updateState} = useAppContext()
    const theme = useTheme()
    const greaterThanMid = useMediaQuery(theme.breakpoints.up("md"));

    const deleteItem = (currentId: number) => {
        const state = getState()

        const newState = state.selectedItems.filter(({id}) => currentId !== id)
        updateState({...state, selectedItems: newState})
    }

    const total = items.reduce((acc, {amount, price}) => {
        return acc + (amount ?? 0) * parseInt(price)
    }, 0)
    return (
        <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        {greaterThanMid && <TableCell align="right">Price</TableCell>}
                        {greaterThanMid && <TableCell align="right">Currency</TableCell>}
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Del</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map(({name, currency, price, amount, id}) => (
                        <TableRow
                            key={name}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                {name}
                            </TableCell>
                            <TableCell align="right">{amount}</TableCell>
                            {greaterThanMid && <TableCell align="right">{price}</TableCell>}
                            {greaterThanMid && <TableCell align="left">{currency}</TableCell>}
                            <TableCell align="right">{(amount ?? 0) * parseInt(price)} {currency}</TableCell>
                            <TableCell align="center" onClick={() => deleteItem(id)}
                                       sx={{":hover": {cursor: 'pointer'}}}>X</TableCell>
                        </TableRow>

                    ))}
                    <TableRow
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                        <TableCell align="left">
                            Total
                        </TableCell>
                        {greaterThanMid && <TableCell></TableCell>}
                        {greaterThanMid && <TableCell></TableCell>}
                        <TableCell></TableCell>
                        <TableCell align="right"> {total} {items[0].currency}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}