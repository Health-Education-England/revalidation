import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { map } from "rxjs/operators";
import {
  IProgrammeHistory,
  IConnectionHistory,
  IConnectionResponse
} from "../connection.interfaces";
import { ConnectionService } from "../services/connection.service";
import { Get } from "./connection.actions";

export class ConnectionStateModel {
  public gmcNumber: number;
  public programmeHistory: IProgrammeHistory[];
  public connectionHistory: IConnectionHistory[];
  public doctorCurrentDbc: string;
}

@State<ConnectionStateModel>({
  name: "connection",
  defaults: {
    gmcNumber: null,
    programmeHistory: [],
    connectionHistory: [],
    doctorCurrentDbc: ""
  }
})
@Injectable()
export class ConnectionState {
  constructor(private service: ConnectionService) {}

  @Selector()
  public static programmeHistory(state: ConnectionStateModel) {
    return state.programmeHistory;
  }

  @Selector()
  public static connectionHistory(state: ConnectionStateModel) {
    return state.connectionHistory;
  }

  @Selector()
  public static gmcNumber(state: ConnectionStateModel) {
    return state.gmcNumber;
  }

  @Selector()
  public static doctorCurrentDbc(state: ConnectionStateModel) {
    return state.doctorCurrentDbc;
  }

  @Action(Get)
  get({ patchState }: StateContext<ConnectionStateModel>, { payload }: Get) {
    if (isNaN(payload)) {
      throw new Error(`gmcNumber ${payload} must be of type number`);
    }

    return this.service.getConnectionHistory(payload).pipe(
      map((response: IConnectionResponse) => {
        patchState({
          gmcNumber: response.programme.gmcNumber,
          programmeHistory: response.programme.programmeHistory,
          connectionHistory: response.connection.connectionHistory,
          doctorCurrentDbc: response.designatedBodyCode.designatedBodyCode
        });
      })
    );
  }
}
