/**
 * Returns a string with all of the substring entities wrapped by `<mark>`. The very first and obvious solution.
 */

export const searchSubstr = (fromText: string, textToReplace: string) => {
  return fromText.replaceAll(textToReplace, "<mark>$&</mark>");
};
