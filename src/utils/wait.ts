/**
 * Resolves a promise after a `time` ms waiting.
 * @param time
 * @returns {Promise<void>}
 */

export const wait = (time: number): Promise<undefined> => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
