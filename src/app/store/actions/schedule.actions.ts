import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';

export namespace Schedule {
  export class AddSportType {
    static readonly type = '[Schedule API] AddSportType';
    constructor(public payload: SportType) {}
  }

  export class EditSportType {
    static readonly type = '[Schedule API] EditSportType';
    constructor(public payload: SportType) {}
  }

  export class FetchAllSportTypes {
    static readonly type = '[Schedule API] FetchAllSportTypes';
  }

  export class FetchAllSportTypesSuccess {
    static readonly type = '[Schedule API] FetchAllSportTypesSuccess';
  }

  export class FetchAllSportTypesFailed {
    static readonly type = '[Schedule API] FetchALlSportTypesFailed';
    constructor(public error: any) {}
  }

  export class DeleteSportType {
    static readonly type = '[Schedule API] DeleteSportType';
    constructor(public id: string) {}
  }
}
