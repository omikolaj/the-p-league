import { Sport } from '../sport.enum';
import { Team } from './team.model';
import { Session } from './session.model';

// Represents a single league in any P League sport
export interface League{
  type: Sport;
  teams?: Team[];
  sessions?: Session[];
  name?: string;
}