export interface SportTypesLeaguesPairs {
  sportName: string;
  sportID: string;
  leagueNames?: LeagueNameIDPair[];
}

interface LeagueNameIDPair {
  id: string;
  name: string;
}
