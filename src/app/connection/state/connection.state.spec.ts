import { TestBed, async, fakeAsync } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { NgxsModule, Store } from "@ngxs/store";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { MaterialModule } from "../../shared/material/material.module";
import { ErrorHandler } from "@angular/core";

import { ConnectionState } from "./connection.state";
import { Get } from "./connection.actions";
import { ConnectionService } from "../services/connection.service";
import { environment } from "@environment";
import { mockConnectionResponse } from "../mock-data/conneciton-details-spec-data";

describe("Connection actions", () => {
  let store: Store;
  let httpMock: HttpTestingController;

  const errorHandlerSpy = () =>
    jasmine.createSpyObj("ErrorHandler", {
      handleError: undefined
    });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([ConnectionState]),
        MaterialModule,
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        ConnectionService,
        { provide: ErrorHandler, useFactory: errorHandlerSpy }
      ]
    }).compileComponents();
    store = TestBed.inject(Store);
    httpMock = TestBed.inject(HttpTestingController);
  }));

  it("should create a get connection details action", fakeAsync(() => {
    const gmcNumber = 1234;
    store.dispatch(new Get(gmcNumber));

    const req = httpMock.expectOne(
      `${environment.appUrls.getConnections}/${gmcNumber}`
    );
    expect(req.request.method).toEqual("GET");
    req.flush(mockConnectionResponse);

    const programmeHistory = store.selectSnapshot(
      (state) => state.connection.programmeHistory
    );

    expect(programmeHistory).toEqual(
      mockConnectionResponse.connection.programmeHistory
    );
    httpMock.verify();
  }));

  it("should throw error when gmcNumber is undefined", fakeAsync(() => {
    const gmcNumber = undefined;
    store.dispatch(new Get(gmcNumber)).subscribe(
      () => {},
      (error) => {
        expect(error.toString()).toContain(
          "gmcNumber undefined must be of type number"
        );
      }
    );
  }));
});
