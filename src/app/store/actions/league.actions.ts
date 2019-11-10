import { League } from '../../views/schedule/models/interfaces/league.model';
import { SelectedLeagues } from 'src/app/views/admin/schedule/models/selected-leagues.model';

export namespace Leagues {
  export class UpdateSelectedLeagues {
    static readonly type = '[Schedule] UpdateSelectedLeagues';
    constructor(public selected: League[]) {}
  }
}
