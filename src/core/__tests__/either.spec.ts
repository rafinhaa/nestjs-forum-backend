import { Either, left, right } from "@/core/either";

function doSomething(x: boolean): Either<string, boolean> {
  if (x) return right(true);

  return left("failure");
}

describe("Either", () => {
  it("success returns Right", () => {
    const success = right("success");

    expect(success.value).toEqual("success");
  });

  it("failure returns Left", () => {
    const failure = left("failure");

    expect(failure.value).toEqual("failure");
  });

  it("doSomething returns Right", () => {
    const success = doSomething(true);

    expect(success.isRight()).toBe(true);
    expect(success.isLeft()).toBe(false);
  });

  it("doSomething returns Left", () => {
    const failure = doSomething(false);

    expect(failure.isLeft()).toEqual(true);
    expect(failure.isRight()).toEqual(false);
  });
});
