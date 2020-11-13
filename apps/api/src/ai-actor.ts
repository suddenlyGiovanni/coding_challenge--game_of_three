import type {
  IMatchStatePlayingSerialized,
  IMatchStateSerialized,
  IObserver,
  ISubject,
} from './interfaces'
import { AI } from './model/ai'
import { MatchState } from './model/match-state'

export type TurnAction = -1 | 0 | 1

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
    Omit<ISubject<TurnAction>, 'notifyObservers'> {
  static MAX_SECONDS = 5

  static MIN_SECONDS = 1

  private readonly ai: AI<PlayerID>

  private readonly map: Map<Reminder, TurnAction> = new Map<
    Reminder,
    TurnAction
  >([
    [0, 0],
    [1, -1],
    [2, 1],
  ])

  private readonly observers: IObserver<TurnAction>[]

  public constructor(ai: AI<PlayerID>) {
    this.ai = ai
    this.observers = []
  }

  public registerObserver(observer: IObserver<TurnAction>): void {
    this.observers.push(observer)
  }

  public removeObserver(observer: IObserver<TurnAction>): void {
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
  public async update(state: IMatchStateSerialized): Promise<void> {
    if (
      MatchState.isIMatchStatePlayingSerialized(state) &&
      state.currentTurn === this.ai.getId()
    ) {
      await this.move(state)
    }
  }

  private async move(state: IMatchStatePlayingSerialized): Promise<void> {
    await this.thinkingDelay()

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
    const action = this.map.get(reminder)
    this.notifyObservers(action)
  }

  private notifyObservers(action: TurnAction): void {
    this.observers.forEach((observer) => {
      observer.update(action)
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
  private randomThinkDelayMs(): number {
    const min = Math.ceil(AIActor.MIN_SECONDS)
    const max = Math.floor(AIActor.MAX_SECONDS)
    return Math.floor(Math.random() * (max - min + 1) + min) * 1000
  }

  /**
   * wait/sleep for a random interval
   * @private
   * @returns {Promise<void>}
   * @memberof AIActor
   */
  private thinkingDelay(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, this.randomThinkDelayMs())
    })
  }
}
