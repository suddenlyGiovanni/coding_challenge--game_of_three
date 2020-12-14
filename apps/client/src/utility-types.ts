/* eslint-disable @typescript-eslint/no-explicit-any */
export type Tuple<T extends unknown[]> = readonly [...T]

export type Tuple2<K, V> = Tuple<[K, V]>

export type Assert<
  T1,
  T2,
  _Check1 = T1 extends T2 ? true : false,
  _Check2 = T2 extends T1 ? true : false
> = false extends _Check1 ? false : false extends _Check2 ? false : true

export type ToEventTupleDiscriminatedUnion<
  EventDictionary extends Record<string | number | symbol, any>
> = {
  [EventName in keyof EventDictionary]: Tuple2<
    EventName,
    EventDictionary[EventName]
  >
}[keyof EventDictionary]
