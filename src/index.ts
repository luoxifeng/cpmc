
import { TYPES } from './types';

type j = any[];

export function createProcessManagerCreator({
  type = TYPES.ALL
} = { type: TYPES.ALL }) {
  let baseCount = 0,
    usedCount = 0,
    baseResolve = () => { };
  const allProcess: Promise<any>[] = [];
  const basePromise = new Promise(res => baseResolve = () => res(allProcess));
  const resolveWrapper = <T>(resolve: (res: T) => void) => (arg: T) => {
    (type === TYPES.RACE || (baseCount === ++usedCount)) && baseResolve();
    resolve(arg);
  };

  const createProcess = <T>() => {
    let resolve = (res: T) => console.log(res);
    let reject = (res: any) => console.error(res);
    const promise = new Promise<T>((...cbs) => [resolve, reject] = cbs);
    allProcess.push(promise);
    baseCount++;

    return {
      resolve: resolveWrapper(resolve),
      reject: (arg: any) => {
        baseResolve();
        reject(arg);
      }
    };
  };

  const createManager = (...args: any[]) => basePromise
    .then(Promise[type].bind<any>(Promise))
    .then(...args);

  return [createProcess, createManager];
}

createProcessManagerCreator.TYPES = TYPES;

