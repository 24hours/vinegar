import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class LabelService {
    constructor(private _http: Http) { }

    attach(name: string): Observable<any> {
        // return this._http.post("http://localhost:8080/dataset", { "name": name })
        //    .map((v: any)=>{ return v })
        //    .catch((v: any)=>{ return v });
        return null;
    }
}
