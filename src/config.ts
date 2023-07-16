export type SearchOptions = {
  multilineSearch: boolean;
};

const featureDefaults: SearchOptions = {
  multilineSearch: false,
};

export const options: SearchOptions = {
  ...featureDefaults,
  multilineSearch: false,
};
