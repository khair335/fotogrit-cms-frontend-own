export const CurrencyFormat = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const removeCurrencyFormat = (formattedPrice) => {
  return parseInt(formattedPrice.replace(/\D/g, ''), 10);
};
