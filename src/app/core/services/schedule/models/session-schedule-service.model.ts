import * as moment from 'moment';
import Match from 'src/app/views/schedule/models/classes/match.model';
import { MatchTime } from 'src/app/views/schedule/models/interfaces/match-time.model';
import { TimesOfDay } from 'src/app/views/schedule/models/interfaces/times-of-day.model';
import { MatchDay } from 'src/app/views/schedule/models/match-days.enum';
import { ISessionSchedule } from './interfaces/Isession-schedule.model';

export default abstract class ScheduleService {
	protected abstract nextDay: MatchDay;
	abstract get sessionSchedule(): ISessionSchedule;
	abstract set sessionSchedule(value: ISessionSchedule);

	protected constructor() {}
	abstract generateSchedule(sessionSchedule: ISessionSchedule): Match[];

	generateMatchUpTimes(matches: Match[]): Match[] {
		// create a copy of the matches array
		matches = matches.slice();

		const current = this.sessionSchedule.startDate.clone();
		let index = 0;

		while (current.isSame(this.sessionSchedule.endDate) || current.isBefore(this.sessionSchedule.endDate)) {
			const currentDayNum: number = current.isoWeekday();
			// the current date includes one of the days we want to schedule a game on
			// dtRanges.days is Tuesday, Friday, Sunday
			if (this.sessionSchedule.desiredDays.includes(currentDayNum)) {
				// get next available time
				const listOfMatchTimes = this.returnTimesForGivenDay(currentDayNum);

				for (let j = 0; j < listOfMatchTimes.length; j++) {
					if (index >= matches.length) break;

					const time: moment.MomentSetObject = this.getNextAvailableTime(listOfMatchTimes) as moment.MomentSetObject;
					const nextMatch: Match = matches[index];
					nextMatch.schedule(current, time, nextMatch);
					index++;
				}
			}
			const requiredDays = this.computeNumberOfDaysNeeded(currentDayNum);
			current.add(requiredDays, 'days');
		}
		return matches;
	}

	computeNumberOfDaysNeeded(currentDayNum: MatchDay): number {
		let nextDayNum: MatchDay = this.getNextAvailableDay();

		if (currentDayNum < nextDayNum) {
			nextDayNum = nextDayNum - currentDayNum;
		} else {
			// if current day is bigger than nextDayNum and it is not sunday
			// figure out how many days we have to add to current to get to nextDay
			if (currentDayNum !== MatchDay.Sunday) {
				// figure out how many days left in the week there are
				const daysLeftInWeek = 7 - currentDayNum;
				nextDayNum = daysLeftInWeek + nextDayNum;
			}
		}

		return nextDayNum;
	}

	// Returns next available time when the times array is sorted from earliest games to latest
	// It will modify the array, but moving first item, in the last place
	getNextAvailableTime(times: MatchTime[]): MatchTime {
		const time: MatchTime = times[0];
		times.splice(times.length - 1, 1, times.shift());
		return time;
	}

	getNextAvailableDay(): MatchDay {
		if (this.nextDay === MatchDay.None || this.nextDay === this.sessionSchedule.desiredDays[0]) {
			return (this.nextDay = this.sessionSchedule.desiredDays.reduce((previousDay, currentDay) => Math.min(previousDay, currentDay)));
		} else {
			return (this.nextDay = this.findNextLargestNumber());
		}
	}

	findNextLargestNumber(): MatchDay {
		let next = 0,
			i = 0;
		for (; i < this.sessionSchedule.desiredDays.length; i++) {
			if (this.sessionSchedule.desiredDays[i] > this.nextDay) {
				next = this.sessionSchedule.desiredDays[i];
			}
		}
		return next;
	}

	returnTimesForGivenDay(currentDayNum: number): MatchTime[] {
		const timesForCurrentDay: TimesOfDay = this.sessionSchedule.timesOfDays.find((timesOfDay) => timesOfDay[MatchDay[currentDayNum]] !== undefined);

		return [];//timesForCurrentDay[MatchDay[currentDayNum]].sort((a, b) => a.hour - b.hour);
	}
}
