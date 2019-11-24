// TODO Convert leagues types from any[] to string[]
export interface SportType {
  id?: string;
  name: string;
  leagues?: any[];
  readonly?: boolean;
}
