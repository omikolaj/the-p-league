import Match from 'src/app/core/models/schedule/classes/match.model';

/**
 * @description Previews schedule match sorting function. Used by the preview-schedule component
 * @param item the match object
 * @param header string representation of the column name
 * @returns
 */
export function matchSortingFn(item: Match, header: string): string | number {
	switch (header) {
		case 'home':
			return item.homeTeam.name;
		case 'away':
			return item.awayTeam.name;
		case 'date':
			// if did not specify enough times to schedule all matches for every team
			// than some matches will NOT have a dateTime defined. Since we didn't
			// schedule anything for them
			if (item.dateTime) {
				// this will return the number representation of the date
				return item.dateTime.valueOf();
			}
			return;
		default:
			break;
	}
}
