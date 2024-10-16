export const formatDate = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedMonth = month < 10 ? `0${month}` : month;

  const formattedDay = day < 10 ? `0${day}` : day;

  const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;

  return formattedDate;
};
