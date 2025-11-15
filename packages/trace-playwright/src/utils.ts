const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(() => resolve(), ms));
const waitFor = async (predicate: () => boolean, limit?: number): Promise<void> =>
  new Promise(async (resolve, reject) => {
    let count = 0;
    while (true) {
      if (predicate()) {
        return resolve();
      }
      if (limit && count >= limit) {
        return reject(count);
      }
      await sleep(50);
      count += 1;
    }
  });

export { sleep, waitFor };
