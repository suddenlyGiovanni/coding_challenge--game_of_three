export interface EventPayloadBase<Type extends string> {
  type: Type
}

export interface EventPayloadMeta<Meta = unknown> {
  meta?: Meta
}

export interface EventPayloadError<Error extends boolean = boolean> {
  error?: Error
}

export interface EventPayloadPayload<Payload = unknown> {
  payload?: Payload
}

export interface IEventPayload<
  Type extends string,
  Payload = never,
  Meta = never,
  Error extends boolean = never
> extends EventPayloadBase<Type>,
    EventPayloadPayload<Payload>,
    EventPayloadMeta<Meta>,
    EventPayloadError<Error> {}
