/**
 * Is a Proxy-helper to log accessing to cached data.
 * @implements {Proxy}
 */

export const loggerProxy: ProxyHandler<Record<string, string>> = {
  get(target, prop, receiver) {
    const cachedValue = Reflect.get(target, prop, receiver);

    if (cachedValue) {
      console.log(`Cache: get from ${prop.toString()}`);
    } else {
      console.log(`Cache: no cached value for ${prop.toString()}`);
    }

    return cachedValue;
  },

  set(target, prop, receiver, newValue) {
    console.log(`Cache: set for ${prop.toString()}`);
    return Reflect.set(target, prop, receiver, newValue);
  },
};

export type CustomCache = {
  print: () => void;
  reset: () => void;
  save: (request: string, text: string) => void;
  get: (request: string) => string | null;
};

/**
 * Creates cache for reduce calculations amount.
 */

export const getCache = (): CustomCache => {
  let _cache: Record<string, string> = new Proxy({}, loggerProxy);

  return {
    print() {
      console.log(_cache);
    },
    reset() {
      _cache = new Proxy({}, loggerProxy);
    },
    get(request) {
      return _cache[request] ?? null;
    },
    save(request, text) {
      _cache[request] = text;
    },
  };
};
