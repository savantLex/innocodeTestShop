import Grid from "@mui/material/Grid2";
import {ItemCard} from "./Card.tsx";
import {getItems, IProductMeta,} from "../api";
import {useAppContext} from "../contexts/appContext.tsx";
import {useState} from "react";
import Box from "@mui/material/Box";
import {Pagination} from "@mui/material";
import {useQuery} from "react-query";


export default function Main() {
    const {getState} = useAppContext()
    const state = getState()

    const [meta, setMeta] = useState<IProductMeta | null>(null);
    const [page, setPage] = useState<number>(1)

    const {data, isLoading, isError, isSuccess} = useQuery(
        ['categories', state.selectedCategories, page],
        () => getItems(state.selectedCategories, page),
        {
            retry: 3,
            retryDelay: 1000,
            refetchOnWindowFocus: true,
            refetchInterval: 30000,
            onError: (err) => console.error('Query failed', err),
            onSuccess: (responseData) => {
                if (responseData?.meta) {
                    setMeta(responseData.meta);
                }
            }
        }
    );

    const items = data?.data;
    const handleChange = (page: number) => {
        setPage(page);
    };


    return (
        <Grid container direction='column' width='100%'>
            {meta && meta.totalPages > 1 &&
                <Grid container justifyContent='center' mt={1}>
                    <Pagination page={page} count={meta.totalPages} onChange={(e, page) => handleChange(page)}/>
                </Grid>}

            <Grid container spacing={2} padding={3}>

                {isSuccess && items && items.map((item) => {
                    return (<ItemCard key={item?.id} item={item}/>)
                })}
                {isLoading && (<Box display='block'>
                    Loading...
                </Box>)}

                {isError && (<Box display='block'>
                    Error when trying to load items
                </Box>)}
            </Grid>
        </Grid>
    )
}
