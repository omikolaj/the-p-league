import { League } from './League.model';

export interface SportType {
  id?: string;
  name: string;
  leagues?: any[];
  readonly?: boolean;
}
