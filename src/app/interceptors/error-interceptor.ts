import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { NotificationService } from "../services/notification.service";

export class ErrorInterceptor implements HttpInterceptor{
    
    constructor(private notification: NotificationService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log(error);
                this.notification.showError('Error')
                return throwError(error);      
            })
        );
    };
}
