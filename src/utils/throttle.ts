const DEFAULT_DELAY = 200;

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
type ThrottleFunc<T extends any[] = any[]> = (...args: T) => void;

export function throttle(
  func: ThrottleFunc,
  delay = DEFAULT_DELAY,
): ThrottleFunc {
  let wait = false;

  if (typeof func !== "function") {
    throw new TypeError('"func" must be a function');
  }

  let trailing: NodeJS.Timeout | null = null;

  return (...args) => {
    trailing && clearTimeout(trailing);
    trailing = setTimeout(() => {
      func(...args);
    }, delay);

    if (wait) {
      return;
    }

    clearTimeout(trailing);
    func(...args);
    wait = true;
    setTimeout(() => {
      wait = false;
    }, delay);
  };
}
