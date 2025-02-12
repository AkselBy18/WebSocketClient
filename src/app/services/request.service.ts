import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  //MARK: PUBLIC METHODS -----------------------------------------------------------------------------
  public sync<T>(section: string) {
    const url = `${this.URL}/${section}`;
    return this.http.get(url) as Observable<T>;
  }
}
