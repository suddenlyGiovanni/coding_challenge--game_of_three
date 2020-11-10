import { beforeEach, describe, expect, it } from '@jest/globals'

import type { IQueue } from '../interfaces'
import { Queue } from '../model/queue'

class MyObj<T> {
  public constructor(
    public el1: T & { toString(): string },
    public el2: T & { toString(): string }
  ) {}

  public toString() {
    return `${this.el1.toString()}|${this.el2.toString()}`
  }
}

describe('queue', () => {
  let queue: IQueue<number>

  // eslint-disable-next-line jest/no-hooks
  beforeEach(() => {
    queue = new Queue<number>()
  })

  it('starts empty', () => {
    expect.hasAssertions()
    expect(queue.size()).toBe(0)
    expect(queue.isEmpty()).toBe(true)
  })

  it('enqueue elements', () => {
    expect.hasAssertions()
    queue.enqueue(1)
    expect(queue.size()).toBe(1)
    queue.enqueue(2)
    expect(queue.size()).toBe(2)
    queue.enqueue(3)
    expect(queue.size()).toBe(3)

    expect(queue.isEmpty()).toBe(false)
  })

  it('dequeue elements', () => {
    expect.hasAssertions()
    queue.enqueue(1)
    queue.enqueue(2)
    queue.enqueue(3)

    expect(queue.dequeue()).toBe(1)
    expect(queue.dequeue()).toBe(2)
    expect(queue.dequeue()).toBe(3)
    expect(queue.dequeue()).toBeUndefined()
  })

  it('implements FIFO logic', () => {
    expect.hasAssertions()
    queue.enqueue(1)
    expect(queue.peek()).toBe(1)
    queue.enqueue(2)
    expect(queue.peek()).toBe(1)
    queue.enqueue(3)
    expect(queue.peek()).toBe(1)

    expect(queue.dequeue()).toBe(1)
    expect(queue.dequeue()).toBe(2)
    expect(queue.dequeue()).toBe(3)
    expect(queue.dequeue()).toBeUndefined()
  })

  it('allows to peek at the front element in the queue without dequeuing it', () => {
    expect.hasAssertions()
    expect(queue.peek()).toBeUndefined()

    queue.enqueue(1)
    expect(queue.peek()).toBe(1)

    queue.enqueue(2)
    expect(queue.peek()).toBe(1)

    queue.dequeue()
    expect(queue.peek()).toBe(2)
  })

  it('returns the correct size', () => {
    expect.hasAssertions()
    expect(queue.size()).toBe(0)
    queue.enqueue(1)
    expect(queue.size()).toBe(1)
    queue.enqueue(2)
    expect(queue.size()).toBe(2)
    queue.enqueue(3)
    expect(queue.size()).toBe(3)

    queue.clear()
    expect(queue.isEmpty()).toBe(true)

    queue.enqueue(1)
    queue.enqueue(2)
    queue.enqueue(3)
    expect(queue.size()).toBe(3)

    queue.dequeue()
    expect(queue.size()).toBe(2)
    queue.dequeue()
    expect(queue.size()).toBe(1)
    queue.dequeue()
    expect(queue.size()).toBe(0)
    queue.dequeue()
    expect(queue.size()).toBe(0)
  })

  it('returns if it is empty', () => {
    expect.hasAssertions()
    expect(queue.isEmpty()).toBe(true)
    queue.enqueue(1)
    expect(queue.isEmpty()).toBe(false)
    queue.enqueue(2)
    expect(queue.isEmpty()).toBe(false)
    queue.enqueue(3)
    expect(queue.isEmpty()).toBe(false)

    queue.clear()
    expect(queue.isEmpty()).toBe(true)

    queue.enqueue(1)
    queue.enqueue(2)
    queue.enqueue(3)
    expect(queue.isEmpty()).toBe(false)

    queue.dequeue()
    expect(queue.isEmpty()).toBe(false)
    queue.dequeue()
    expect(queue.isEmpty()).toBe(false)
    queue.dequeue()
    expect(queue.isEmpty()).toBe(true)
    queue.dequeue()
    expect(queue.isEmpty()).toBe(true)
  })

  it('clears the queue', () => {
    expect.hasAssertions()
    queue.clear()
    expect(queue.isEmpty()).toBe(true)

    queue.enqueue(1)
    queue.enqueue(2)
    expect(queue.isEmpty()).toBe(false)

    queue.clear()
    expect(queue.isEmpty()).toBe(true)
  })

  it('allows to remove an element from the queue regardless of where it sits', () => {
    expect.hasAssertions()
    // arrange
    queue.enqueue(1)
    queue.enqueue(2)
    queue.enqueue(3)
    queue.enqueue(4)

    expect(queue.size()).toBe(4)

    // act
    const removed = queue.remove(3)

    // assert
    expect(queue.size()).toBe(3)
    expect(queue.peek()).toBe(1)
    expect(removed).toBe(3)
  })

  it('returns `undefined` if trying to remove an element that is not present', () => {
    expect.hasAssertions()
    // arrange
    queue.enqueue(1)
    queue.enqueue(2)
    queue.enqueue(3)
    queue.enqueue(4)

    expect(queue.size()).toBe(4)

    // act
    const removed = queue.remove(10)

    // assert
    expect(queue.size()).toBe(4)
    expect(queue.peek()).toBe(1)
    expect(removed).toBeUndefined()
  })
  it('returns toString primitive types', () => {
    expect.hasAssertions()
    expect(queue.toString()).toBe('')

    queue.enqueue(1)
    expect(queue.toString()).toBe('1')

    queue.enqueue(2)
    expect(queue.toString()).toBe('1,2')

    queue.clear()
    expect(queue.toString()).toBe('')

    const queueString = new Queue<string>()
    queueString.enqueue('el1')
    expect(queueString.toString()).toBe('el1')

    queueString.enqueue('el2')
    expect(queueString.toString()).toBe('el1,el2')
  })

  it('returns toString objects', () => {
    expect.hasAssertions()
    const queueMyObj = new Queue<MyObj<number>>()
    expect(queueMyObj.toString()).toBe('')

    queueMyObj.enqueue(new MyObj(1, 2))
    expect(queueMyObj.toString()).toBe('1|2')

    queueMyObj.enqueue(new MyObj(3, 4))
    expect(queueMyObj.toString()).toBe('1|2,3|4')
  })
})
