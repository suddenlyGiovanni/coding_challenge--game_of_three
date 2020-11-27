export interface IEntity<
  ID extends string = string,
  Type extends string = string
> {
  readonly __type: Type
  readonly id: ID
}
