import NewSessionSchedule from 'src/app/views/admin/schedule/models/session/new-session-schedule.model';

export class CreateSchedules {
	static readonly type = '[Schedule] CreateSchedules';
	constructor(public newSessions: NewSessionSchedule[]) {}
}

export class GetSchedules {
	static readonly type = '[Schedule] GetSchedules';
	constructor() {}
}
