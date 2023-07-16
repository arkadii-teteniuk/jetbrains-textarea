import { throttle } from "./throttle";

jest.useFakeTimers();

describe("Throttle", () => {
  it("Skipped", async () => {
    let i = 0;
    const throttled = throttle(() => i++);

    throttled();
    throttled();
    throttled();
    throttled(); // trailing
    jest.advanceTimersByTime(200);
    expect(i).toEqual(2);
  });

  it("Resumed", async () => {
    let i = 0;
    const throttled = throttle(() => i++);

    throttled();
    jest.advanceTimersByTime(200);
    throttled();
    throttled();
    throttled(); // trailing
    jest.advanceTimersByTime(200);
    expect(i).toEqual(3);
  });

  it("Trailing", async () => {
    let i = 0;
    const throttled = throttle(() => i++);

    throttled(); // fire
    jest.advanceTimersByTime(200);
    throttled(); // fire
    throttled(); // trailing
    jest.advanceTimersByTime(200);

    expect(i).toEqual(3);
  });
});
