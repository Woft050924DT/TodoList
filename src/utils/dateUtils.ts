
export const toDateOnly = (d: Date | string): Date => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};


export const getDaysDifference = (
  from: Date | string,
  to: Date | string,
): number => {
  const fromDate = toDateOnly(from);
  const toDate = toDateOnly(to);
  return Math.ceil((toDate.getTime() - fromDate.getTime()) / 86_400_000);
};


export const isToday = (date: Date | string): boolean => {
  const today = toDateOnly(new Date());
  const checkDate = toDateOnly(date);
  return checkDate.getTime() === today.getTime();
};


export const isPast = (date: Date | string): boolean => {
  const today = toDateOnly(new Date());
  const checkDate = toDateOnly(date);
  return checkDate.getTime() < today.getTime();
};


export const isFuture = (date: Date | string): boolean => {
  const today = toDateOnly(new Date());
  const checkDate = toDateOnly(date);
  return checkDate.getTime() > today.getTime();
};
