export interface ActionBase<Type extends string> {
  type: Type
}

export interface ActionMeta<Meta = unknown> {
  meta?: Meta
}

export interface ActionError<Error extends boolean = boolean> {
  error?: Error
}

export interface ActionPayload<Payload = unknown> {
  payload?: Payload
}

export interface ActionWithPayload<Type extends string, Payload>
  extends ActionBase<Type> {
  payload: Payload
}

export interface Action<
  Type extends string,
  Payload = never,
  Meta = never,
  Error extends boolean = never
> extends ActionBase<Type>,
    ActionPayload<Payload>,
    ActionMeta<Meta>,
    ActionError<Error> {}

export interface ActionCreator {
  <
    Type extends string,
    Payload = never,
    Meta = never,
    Error extends boolean = never
  >(
    type: Type,
    payload?: Payload,
    meta?: Meta,
    error?: Error
  ): Action<Type, Payload, Meta, Error>
}

export const actionCreator: ActionCreator = (type, payload, meta, error) => {
  return {
    type,
    ...(payload && { payload }),
    ...(meta && { meta }),
    ...(error && { error }),
  } as const
}
