import { createContext, useContext, useReducer } from "react";
const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? {
                  ...item,
                  quantity: item.quantity + action.payload.quantity,
                  duration: action.payload.duration, // Tambahkan ini
                }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { ...action.payload, checked: false }, // `duration` sudah ada di `payload`
        ],
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "UPDATE_DURATION":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, duration: action.payload.duration }
            : item
        ),
      };

    case "TOGGLE_ITEM_CHECK":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload
            ? { ...item, checked: !item.checked }
            : item
        ),
      };

    case "TOGGLE_CHECK_ALL":
      const allChecked = state.items.every((item) => item.checked);
      return {
        ...state,
        items: state.items.map((item) => ({ ...item, checked: !allChecked })),
      };

    case "REMOVE_CHECKED_ITEMS":
      return {
        ...state,
        items: state.items.filter((item) => !item.checked),
      };

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
