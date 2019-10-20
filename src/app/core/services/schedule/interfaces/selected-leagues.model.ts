import { League } from 'src/app/views/schedule/models/interfaces/League.model';

export interface SelectedLeagues{
  [sportType: string]: Array<League>;
}