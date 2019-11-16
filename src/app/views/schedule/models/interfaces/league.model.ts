import { Sport } from '../sport.enum';
import { Team } from './team.model';
import { Session } from './session.model';
import { SportType } from './sport-type.model';

// Represents a single league in any P League sport
export interface League {
  id?: string;
  type?: string;
  teams?: Team[];
  sessions?: Session[];
  name: string;
  selected?: boolean;
  readonly?: boolean;
  sportTypeID?: string;
}
