import * as moment from 'moment';
import SessionSchedule from './session-schedule.model';

export default class TeamSessionSchedule extends SessionSchedule {
	private readonly defaultDate: string = '1-1-1990';
	private readonly playedThisWeek: moment.Moment = moment()
		.clone()
		.subtract(7, 'days')
		.startOf('day');

	protected _lastScheduledGame: moment.Moment = null;
	get lastScheduledGame(): moment.Moment {
		return this._lastScheduledGame || moment(new Date(this.defaultDate));
	}

	set lastScheduledGame(value: moment.Moment) {
		this._lastScheduledGame = value;
	}

	protected _lastPlayedGame: moment.Moment = null;
	get lastPlayedGame(): moment.Moment {
		return this._lastPlayedGame || moment(new Date(this.defaultDate));
	}

	protected _didTeamPlayThisWeek: boolean;
	get didTeamPlayThisWeek(): boolean {
		console.log('Team was scheduled this week: ', this.lastScheduledGame.isAfter(this.playedThisWeek));
		return (this._didTeamPlayThisWeek = this.lastScheduledGame.isAfter(this.playedThisWeek));
	}

	constructor(private lastPlayed?: moment.Moment, private lastScheduled?: moment.Moment) {
		super();
		this._lastPlayedGame = lastPlayed;
		this._lastScheduledGame = lastScheduled;
	}
}
