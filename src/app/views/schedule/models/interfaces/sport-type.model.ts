import { League } from './League.model';

export interface SportType{
  name: string;
  leagues?: League[];
}