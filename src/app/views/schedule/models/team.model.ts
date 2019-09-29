export interface Team {
    name?: string    
  }

export interface HomeTeam extends Team{

}

export interface AwayTeam extends Team {
    
}

export const TEAMS: Team[] = [  
    {name: "A"},
    {name: "B"},
    {name: "C"},
    {name: "D"},
    {name: "E"},
    {name: "F"},
    {name: "G"},
    {name: "H"},
  ]