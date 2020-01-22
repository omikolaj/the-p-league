import { schema } from 'normalizr';

// ==============================Sports, Leagues, Teams schema====================================================

// schema that represents a team
const team = new schema.Entity('teams');

// schema that represents a league where league can have many teams
const league = new schema.Entity('leagues', {
	teams: [team]
});

// schema that represents a sport where sport can have many leagues
const sport = new schema.Entity('sports', {
	leagues: [league]
});

// This is used as a DTO schema to transform incoming JSON file which is a nested object: sports: leagues: [{ teams: [] }]
// Once we transform the json file we will divide it and map it into the three corresponding NGXS states for each incoming object sport, league and team for easier manipulation
export const sportListSchema = [sport];

// ==============================Sessions schema====================================================

// schema that represents a match
const match = new schema.Entity('matches');

// schema that represents a session
const session = new schema.Entity('sessions', {
	matches: [match]
});

export const sessionListSchema = [session];
