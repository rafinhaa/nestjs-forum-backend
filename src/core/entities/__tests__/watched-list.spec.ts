import { WatchedList } from "@/core/entities/watched-list";

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b;
  }
}

describe("watched list", () => {
  it("should be able to create a watched list with initial items", () => {
    const list = new NumberWatchedList([1, 2, 3]);

    expect(list.getItems()).toEqual([1, 2, 3]);
  });

  it("should be able to add new itens to the list", () => {
    const list = new NumberWatchedList([1, 2, 3]);
    list.add(4);

    expect(list.currentItems).toEqual([1, 2, 3, 4]);
    expect(list.getNewItems()).toEqual([4]);
  });

  it("should be able to add remove itens to the list", () => {
    const list = new NumberWatchedList([1, 2, 3]);
    list.remove(2);

    expect(list.currentItems).toEqual([1, 3]);
    expect(list.getRemovedItems()).toEqual([2]);
  });

  it("should be able to add an item even if it was removed before", () => {
    const list = new NumberWatchedList([1, 2, 3]);
    list.remove(2);
    list.add(2);

    expect(list.currentItems).toEqual([1, 3, 2]);
    expect(list.getRemovedItems()).toEqual([]);
    expect(list.getNewItems()).toEqual([]);
  });

  it("should be able to add an item even if it was added before", () => {
    const list = new NumberWatchedList([1, 2, 3]);
    list.add(4);
    list.remove(4);

    expect(list.currentItems).toEqual([1, 2, 3]);
    expect(list.getRemovedItems()).toEqual([]);
    expect(list.getNewItems()).toEqual([]);
  });

  it("should be able to update watched list items", () => {
    const list = new NumberWatchedList([1, 2, 3]);
    list.update([1, 3, 5]);

    expect(list.currentItems).toEqual([1, 3, 5]);
    expect(list.getRemovedItems()).toEqual([2]);
    expect(list.getNewItems()).toEqual([5]);
  });

  it("should be able to check if an item exists", () => {
    const list = new NumberWatchedList([1, 2, 3]);

    expect(list.exists(1)).toBe(true);
  });

  it("should be able to return an empty list", () => {
    const list = new NumberWatchedList();

    expect(list.getItems()).toEqual([]);
  });
});
