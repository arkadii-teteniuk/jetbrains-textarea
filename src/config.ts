export type SearchConfig = {
  multilineSearch: boolean;
};

const featureDefaults: SearchConfig = {
  multilineSearch: false,
};

export const options: SearchConfig = {
  ...featureDefaults,
  multilineSearch: false,
};
