import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class DatasetService {
    constructor(private _http: Http) { }

    getDataset(): Observable<any> {
        return this._http.get('http://localhost:8080/data')
            .map((data: Response) => {
                return data.json()
            })
            .catch((data: Response) => {
                return data.json()
            });
    }
}
