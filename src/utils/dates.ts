export function dateRangeToObject(dateRange: moment.Moment[]) {
  if (!Array.isArray(dateRange) || dateRange.length !== 2) {
    return null;
  }

  const [startDate, endDate] = dateRange;
  const formattedStartDate = startDate.format("MM/DD/YYYY");
  const formattedEndDate = endDate.format("MM/DD/YYYY");

  return {
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };
}

export const calculateDaysDifference = (valueStr: any) => {
  const startDate = new Date(valueStr[0]);
  const endDate = new Date(valueStr[1]);
  const timeDifference = endDate.getTime() - startDate.getTime();
  return timeDifference / (1000 * 60 * 60 * 24);
};
