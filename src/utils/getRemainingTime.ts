export const getRemainingTime = (createdAt: Date): number => {
  return Math.floor((createdAt.getTime() + 24 * 60 * 60 * 1000 - Date.now()) / 1000);
};
