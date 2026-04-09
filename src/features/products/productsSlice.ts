/* Manage:
    - product list
    - add product
    - remove product
    - update remain
*/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../shared/types/Product";

interface ProductState {
    list: Product[]
}

const initialState: ProductState = {
    list: [],
}

export const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<Product>) => {
            state.list.push(action.payload)
        },
        archiveProduct: (state, action: PayloadAction<string>) => {
            const product = state.list.find(p => p.id === action.payload)
            if(product) {
                product.archived = true
                product.updatedAt = Date.now()
            }
        },
        unarchiveProduct: (state, action: PayloadAction<string>) => {
            const product = state.list.find(p => p.id === action.payload)
            if(product) {
                product.archived = false
                product.updatedAt = Date.now()
            }
        },
        updateProduct: (state, action: PayloadAction<Product>) => {
            const index = state.list.findIndex(p => p.id === action.payload.id)
            if(index !== -1) {
                state.list[index] = action.payload
            }
        },
    },
})

export const { addProduct, archiveProduct, unarchiveProduct, updateProduct } = productsSlice.actions
export const productsReducer = productsSlice.reducer