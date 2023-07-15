import { throttle } from "./throttle";
import { wait } from "./wait";

describe("Throttle", () => {
  it("Skipped", async () => {
    let i = 0;
    const throttled = throttle(function () {
      i++;
    });

    throttled();
    throttled();
    throttled();
    throttled(); // trailing
    await wait(200);
    expect(i).toEqual(2);
  });

  it("Resumed", async () => {
    let i = 0;
    const throttled = throttle(function () {
      i++;
    });

    throttled();
    await wait(200);
    throttled();
    throttled();
    throttled(); // trailing
    await wait(200);
    expect(i).toEqual(3);
  });

  it("Trailing", async () => {
    let i = 0;
    const throttled = throttle(function () {
      i++;
    });

    throttled(); // fire
    await wait(200);
    throttled(); // fire
    throttled(); // trailing
    await wait(200);

    expect(i).toEqual(3);
  });
});
