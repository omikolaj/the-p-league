import { Moment } from 'moment';
import * as moment from 'moment';

import { HomeTeam, AwayTeam } from './team.model';
import Match from '../classes/match.model';

export interface IMatch{
  dateTime?: Moment;
  homeTeam: HomeTeam;
  awayTeam: AwayTeam;

  schedule(date: moment.Moment, time: moment.MomentSetObject, match: Match): void
}