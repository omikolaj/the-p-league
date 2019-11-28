import { SportType } from "src/app/views/schedule/models/interfaces/sport-type.model";
import { League } from "src/app/views/schedule/models/interfaces/League.model";

// export interface SportTypesLeaguesPairs {
//   sportName: string;
//   sportID: string;
//   leagueNames?: LeagueNameIDPair[];
// }

// interface LeagueNameIDPair {
//   id: string;
//   name: string;
// }

export type SportTypesLeaguesPairs = Pick<SportType, "id" | "name"> & {
  leagues: Pick<League, "id" | "name">[];
};
