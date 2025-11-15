const DEFAULT_WAITFOR_INTERVAL_MS = 50;

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(() => resolve(), ms));

type WaitForOptions = {
  readonly limit?: number;
  readonly interval?: number;
};

const waitFor = (predicate: () => boolean, options?: WaitForOptions): Promise<void> =>
  new Promise((resolve, reject) => {
    let count = 0;
    const interval = setInterval(() => {
      if (predicate()) {
        clearInterval(interval);
        return resolve();
      }
      if (options?.limit && count >= options?.limit) {
        return reject(count);
      }
      count += 1;
    }, options?.interval ?? DEFAULT_WAITFOR_INTERVAL_MS);
  });

export { sleep, waitFor };
