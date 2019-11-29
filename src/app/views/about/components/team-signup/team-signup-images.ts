export interface TeamSignUpImage {
	title: string;
	description: string;
	src: string;
	alt?: string;
}

export const TeamSignUpImages: TeamSignUpImage[] = [
	{
		title: 'Got a Squad?',
		description: 'If you enjoy good competition and want to have fun at the same time this is the league for you!',
		src: '../../../../../assets/p-league-4.JPG',
		alt: 'slide-one'
	},
	{
		title: 'Sign up and Start Competing',
		description: 'Games are on Weds, Thurs and Sat',
		src: '../../../../../assets/p-league-3.JPG',
		alt: 'slide-two'
	}
];
