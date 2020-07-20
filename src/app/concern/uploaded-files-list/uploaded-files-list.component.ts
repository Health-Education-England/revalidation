import { Component, OnInit } from "@angular/core";
import { environment } from "@environment";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { ACCEPTED_IMAGE_FILE_TYPES } from "../constants";
import { UploadService } from "../services/upload/upload.service";
import { DownloadFile, ListFiles } from "../state/concern.actions";
import { ConcernState } from "../state/concern.state";

@Component({
  selector: "app-uploaded-files-list",
  templateUrl: "./uploaded-files-list.component.html",
  styleUrls: ["./uploaded-files-list.component.scss"]
})
export class UploadedFilesListComponent implements OnInit {
  public dateFormat = environment.dateFormat;
  public gmcNumber: number = this.store.selectSnapshot(ConcernState.gmcNumber);
  @Select(ConcernState.listFilesInProgress)
  public listFilesInProgress$: Observable<boolean>;
  @Select(ConcernState.uploadedFiles) public uploadedFiles$: Observable<any[]>;
  public acceptedImageTypes: string[] = ACCEPTED_IMAGE_FILE_TYPES;

  constructor(private uploadService: UploadService, private store: Store) {}

  ngOnInit(): void {
    this.listFiles();
  }

  public downloadFile(fileName: string, key: string): Observable<any> {
    return this.store.dispatch(new DownloadFile(fileName, key));
  }

  public deleteFile(event: Event): void {
    event.preventDefault();
    (window as any).alert("Your file will be deleted shortly 😀");
  }

  public listFiles(): Observable<any> {
    return this.store.dispatch(new ListFiles(this.gmcNumber));
  }
}
