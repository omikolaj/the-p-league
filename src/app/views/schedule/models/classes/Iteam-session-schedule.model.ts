import * as moment from 'moment';

export default abstract class ITeamSessionSchedule{
  protected abstract _lastScheduledGame: moment.Moment;
  abstract get lastScheduledGame(): moment.Moment
  abstract set lastScheduledGame(value: moment.Moment);

  protected abstract _lastPlayedGame: moment.Moment;
  abstract get lastPlayedGame(): moment.Moment;

  protected abstract _didTeamPlayThisWeek: boolean;
  abstract get didTeamPlayThisWeek(): boolean;
}