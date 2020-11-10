import type { IQueue } from '../interfaces'

export class Queue<T> implements IQueue<T> {
  private items: T[]

  public constructor() {
    this.items = []
  }

  public clear(): void {
    this.items = []
  }

  public dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined
    }
    return this.items.shift()
  }

  public enqueue(x: T): void {
    this.items.push(x)
  }

  public isEmpty(): boolean {
    return this.size() < 1
  }

  public peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined
    }
    return this.items[0]
  }

  public size(): number {
    return this.items.length
  }

  public toString(): string {
    return this.items.toString()
  }

  public remove(item: T): undefined | T {
    const index = this.items.indexOf(item)
    if (index === -1) return undefined
    return this.items.splice(index, 1)[0]
  }

  public toArray(): readonly Readonly<T>[] {
    return this.items.slice()
  }
}
