import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ErrorService {
  public generateErrorMsg(error: HttpErrorResponse): string {
    return error.error instanceof ErrorEvent || error.status === 406
      ? `${error.error.message || error.error[0]}`
      : `Oops, something went wrong`;
  }
}

export class HttpErrorPayload {
  constructor(public error: string) {}
}
