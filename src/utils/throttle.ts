const DEFAULT_DELAY = 200;

/**
 * Creates a throttled function which fires `func` only once per {delay} ms.
 * @param func {Function} the function to throttle.
 * @param delay {number} [delay=200] is a time to wait.
 * @returns {Function} the throttled function.
 **/

export function throttle(
  // eslint-disable-next-line @typescript-eslint/ban-types
  func: Function,
  delay = DEFAULT_DELAY,
  // eslint-disable-next-line @typescript-eslint/ban-types
): Function {
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
      console.log("throttled", func.name);
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
