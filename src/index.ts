const TYPES = { ALL: 'all', RACE: 'race'};

export function createProcessManagerCreator({ type = TYPES.ALL } = { type: TYPES.ALL }) {
  let baseCount = 0, usedCount = 0, baseResolve;
  const allProcess = [];
  const basePromise = new Promise(res => baseResolve = res);
  const resolveWrapper = resolve => arg => {
    (type === TYPES.RACE || (baseCount === ++usedCount)) && baseResolve();
    resolve(arg);
  };
  const createProcess = () => {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    allProcess.push(promise);
    baseCount++;
    return {
      resolve: resolveWrapper(resolve),
      reject: arg => {
        baseResolve();
        reject(arg);
      }
    };
  };
  const createManager = (...args) => basePromise
    .then(() =>  Promise[type](allProcess)).then(...args);

  return [createProcess, createManager];
}

createProcessManagerCreator.TYPES = TYPES;

