import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {
    constructor(private _http: Http) { }

    getData(dataset_id: string): Observable<any> {
        return this._http.get('http://localhost:8080/dataset/' + dataset_id)
            .map((data: Response) => {
                return data.json()
            })
            .catch((data: Response) => {
                return data.json()
            });
    }
}
