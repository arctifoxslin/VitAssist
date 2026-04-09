import { baseApi } from "../../shared/api/baseApi";
import { Product } from "../../shared/types/Product";

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<Product[], void>({
            query: () => '/products',
        }),
        createProduct: builder.mutation<Product, Partial<Product>>({
            query: (body) => ({
                url: '/products',
                method: 'POST',
                body,
            }),
        }),
    }),
})

export const {
    useGetProductsQuery,
    useCreateProductMutation
} = productApi