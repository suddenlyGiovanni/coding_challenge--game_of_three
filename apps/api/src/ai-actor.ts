/* eslint-disable @typescript-eslint/no-inferrable-types */
import type {
  IAction,
  IMatchStatePlayingSerialized,
  IMatchStateSerialized,
  IObserver,
  ISubject,
} from './interfaces'
import { AI, MatchState } from './model'

/**
 * where `b`, the `divisor`
 * and `r` the reminder
 * this rule follows
 * `0 ≤ r < |b|`
 *
 * such that for a `divisor` of value 3
 * all the possible value for the reminder are: `0 | 1 | 2`
 */
type Reminder = 0 | 1 | 2

export class AIActor<PlayerID extends string>
  implements
    IObserver<IMatchStateSerialized>,
    Omit<ISubject<IAction>, 'notifyObservers'> {
  static MAX_SECONDS = 4

  static MIN_SECONDS = 1

  private readonly ai: AI<PlayerID>

  private readonly observers: IObserver<IAction>[]

  private readonly remainderToActionMap: Map<Reminder, IAction> = new Map<
    Reminder,
    IAction
  >([
    [0, 0],
    [1, -1],
    [2, 1],
  ])

  public constructor(ai: AI<PlayerID>) {
    this.ai = ai
    this.observers = []
  }

  public registerObserver(observer: IObserver<IAction>): void {
    this.observers.push(observer)
  }

  public removeObserver(observer: IObserver<IAction>): void {
    const index = this.observers.indexOf(observer)
    if (index !== -1) {
      this.observers.splice(index, 1)
    }
  }

  /**
   * will be invoked by the ISubject with a new state object.
   * the AIActor will check if it is his turn to operate
   * ```pseudo
   * IF is AI turn
   *  THEN will make a move
   * ELSE will do nothing
   * ```
   * @param {IMatchState} state
   * @memberof AIActor
   */
  public update(state: IMatchStateSerialized): void {
    if (
      MatchState.isIMatchStatePlayingSerialized(state) &&
      state.nextTurn === this.ai.getId()
    ) {
      this.move(state)
    }
  }

  private move(state: IMatchStatePlayingSerialized): void {
    this.pause(this.randomDelayMs())
      .then(() => {
        /**
         * EUCLIDEAN DIVISION THEOREM (wikipedia):
         * Given two integers `a` and `b`, with `b ≠ 0`, there exist unique integers `q` and `r`
         * such that
         * `a = bq + r`
         * and
         * `0 ≤ r < |b|`,
         * where `|b|` denotes the absolute value of `b`.
         * naming:
         * - `a` is called the `dividend`,
         * - `b` is called the `divisor`,
         * - `q` is called the `quotient` and
         * - `r` is called the remainder
         *
         * this means that in the context of the 'game of three' rules where:
         * `output = (input + x) / 3`
         * where x could only be: -1 | 0 | 1
         * all the possible values that the reminder might assume are  0 ≤ r < |d| :
         * [ 0, 1, 2 ]
         * - a reminder of `0` means that the input is divisible by 3 and produce a valid output
         * - a reminder of `1` means that adding `-1` to the input will make such addition result
         *  dividable by three, hence produce a valid outputs
         * - a reminder of `2` means that adding `1` to the input will make such addition result
         *  dividable by three, hence produce a valid outputs
         */

        const reminder = (state.outputNumber % 3) as 0 | 1 | 2
        const action = this.remainderToActionMap.get(reminder)
        return action
      })
      .then((action) => this.notifyObservers(action))
      .catch((error) => console.error(error))
  }

  private notifyObservers(action: IAction): void {
    this.observers.forEach((observer) => {
      observer.update(action)
    })
  }

  /**
   * wait/sleep for a random interval
   * @private
   * @param {number} [delay=1000]
   * @returns {Promise<void>}
   * @memberof AIActor
   */
  private pause(delay: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, delay)
    })
  }

  /**
   * returns a random delay in milliseconds between
   * - AIActor.MIN_SECONDS and
   * - AIActor.MAX_SECONDS inclusive
   * @private
   * @returns {number} milliseconds
   * @memberof AIActor
   */
  private randomDelayMs(): number {
    const min = Math.ceil(AIActor.MIN_SECONDS)
    const max = Math.floor(AIActor.MAX_SECONDS)
    return Math.floor(Math.random() * (max - min + 1) + min) * 1000
  }
}
