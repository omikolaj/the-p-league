import { League } from 'src/app/views/schedule/models/interfaces/League.model';

export interface SelectedLeagues {
  sportTypeID: string;
  leagues: League[];
}
