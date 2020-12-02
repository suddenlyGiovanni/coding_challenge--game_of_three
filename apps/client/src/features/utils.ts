interface WithPayloadType {
  <T>(): (t: T) => { payload: T }
}
export const withPayloadType: WithPayloadType = () => (t) => ({ payload: t })
