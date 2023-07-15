import { getCache } from "./cache";

describe("Cache", () => {
  it("Basic", () => {
    const cache = getCache();
    const value = "str1";
    cache.save("s", value);
    expect(cache.get("s")).toEqual(value);
  });

  it("There is no saved value", () => {
    const cache = getCache();
    expect(cache.get("s")).toEqual(null);
  });

  it("Check reset", () => {
    const cache = getCache();
    const value = "str1";
    cache.save("s", value);
    expect(cache.get("s")).toEqual(value);
    cache.reset();
    expect(cache.get("s")).toEqual(null);
  });

  it("Rewrite", () => {
    const cache = getCache();
    const value1 = "str1";
    const value2 = "str2";
    cache.save("s", value1);
    expect(cache.get("s")).toEqual(value1);
    cache.save("s", value2);
    expect(cache.get("s")).toEqual(value2);
  });
});
