export interface TeamSignUpImage {
  title: string;
  description: string;
  src: string;
  alt?: string;
}

export const TeamSignUpImages: TeamSignUpImage[] = [
  {
    title: "Got a Squad?",
    description:
      "If you enjoy good competition and want to have fun at the same time this is the league for you!",
    src: "../../../../../assets/hoop.jpg",
    alt: "slide-one"
  },
  {
    title: "Sign up and Start Competing",
    description: "Games are on Weds, Thurs and Sat",
    src: "../../../../../assets/merchanidse_welcome_2.jpg",
    alt: "slide-two"
  }
];
