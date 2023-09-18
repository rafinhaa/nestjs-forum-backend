import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = [];

  async findById(questionId: string): Promise<Notification | null> {
    return (
      this.items.find((question) => question.id.toString() === questionId) ??
      null
    );
  }

  async create(notification: Notification) {
    this.items.push(notification);
  }

  async save(notification: Notification) {
    const index = this.items.findIndex((q) => q.id === notification.id);
    this.items[index] = notification;
  }
}
