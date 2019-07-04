import { SnackBarEvent } from '../shared/components/snack-bar/snack-bar-service.service';
import { ErrorCodes } from './Constants/ThePLeagueConstants';
import { throwError, of } from 'rxjs';

export function handleError(err, snackBar) {
  if (err.error instanceof ErrorEvent) {
    snackBar.openSnackBarFromComponent(
      `An error occured: ${err.error.message}`,
      'Dismiss',
      SnackBarEvent.Error
    );
  } else {
    if (err.status === 500 || err.status === 501 || err.status === 504) {
      snackBar.openSnackBarFromComponent(
        'Request to the server failed',
        'Dismiss',
        SnackBarEvent.Error
      );
    }
    const backendErrorKey = Object.keys(err.error)[0];
    if (ErrorCodes.includes(backendErrorKey)) {
      const errorKey = ErrorCodes.find(errCode => errCode === backendErrorKey);
      if (err.status === 401) {
        // if the err contains any of the known error codes display it

        snackBar.openSnackBarFromComponent(
          `${err.error[errorKey].errors[0].errorMessage}`,
          'Dismiss',
          SnackBarEvent.Error
        );
      } else {
        snackBar.openSnackBarFromComponent(
          `${err.error[errorKey][0]}`,
          'Dismiss',
          SnackBarEvent.Error
        );
      }
    }
  }
  return throwError(err);
}
