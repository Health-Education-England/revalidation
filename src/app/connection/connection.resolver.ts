import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Store } from "@ngxs/store";
import { catchError } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { IProgrammeDetails } from "./connection.interfaces";
import { Get } from "./state/connection.actions";

@Injectable()
export class ConnectionResolver implements Resolve<IProgrammeDetails> {
  constructor(private store: Store, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<IProgrammeDetails> | Observable<any> {
    const gmcNumber: number = Number(route.params.gmcNumber);

    return this.store
      .dispatch(new Get(gmcNumber))
      .pipe(catchError(() => this.router.navigate(["/404"])));
  }
}
