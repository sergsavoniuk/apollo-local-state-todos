const options = {
  month: 'long',
  day: 'numeric',
};

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-GB', options).format(date);
