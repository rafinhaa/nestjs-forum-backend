export class Slug {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(slug: string) {
    return new Slug(
      slug
        .normalize("NFKD")
        .toLocaleLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/_/g, "-")
        .replace(/--/, "-")
        .replace(/-$/, "")
    );
  }

  /**
   * Creates a Slug instance from a given text by normalizing, trimming, replacing spaces and special characters with dashes.
   *
   * @param {string} text - The input string to be converted to a slug.
   * @return {Slug} A new instance of Slug representing the input text as a slug.
   */
  static createFromText(text: string): Slug {
    const slugText = text
      .normalize("NFKD")
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/_/g, "-")
      .replace(/--/, "-")
      .replace(/-$/, "");

    return new Slug(slugText);
  }
}
