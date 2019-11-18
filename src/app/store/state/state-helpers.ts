import { cloneDeep } from 'lodash';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
/**
 * @param  {Team} incoming
 * @param  {Team} existing
 * @returns Team
 * Updates a single with values that have changed returning fresh copy
 */
export function updateTeam(incoming: Team, existing: Team): Team {
  let updated: Team = cloneDeep(existing);
  console.warn(
    'state-helpers.updateTeam. See if we can get rid of cloneDeep lodash dependency. When we do { ...existing } does it also clone properties that are classes? Check with Object.isFrozen(existing.sessionSchedule)'
  );
  // does leagueID exist
  if (incoming.leagueID) {
    // if leagueIDs are different, update
    if (existing.leagueID !== incoming.leagueID) {
      updated.leagueID = incoming.leagueID;
    }
  }
  if (incoming.name) {
    if (existing.name !== incoming.name) {
      updated.name = incoming.name;
    }
  }
  if (incoming.selected) {
    if (existing.selected !== incoming.selected) {
      updated.selected = incoming.selected;
    }
  }
  return updated;
}

/**
 * @param  {League} incoming
 * @param  {League} existing
 * @returns League
 * Updates a single with values that have changed returning fresh copy
 */
export function updateLeague(incoming: League, existing: League): League {
  let updated: League = cloneDeep(existing);
  console.warn(
    'state-helpers.updateLeague. See if we can get rid of cloneDeep lodash dependency. When we do { ...existing } does it also clone properties that are classes? Check with Object.isFrozen(existing.sessions)'
  );
  // does sportTypeID exist
  if (incoming.sportTypeID) {
    // if sportTypeIDs are different, update
    if (existing.sportTypeID !== incoming.sportTypeID) {
      updated.sportTypeID = incoming.sportTypeID;
    }
  }
  if (incoming.name) {
    if (existing.name !== incoming.name) {
      updated.name = incoming.name;
    }
  }
  if (incoming.selected) {
    if (existing.selected !== incoming.selected) {
      updated.selected = incoming.selected;
    }
  }
  if (incoming.type) {
    if (existing.type !== incoming.type) {
      updated.type = incoming.type;
    }
  }
  return updated;
}
