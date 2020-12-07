export interface WithPayloadType {
  <T>(): (t: T) => { payload: T }
}
export const withPayloadType: WithPayloadType = () => (t) => ({ payload: t })

export type Identity = <A>(a: A) => A
export const trace: Identity = (a) => {
  console.log(a)
  return a
}
