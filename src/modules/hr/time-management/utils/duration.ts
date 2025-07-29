export const calculateDuration = (startTime: string, endTime: string | null): string => {
  if (!endTime) {
    return "In Progress";
  }
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const difference = Math.floor((end - start) / 1000);

  if (difference < 0) return "Invalid";

  const hours = Math.floor(difference / 3600);
  const minutes = Math.floor((difference % 3600) / 60);
  const seconds = difference % 60;
  
  return `${hours}h ${minutes}m ${seconds}s`;
};