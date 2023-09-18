import { AggregateRoot } from "@/core/entities/aggregate-root";
import { DomainEvent } from "../domain-event";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvents } from "../domain-events";

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date = new Date();
  private aggregate: CustomAggregate;

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date();
    this.aggregate = aggregate;
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null);

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

    return aggregate;
  }
}

describe("Domain Events", () => {
  it("should be able to dispatch events", () => {
    const callBackSpy = vi.fn();

    DomainEvents.register(callBackSpy, CustomAggregateCreated.name);

    const aggregate = CustomAggregate.create();

    expect(aggregate.domainEvents.length).toBe(1);

    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    expect(callBackSpy).toHaveBeenCalled();
    expect(aggregate.domainEvents.length).toBe(0);
  });
});
