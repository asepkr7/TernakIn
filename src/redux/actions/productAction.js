export const addProduct = (product) => ({
    type: "ADD_PRODUCT",
    payload: { product },
})

export const destroyProduct = (id) => ({
    type: "DELETE_PRODUCT",
    payload: { id },
});

export const updateProduct = (product) => ({
    type: "UPDATE_PRODUCT",
    payload: { product },
});