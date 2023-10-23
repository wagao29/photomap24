export const sleep = (sec: number): Promise<unknown> => {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
};
