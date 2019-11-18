export const LOCAL_STORAGE_ITEM = 'ThePLeague';
export const ROUTER_OUTLET = 'modal';

export class Role {
  static readonly Admin: string = 'admin';
  static readonly User: string = 'user';
  static readonly SuperUser: string = 'superuser';
}

// If more items will be required from the request object, create a class
// and then create static fields like for Role ^
export const TOKEN_HEADER = 'Token-Expired';

export class GearItemUpload {
  static readonly GearItem: string = 'gearItem';
  static readonly GearImages: string = 'gearImages';
}

export class LeagueImageUpload {
  static readonly LeagueImages: string = 'leagueImages';
}

export const ErrorCodes: string[] = [
  'login',
  'logout',
  'refresh_token',
  'user_not_found',
  'gear_item_update',
  'cloudinary_upload',
  'cloudinary_delete',
  'gear_item_delete',
  'league_image_delete',
  'gear_item_not_found',
  'league_image_not_found',
  'league_image_order',
  'password_update'
];

// Used to indicate that a team is unassigned
export const UNASSIGNED: string = '-1';
