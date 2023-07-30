/**
 * Returns a string with all of the substring entities wrapped by `<mark>`. The very first and obvious solution.
 */

export const searchSubstr = (
  fromText: string,
  textToReplace: string,
  regex = false
): string => {
  if (!regex) {
    return fromText.replaceAll(textToReplace, "<mark>$&</mark>");
  }

  try {
    const rg = new RegExp(textToReplace, "g");
    return fromText.replaceAll(rg, "<mark>$&</mark>");
  } catch (e) {
    console.info("Bad regular expression");
    return textToReplace;
  }
};
