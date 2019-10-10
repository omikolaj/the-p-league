import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { Sport } from '../sport.enum';

// Represents a single league in any P League sport
export interface League{
  type: Sport;
  teams?: Team[];
  
}