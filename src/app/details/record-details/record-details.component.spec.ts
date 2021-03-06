import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MaterialModule } from "../../shared/material/material.module";

import { RecordDetailsComponent } from "./record-details.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";

describe("RecordDetailsComponent", () => {
  let component: RecordDetailsComponent;
  let fixture: ComponentFixture<RecordDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecordDetailsComponent],
      imports: [MaterialModule, RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
