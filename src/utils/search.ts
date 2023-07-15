export const searchSubstr = (fromText: string, textToReplace: string) => {
  return fromText.replaceAll(textToReplace, "<mark>$&</mark>");
};
