import axios from "axios";


export const baseURL = 'https://shop-api.fly.dev'

const baseApi = axios.create({
    baseURL: `${baseURL}/api/v1`
})
export const imagesURL = `${baseURL}/public/images/`

export type IProduct = {
    available: boolean
    categoryId: number
    currency: string
    description: string
    id: number
    image: string
    maxAmount: number
    minAmount: number
    name: string
    price: string
    amount?: number
    saved?: boolean
}
export type IProductMeta = {
    "perPage": number
    "totalPages": number
    "currentPage": number
    "totalElements": number
}

export const getCategories = async () => {
    const response = await baseApi.get('/categories')
    return response.data.data as Array<{ name: string, id: number }>
}

export const getItems = async (categories: Array<number>, page: number) => {
    const qp = new URLSearchParams();

    if (categories.length) {
        qp.append('categoryId', categories.join(','));
    }
    if (page) {
        qp.append('page', page.toString());
    }

    const response = await baseApi.get(`/products?${qp.toString()}`);
    return response.data as { data: Array<IProduct>, meta: IProductMeta }
}

export const sendOrder = async (data: object) => {
    try {
        const response = await baseApi.post('/orders', data)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

