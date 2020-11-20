export type ISocketEvent =
  //#region  SYSTEM RESERVED EVENTS
  | 'connect'
  | 'connection'
  | 'disconnect'
  | 'disconnecting'
  | 'connect_error'
  | 'connect_timeout'
  | 'reconnect_attempt'
  | 'reconnect_error'
  | 'reconnect_failed'
  | 'reconnecting'
  | 'reconnect'
  | 'ping'
  | 'pong'
  | 'newListener'
  | 'removeListener'
  //#endregion SYSTEM RESERVED EVENTS
  //#region CUSTOM EVENTS
  | 'heartbeat'
  | 'hello'
//#endregion

export enum SocketEvent {
  //#region SYSTEM RESERVED EVENTS

  /**
   * Fired upon a connection from client.
   * socket (Socket) socket connection with client
   * @example
   * ```
   * io.on('connection', (socket) => {
   *  // ...
   * });
   *
   * io.of('/admin').on('connection', (socket) => {
   *  // ...
   * });
   * ```
   */
  CONNECT = 'connect',
  /**
   * Synonym of Event: ‘connect’.
   */
  CONNECTION = 'connection',
  /**
   * Fired upon disconnection
   * reason (String) the reason of the disconnection (either client or server-side):
   *
   * | `transport error`
   * | `server namespace disconnect`
   * | `client namespace disconnect`
   * | `ping timeout`
   * | `transport close`
   * @example
   * ```
   * io.on('connection', (socket) => {
   *  socket.on('disconnect', (reason) => {
   *    // ...
   *   });
   * });
   * ```
   */
  DISCONNECT = 'disconnect',

  /**
   * Fired when the client is going to be disconnected (but hasn’t left its rooms yet).
   * reason (String) the reason of the disconnection (either client or server-side)
   * @example
   * ```
   * io.on('connection', (socket) => {
   *  socket.on('disconnecting', (reason) => {
   *    console.log(socket.rooms); // Set { ... }
   *  });
   * });
   * ```
   */
  DISCONNECTING = 'disconnecting',

  /**
   * Fired upon a connection error
   */
  CONNECT_ERROR = 'connect_error',

  /**
   * Fired upon a connection timeout
   */
  CONNECT_TIMEOUT = 'connect_timeout',

  /**
   * Fired upon an attempt to reconnect
   */
  RECONNECT_ATTEMPT = 'reconnect_attempt',

  /**
   * Fired upon a reconnection attempt error
   */
  reconnect_error = 'reconnect_error',

  /**
   * Fired when the client couldn’t reconnect within reconnectionAttempts
   */
  RECONNECT_FAILED = 'reconnect_failed',

  /**
   * Alias for “reconnect_attempt”
   */
  RECONNECTING = 'reconnecting',

  /**
   * Fired upon a successful reconnection
   */
  RECONNECT = 'reconnect',

  /**
   * Fired when a `ping` is sent to the server
   */
  PING = 'ping',

  /**
   * Fired when a `pong` is received from the server
   */
  PONG = 'pong',

  NEW_LISTENER = 'newListener',

  REMOVE_LISTENER = 'removeListener',

  //#endregion SYSTEM RESERVED EVENTS

  HEARTBEAT = 'heartbeat',
  HELLO = 'hello',
}
