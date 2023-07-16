/**
 * Returns string with all of substring entities wrapped by `<mark>`. The very first and obvious solution.
 * @type {function}
 * @param `fromText` {string}
 * @param `textToReplace` {string} is what should be replaced in `fromText`
 * @returns {string} is an initial string with all the `textToReplace` wrapped by `<mark>`
 */

export const searchSubstr = (fromText: string, textToReplace: string) => {
  return fromText.replaceAll(textToReplace, "<mark>$&</mark>");
};
