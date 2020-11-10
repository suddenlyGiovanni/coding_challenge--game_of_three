export interface IQueue<T> {
  /**
   * Reset the Queue
   * @memberof IQueue
   */
  clear(): void

  /**
   * Removes and returns the most recently added member to the collection
   * @returns {(T | undefined)}
   * @memberof IQueue
   */
  dequeue(): T | undefined

  /**
   * Adds a member to the collection
   * @param {T} x
   * @memberof IQueue
   */
  enqueue(x: T): void

  /**
   * Returns a boolean encoding the if the queue is empty
   * @returns {boolean}
   * @memberof IQueue
   */
  isEmpty(): boolean

  /**
   * Returns the most Head of the Queue without removing it
   * @returns {(T | undefined)}
   * @memberof IQueue
   */
  peek(): T | undefined

  /**
   * If element is in the queue, it removes it and then return it.
   * If the element is not in the queue, it returns `undefined`
   * @param {T} x
   * @returns {(undefined | T)}
   * @memberof IQueue
   */
  remove(x: T): undefined | T

  /**
   * Returns the size of the Queue
   * @returns {number}
   * @memberof IQueue
   */
  size(): number

  /**
   * returns an immutable copy of the queue in array form.
   * the first element of the queue is at the head of the array
   * the last element in the queue is at the last position of the array
   * attention: operations performed on the returned array wont modify the internal structure of the
   * queue, but if a mutative operation is performed on an non primitive element type contained,
   * that said operation will be also applied to the queue itself.
   * @returns {ReadonlyArray<T>}
   * @memberof IQueue
   * @internal
   */
  toArray(): ReadonlyArray<Readonly<T>>

  /**
   * Serialize the content of the Queue and returns it
   * @returns {string}
   * @memberof IQueue
   */
  toString(): string
}
