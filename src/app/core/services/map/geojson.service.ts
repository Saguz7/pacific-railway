import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GEOJsonService {
  private apiurl: string = 'https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/get-cpr-geojson';

  constructor(private http: HttpClient) {}

  public getData(){
    return this.http.get(this.apiurl);
  }
}
