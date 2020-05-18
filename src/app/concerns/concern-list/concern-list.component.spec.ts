import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NgxsModule } from "@ngxs/store";
import { ConcernsState } from "../state/concerns.state";
import { ConcernListComponent } from "./concern-list.component";

describe("ConcernListComponent", () => {
  let component: ConcernListComponent;
  let fixture: ComponentFixture<ConcernListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConcernListComponent],
      imports: [NgxsModule.forRoot([ConcernsState])]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcernListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});