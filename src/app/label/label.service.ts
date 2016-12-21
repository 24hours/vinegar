import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class LabelService {
    constructor(private _http: Http) { }

    get(dataset_id: string): Observable<any> {
        return this._http.get("http://localhost:8080/label/" + dataset_id)
           .map((v: Response)=>{ return v.json() })
           .catch((v: Response)=>{ return v.json() });
    }

    attach(name: string, dataset_id: string): Observable<any> {
        return this._http.post("http://localhost:8080/label", { "name": name, "dataset": dataset_id })
           .map((v: Response)=>{ return v.json() })
           .catch((v: Response)=>{ return v.json() });
    }
}
