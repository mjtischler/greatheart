// MT: A place to store utilities shared across components.

export const getLocalDate = date => {
  const localDate = new Date(date).toLocaleString().replace(/:\d{2}\s/, ' ');

  return localDate;
};
