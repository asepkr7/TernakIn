const DEFAULT_STATE = {
    products: [],
}

export const productReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case "SET_PRODUCT":
            return {...state, products: action.payload.products}
        case "ADD_PRODUCT":
            return {...state, products: [...state.products, action.payload.product]}
        case "DELETE_PRODUCT":
            return {...state, products: state.products.filter((product) => product.id !== action.payload.id)}
        case "UPDATE_PRODUCT":
            return {...state, products: state.products.map((product) => product.id === action.payload.product.id ? action.payload.product : product)}
        default:
            return state
    }
}
