export const getRemainingTime = (expireAt: number): number => {
  return Math.floor((expireAt - Date.now()) / 1000);
};
