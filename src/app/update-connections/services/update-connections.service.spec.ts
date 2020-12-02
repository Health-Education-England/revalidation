import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { environment } from "@environment";
import { NgxsModule } from "@ngxs/store";
import { UpdateConnectionsState } from "../state/update-connections.state";
import { UpdateConnectionsService } from "./update-connections.service";

describe("UpdateConnectionsService", () => {
  let service: UpdateConnectionsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot([UpdateConnectionsState])
      ]
    });
    service = TestBed.inject(UpdateConnectionsService);
    http = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should add new connection", () => {
    const endPoint = `${environment.appUrls.getConnections}/add`;

    service.updateConnection({}, "add").subscribe();

    const mockHttp = http.expectOne(endPoint);
    expect(mockHttp.request.method).toBe("POST");

    http.verify();
  });

  it("should remove current connection", () => {
    const endPoint = `${environment.appUrls.getConnections}/remove`;

    service.updateConnection({}, "remove").subscribe();

    const mockHttp = http.expectOne(endPoint);
    expect(mockHttp.request.method).toBe("POST");

    http.verify();
  });

  it("should throw error when add/remove connection api call fail", () => {
    let response: any;
    let errResponse: any;
    const mockErrorResponse = { status: 400, statusText: "Bad Request" };
    const data = "Invalid request parameters";

    service.updateConnection({}, "remove").subscribe(
      (res) => (response = res),
      (err) => (errResponse = err)
    );
    http
      .expectOne(`${environment.appUrls.getConnections}/remove`)
      .flush(data, mockErrorResponse);

    expect(errResponse.error).toBe(data);
  });
});