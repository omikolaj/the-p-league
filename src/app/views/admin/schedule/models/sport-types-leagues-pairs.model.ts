import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';

// export interface SportTypesLeaguesPairs {
//   sportName: string;
//   sportID: string;
//   leagueNames?: LeagueNameIDPair[];
// }

// interface LeagueNameIDPair {
//   id: string;
//   name: string;
// }

// This creates an intersection type using built in utility types. Pick, enables me to pass in the type I want to use and then specify the arguments from that type I want to utilize. The '&' allows me to then add onto this by specifying that I want to create an object with the leagues array which contains an object of type league with id and name property
export type SportTypesLeaguesPairs = Pick<SportType, 'id' | 'name'> & {
	leagues: Pick<League, 'id' | 'name'>[];
};
