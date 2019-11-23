import { schema } from 'normalizr';

// schema that represents a team
export const team = new schema.Entity('teams');

// schema that represents a league where league can have many teams
export const league = new schema.Entity('leagues', {
  teams: [team]
});

// schema that represents a sport where sport can have many leagues
export const sport = new schema.Entity('sports', {
  leagues: [league]
});

// This is used as a temporary schema to transform incoming JSON file which is a nested object: sports: leagues: [{ teams: [] }]
// Once we transform the json file we will divide it and map it into the three corresponding NGXS states for each incoming object sport, league and team for easier manipulation
export const sportListSchema = [sport];
