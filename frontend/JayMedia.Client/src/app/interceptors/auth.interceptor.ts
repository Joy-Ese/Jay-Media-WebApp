import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
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
      const currentUrl = router.url;
      const isLoginPage = currentUrl.includes('/login') || currentUrl.includes('/register');

      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !isLoginPage
      ) {
        // Clear sensitive data
        localStorage.removeItem("token");
        localStorage.removeItem("loginResp");
        localStorage.removeItem("userDetails");
        localStorage.clear();

        toastr.warning('Your session has expired. Please sign in again.', 'Session Timeout');

        // Redirect and refresh
        router.navigate(['/login']);
        setTimeout(() => window.location.reload(), 300);
      }

      return throwError(() => error);
    })
  );
};
