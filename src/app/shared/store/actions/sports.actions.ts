import { SportType } from 'src/app/core/models/schedule/sport-type.model';

export class InitializeSports {
	static readonly type = '[Schedule] InitializeSports';
	constructor(public sports: { [key: string]: SportType }) {}
}
export class AddSportType {
	static readonly type = '[Schedule API] AddSportType';
	constructor(public newSportType: SportType) {}
}
export class AddLeagueIDsToSportType {
	static readonly type = '[Schedule] AddLeagueIDsToSportType';
	constructor(public payload: { sportTypeID: string; ids: string[] }[]) {}
}
export class UpdateSportType {
	static readonly type = '[Schedule API] UpdateSportType';
	constructor(public updatedSportType: SportType) {}
}
export class DeleteSportType {
	static readonly type = '[Schedule API] DeleteSportType';
	constructor(public id: string) {}
}
export class DeleteLeagueIDsFromSportType {
	static readonly type = '[Schedule API] DeleteLeagueIDsFromSportType';
	constructor(public sportTypeID: string, public deleteIDs: string[]) {}
}
