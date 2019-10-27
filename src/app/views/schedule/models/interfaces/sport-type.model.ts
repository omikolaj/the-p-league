import { League } from "./League.model";

export interface SportType {
  id?: string;
  name: string;
  leagues?: League[];
  readonly?: boolean;
}
