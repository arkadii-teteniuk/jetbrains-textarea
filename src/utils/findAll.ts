export const findAll = (str: string, findStr: string): number[] => {
  const results: number[] = [];
  let i = 0;

  if (!str.length || !findStr.length || str.length < findStr.length) {
    console.log({ text: str, search: findStr, results: [] });
    return [];
  }

  while (i < str.length) {
    if (str[i] === findStr[0]) {
      let matched = true;
      const startPos = i;

      for (let j = 0; j < findStr.length; j++, i++) {
        if (str[i] !== findStr[j]) {
          matched = false;
          break;
        }
      }

      if (matched) {
        results.push(startPos);
      }
    } else {
      i++;
    }
  }

  console.log({ text: str, search: findStr, results });
  return results;
};
