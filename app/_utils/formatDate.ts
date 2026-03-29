export const formatDate = (dateValue: Date | string) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1);
  const day = String(date.getDate());

  return `${year}/${month}/${day}`;
};
