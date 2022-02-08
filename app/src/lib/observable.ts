type Observer<T> = (_value: T) => void

export interface Notifier<T> {
  subscribe(_observer: Observer<T>): void
}

export class NotificationSubject<T> implements Notifier<T> {
  private observers: Observer<T>[] = []

  subscribe(observer: Observer<T>) {
    return this.observers.push(observer);
  }

  notify(value: T) {
    this.observers.forEach(observer => observer(value));
  }

  get observable() {
    return this as Notifier<T>
  }
}
