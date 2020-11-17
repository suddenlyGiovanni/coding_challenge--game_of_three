export const flushPromises = (): Promise<void> =>
  new Promise((res) => process.nextTick(res))
