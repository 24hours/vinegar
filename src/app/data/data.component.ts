import { Component, Optional } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import { AppState } from '../app.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataService } from './data.service';

@Component({
  selector: 'data',
  styleUrls: [ './data.component.css' ],
  templateUrl: './data.component.html'
})
export class DataComponent {
    private datas: Array<any> = []
    private stateListener: any;
    private sub: any;
    private id: any;

    constructor(private _state: AppState,
                private route: ActivatedRoute,
                private router: Router,
                private _data: DataService) { }

    ngOnInit(){
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            console.log(this.id)
            this._data.getData(this.id).subscribe((v: any)=>{
                console.log(v);
            })
        });
    }
}
