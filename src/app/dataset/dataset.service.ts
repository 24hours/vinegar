import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class DatasetService {
    constructor(private _http: Http) { }

    getDataset(): Observable<any> {
        return this._http.get('http://localhost:8080/dataset')
            .map((data: Response) => {
                return data.json()
            })
            .catch((data: Response) => {
                return data.json()
            });
    }

    create(name: string): Observable<any> {
        return this._http.post("http://localhost:8080/dataset", { "name": name })
           .map((v: any)=>{ return v })
           .catch((v: any)=>{ return v });
    }

    upload(id: string, form: FormData){
        form.append('id', id)
        return this._http.post('http://localhost:8080/dataset/upload', form)
            .map((resp: any) => {return resp})
            .catch((resp: any) => {return resp});

    }
}
