const digitToNumber = (str: string) => {
  if (str.length === 1) {
    return `0${str}`;
  }
  return str;
};

export const parseDatetime = (datetime: string) => {
  const dateFmt = new Date(datetime);
  const day = digitToNumber(dateFmt.getDay().toString());
  const month = digitToNumber(dateFmt.getMonth().toString());
  const year = digitToNumber(dateFmt.getFullYear().toString());
  const hours = digitToNumber(dateFmt.getHours().toString());
  const min = digitToNumber(dateFmt.getMinutes().toString());

  return `${day}/${month}/${year} ${hours}:${min}`;
};

export const parseDate = (datetime: string) => {
  const dateFmt = new Date(datetime);
  const day = digitToNumber(dateFmt.getDay().toString());
  const month = digitToNumber(dateFmt.getMonth().toString());
  const year = digitToNumber(dateFmt.getFullYear().toString());

  return `${day}/${month}/${year}`;
};
