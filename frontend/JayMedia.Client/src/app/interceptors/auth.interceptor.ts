import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Show session expired message
        toastr.warning('Your session is about to expire.', 'Session Timeout');

        // Clear local storage
        localStorage.clear();

        // Redirect to login page
        router.navigate(['/login']);
        toastr.success('Your session has expired. Please log in again.', 'Success');
      }

      return throwError(() => error);
    })
  );
};
