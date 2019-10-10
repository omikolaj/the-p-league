import { Moment } from 'moment';
import * as moment from 'moment';
import { HomeTeam, AwayTeam } from './team.model';

// Represents a match between two teams in any league
export interface Match{
  dateTime?: Moment;
  homeTeam: HomeTeam;
  awayTeam: AwayTeam;

  schedule(date: moment.Moment, time: moment.MomentSetObject, match: Match): void
}