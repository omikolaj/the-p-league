export const LOCAL_STORAGE_ITEM: string = "ThePLeague";

export class Role {
  static readonly Admin: string = "admin";
  static readonly User: string = "user";
  static readonly SuperUser: string = "superuser";
}

// If more items will be required from the request object, create a class
// and then create static fields like for Role ^
export const TOKEN_HEADER: string = "Token-Expired";

export class GearItemUpload {
  static readonly GearItem: string = "gearItem";
  static readonly GearImages: string = "gearImages";
}

export class LeagueImageUpload {
  static readonly LeagueImages: string = "leagueImages";
}
