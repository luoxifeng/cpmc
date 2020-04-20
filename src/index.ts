
import { TYPES } from './types';

export { TYPES };

// type PromiseType = 'all' | 'race';

export default function createProcessManagerCreator(): [

];

export default function createProcessManagerCreator<T extends TYPES = TYPES.ALL>({
  type = TYPES.ALL
} = { type: TYPES.ALL }) {
  let baseCount = 0,
    usedCount = 0,
    baseResolve = () => { };
  const allProcess: Promise<any>[] = [];
  const basePromise = new Promise<any>(res => baseResolve = () => res(allProcess));
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

  interface createManagerAll {
    <T>(values: readonly (T | PromiseLike<T>)[]): Promise<T[]>;
  }

  interface createManagerRace {
   
  }

  type createManager<F> = F extends TYPES.ALL ? createManagerAll : createManagerRace;



  function createManager() {
    return basePromise
      .then(Promise[type].bind<any>(Promise));
  }

  return [createProcess, createManager];
}

createProcessManagerCreator.TYPES = TYPES;

