export function combineManagers({ type = TYPES.ALL, managers }) {
  const pro = Promise[type](managers.map(manager => manager()));
  return (...args) => pro.then(...args);
}