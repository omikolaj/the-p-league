/**
 * @param  {T} incoming
 * @param  {T} existing
 * @returns T
 * Updates entity object returning fresh copy of passed in entity
 */
export function updateEntity<T>(incoming: T, existing: T): T {
  let updated: T = existing;

  for (let index = 0; index < Object.getOwnPropertyNames(incoming).length; index++) {
    const key = Object.getOwnPropertyNames(incoming)[index];
    updated[key] = incoming[key];
  }
  return updated;
}

/**
 * @param  {{[key:string]:{entities:any}}} entitiesToMerge
 *  This method is intended to be used with normalizr.js library. In order to denormalize the state, you have to pass in the entire state as a single object. To avoid having sports, leagues and teams all inside one entities object, they are seperated into their own NGXS state files. This class is intended to union all three of those entities. this.store.selectSnapshot(state => state) will return an object that will looks something like this {sports: {...}, leagues: {...}, teams: {...}}. Plus any other state that might be added in the future
 */
export function unionEntities(entitiesToMerge: { [key: string]: { entities: any } }) {
  let merged = {};

  for (let index = 0; index < Object.getOwnPropertyNames(entitiesToMerge).length; index++) {
    const key = Object.getOwnPropertyNames(entitiesToMerge)[index];
    merged[key] = entitiesToMerge[key].entities;
  }
  return merged;
}
