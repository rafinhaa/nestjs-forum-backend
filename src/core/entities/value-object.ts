import { UniqueEntityID } from "./unique-entity-id";

export abstract class ValueObject<Props> {
  protected props: Props;

  protected constructor(props: Props) {
    this.props = props;
  }

  public equals<T>(vo: ValueObject<T>) {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (vo.props === undefined) {
      return false;
    }

    if (JSON.stringify(vo.props) === JSON.stringify(this.props)) {
      return true;
    }

    return false;
  }
}
