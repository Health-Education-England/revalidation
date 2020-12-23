import { Component, OnDestroy, OnInit } from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable, Subscription } from "rxjs";

import { environment } from "@environment";
import {
  IProgrammeHistory,
  IUpdateConnectionResponse,
  IConnectionHistory
} from "./connection.interfaces";
import { ConnectionState } from "./state/connection.state";
import { AuthService } from "../core/auth/auth.service";
import { SnackBarService } from "../shared/services/snack-bar/snack-bar.service";
import { ConnectionService } from "./services/connection.service";
import { ADMIN_ROLES } from "../connections/constants";
import { IDesignatedBody } from "../reference/reference.interfaces";
import { ReferenceService } from "../reference/services/reference.service";
import { ActionType } from "../update-connections/update-connections.interfaces";
import { UpdateConnectionsService } from "../update-connections/services/update-connections.service";

@Component({
  selector: "app-connection",
  templateUrl: "./connection.component.html",
  styleUrls: ["./connection.component.scss"]
})
export class ConnectionComponent implements OnInit, OnDestroy {
  @Select(ConnectionState.programmeHistory)
  public programmeHistory$: Observable<IProgrammeHistory[]>;

  @Select(ConnectionState.connectionHistory)
  public connectionHistory$: Observable<IConnectionHistory[]>;

  @Select(ConnectionState.gmcNumber)
  public gmcNumber$: Observable<number>;

  @Select(ConnectionState.doctorCurrentDbc)
  public doctorCurrentDbc$: Observable<string>;

  dateFormat = environment.dateFormat;
  programmeColumnsToDisplay = [
    "programmeName",
    "programmeOwner",
    "programmeMembershipStartDate",
    "programmeMembershipEndDate"
  ];
  connectionsColumnsToDisplay = [
    "newDesignatedBodyCode",
    "previousDesignatedBodyCode",
    "requestType",
    "reasonMessage",
    "requestTime"
  ];
  componentSubscription: Subscription;
  dbcs: IDesignatedBody[] = [];
  gmcNumber: number;
  doctorCurrentDbc: string;

  enableUpdateConnection = false;
  submitting = false;

  constructor(
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private updateConnectionsService: UpdateConnectionsService,
    private referenceService: ReferenceService
  ) {}

  ngOnInit(): void {
    this.enableUpdateConnection = this.authService.roles.some((role) =>
      ADMIN_ROLES.includes(role)
    );

    this.gmcNumber$.subscribe((res) => (this.gmcNumber = res));
    this.doctorCurrentDbc$.subscribe((res) => (this.doctorCurrentDbc = res));
    this.referenceService.getDbcs().subscribe((res) => (this.dbcs = res));
    this.updateConnectionsService.canSave$.next(true);
  }

  ngOnDestroy(): void {
    if (this.componentSubscription) {
      this.componentSubscription.unsubscribe();
    }
  }

  getDBCAbbreviation(dbc: string) {
    return this.dbcs.find((d) => d.dbc === dbc)?.abbr || dbc;
  }

  updateConnection(formValue: any) {
    this.submitting = true;
    const doctors = [
      {
        gmcId: this.gmcNumber,
        currentDesignatedBodyCode: this.doctorCurrentDbc
      }
    ];

    const payload = {
      changeReason: formValue.reason,
      designatedBodyCode:
        formValue.action === ActionType.ADD_CONNECTION ? formValue.dbc : null,
      doctors
    };

    const action =
      formValue.action === ActionType.ADD_CONNECTION ? "add" : "remove";

    this.componentSubscription = this.updateConnectionsService
      .updateConnection(payload, action)
      .subscribe(
        (response: IUpdateConnectionResponse) => {
          this.snackBarService.openSnackBar(response.message);
        },
        (error) => {
          this.snackBarService.openSnackBar(error.message);
        },
        () => {
          this.submitting = false;
        }
      );
  }
}
