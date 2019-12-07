import { GameTime } from './game-time.model';

export interface GameDay {
	gamesDay: string;
	gamesTimes?: GameTime[];
}
