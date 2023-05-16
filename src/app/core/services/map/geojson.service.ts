import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GEOJsonService {
  //private apiurl: string = environment.API_URL_BASE + 'get-cpr-geojson';
  private apiurl: string = 'https://49xa6kx3g6.execute-api.us-west-2.amazonaws.com/dev/get-cpr-geojson';

  constructor(private http: HttpClient) {}

  public getData(){
    return this.http.get(this.apiurl);
  }
}
