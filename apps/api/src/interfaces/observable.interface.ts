export interface ISubject<T> {
  notifyObservers(): void
  registerObserver(observer: IObserver<T>): void
  removeObserver(observer: IObserver<T>): void
}

export interface IObserver<T> {
  update(event: T): void
}
