export const logWithTime = (msg: string) => {
  const id = Date.now();
  const time = new Date();
  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });
  return { id, msg: `[${formattedTime}] ${msg}` };
};
