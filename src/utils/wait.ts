/**
 * Resolves a promise after a `time` ms waiting.
 */
export const wait = (time: number): Promise<undefined> => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
