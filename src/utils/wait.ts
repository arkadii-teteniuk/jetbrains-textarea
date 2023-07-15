export const wait = (time: number): Promise<undefined> => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
