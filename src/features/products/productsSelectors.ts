import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store/store";

export const selectProducts = (state: RootState) => state.products.list

export const selectActiveProducts = createSelector(
    [selectProducts],
    (list) => list.filter(p => !p.archived)
)

export const selectArchivedProducts = createSelector(
    [selectProducts],
    (list) => list.filter(p => p.archived)
)