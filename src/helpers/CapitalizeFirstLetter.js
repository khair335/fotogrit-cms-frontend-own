export const CapitalizeFirstLetter = (sentence) => {
  return sentence?.replace(/(^\w|\.\s\w)/g, (match) => match?.toUpperCase());
};
