import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environment";
import { Observable } from "rxjs";
import { IListFile } from "../../concern.interfaces";

@Injectable({
  providedIn: "root"
})
export class UploadService {
  constructor(private http: HttpClient) {}

  public createFormData(
    gmcNumber: number,
    concernId: string,
    payload: File
  ): FormData {
    const formData: FormData = new FormData();
    formData.append("bucketName", environment.awsConfig.bucketName);
    formData.append("folderPath", `${gmcNumber}/${concernId}`);
    formData.append("files", payload);

    return formData;
  }

  public upload(payload: FormData): Observable<any> {
    const headers = new HttpHeaders();
    headers.append("Content-Type", "multipart/form-data");
    // headers.append("Accept", "*/*");
    return this.http.post(environment.appUrls.upload, payload, {
      observe: "events",
      reportProgress: true,
      headers
    });
  }

  public createRequestParams(key: string): HttpParams {
    const params: HttpParams = new HttpParams()
      .set("bucketName", environment.awsConfig.bucketName)
      .set("key", key);

    return params;
  }

  public downloadFile(params: HttpParams): Observable<Blob> {
    return this.http.get(environment.appUrls.downloadFile, {
      params,
      responseType: "blob"
    });
  }

  public createListFilesParams(
    gmcNumber: number,
    concernId: string
  ): HttpParams {
    const params: HttpParams = new HttpParams()
      .set("bucketName", environment.awsConfig.bucketName)
      .set("folderPath", `${gmcNumber}/${concernId}`);

    return params;
  }

  public listFiles(params: HttpParams): Observable<IListFile[] | any> {
    return this.http.get(environment.appUrls.listFiles, { params });
  }

  public deleteFile(params: HttpParams): Observable<string> {
    return this.http.delete(environment.appUrls.deleteFile, {
      params,
      responseType: "text"
    });
  }
}
