export const calculateTotalPrice = (item) => {
  const priceWithDuration = (item.price || 0) * (item.duration || 1);
  return priceWithDuration * (item.quantity || 1);
};

export const formatPrice = (price) => {
  return price.toLocaleString;
};
