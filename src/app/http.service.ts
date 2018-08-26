import {Injectable} from "@angular/core";
import {HttpParams, JsonpClientBackend, HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";

export interface TourData {
  error: string;
  data: string;
}

@Injectable()
export class HttpService {
  WEB_API_URL: string = "http://webservice.recruit.co.jp/ab-road/tour/v1/";
  API_KEY: string = "<API Key>";
  DEFAULT_SIZE: string = "30";
  SORT_RANKING: string = "5";
  CALLBACK: string = "JSONP_CALLBACK";

  constructor(private jsonp: JsonpClientBackend,
              private http: HttpClient) {
  }

  getTourData(areaCode: string): Observable<TourData> {
    let config = this.setParam(areaCode);
    return this.reqData(config);
  }

  setParam(areaCode: string) : HttpParams {
    // Url params
    return (new HttpParams())
      .set("key", this.API_KEY)
      .set("area", areaCode)
      .set("order", this.SORT_RANKING)
      .set("count", this.DEFAULT_SIZE)
      .set("format", "jsonp")
      .set("callback", this.CALLBACK);
  }

  reqData(config): Observable<TourData> {
    let url = this.WEB_API_URL + "?" + config.toString();
    return this.http.jsonp<{ results: any}>(url, this.CALLBACK)
      .map(res => {
          let tourData;
          if (res.results.error) {
            let err = res.results.error[0];
            tourData = {
              error: err.code,
              data: err.message
            };
          } else {
            let dataObj = res.results.tour;
            tourData = {
              error: null,
              data: dataObj,
            };
          }
          console.dir(tourData);
          return tourData;
        }
      );
  }
}
