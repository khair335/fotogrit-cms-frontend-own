export const formatDateTime = (dateString) => {
  const date = new Date(dateString);

  const optionsDate = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  const optionsTime = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const formattedDate = date.toLocaleString('en-US', optionsDate);
  const formattedTime = date.toLocaleString('en-US', optionsTime);

  return `${formattedDate} | ${formattedTime}`;
};
