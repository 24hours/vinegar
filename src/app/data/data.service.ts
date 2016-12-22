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

    saveData(data: any, data_id: number, label_id: number){
        return this._http.post('http://localhost:8080/data_label', {data: data, data_id: data_id, label_id: label_id})
            .map((data: Response) => {
                return data.json()
            })
            .catch((data: Response) => {
                return data.json()
            });
    }

    getLabel(dataset_id: string){
        return this._http.get('http://localhost:8080/data_label/' + dataset_id)
            .map((data: Response) => {
                return data.json()
            })
            .catch((data: Response) => {
                return data.json()
            });
    }
}
