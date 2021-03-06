import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { generateColumnData } from "../records/constants";
import { RecordsResolver } from "../records/records.resolver";
import { RecordsService } from "../records/services/records.service";
import { UpdateConnectionsService } from "../update-connections/services/update-connections.service";
import { ConnectionsFilterType } from "./connections.interfaces";
import { COLUMN_DATA } from "./constants";

@Injectable()
export class ConnectionsResolver
  extends RecordsResolver
  implements Resolve<any> {
  constructor(
    protected store: Store,
    protected recordsService: RecordsService,
    protected updateConnectionsService: UpdateConnectionsService
  ) {
    super(store, recordsService, updateConnectionsService);
    this.initialiseData();
  }

  private initialiseData(): void {
    this.recordsService.stateName = "connections";
    this.recordsService.detailsRoute = "/connection";
    this.recordsService.setConnectionsActions();
    this.recordsService.dateColumns = [
      "submissionDate",
      "programmeMembershipStartDate",
      "programmeMembershipEndDate"
    ];
    this.recordsService.columnData = generateColumnData(COLUMN_DATA);
    this.recordsService.filters = [
      {
        label: "CONNECTED",
        name: ConnectionsFilterType.CONNECTED
      },
      {
        label: "DISCONNECTED",
        name: ConnectionsFilterType.DISCONNECTED
      },
      {
        label: "EXCEPTIONS QUEUE",
        name: ConnectionsFilterType.EXCEPTIONS_QUEUE
      },
      {
        label: "ALL",
        name: ConnectionsFilterType.ALL
      },
      {
        label: "HIDDEN",
        name: ConnectionsFilterType.HIDDEN
      }
    ];
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return super.resolve(route);
  }
}
