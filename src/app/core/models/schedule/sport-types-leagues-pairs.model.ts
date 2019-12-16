import { League } from 'src/app/core/models/schedule/league.model';
import { SportType } from 'src/app/core/models/schedule/sport-type.model';

// This creates an intersection type using built in utility types. Pick, enables me to pass in the type I want to use and then specify the arguments from that type I want to utilize. The '&' allows me to then add onto this by specifying that I want to create an object with the leagues array which contains an object of type league with id and name property
export type SportTypesLeaguesPairs = Pick<SportType, 'id' | 'name'> & {
	leagues: Pick<League, 'id' | 'name'>[];
};
