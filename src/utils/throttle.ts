const DEFAULT_DELAY = 200;

type ThrottleFn = (...args: unknown[]) => void;

/**
 * The function implemented practice to skip some function calls.
 * @param func {ThrottleFn}
 * @param delay {number}
 * @returns {ThrottleFn}
 */

export function throttle(func: ThrottleFn, delay = DEFAULT_DELAY): ThrottleFn {
  let wait = false;
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
