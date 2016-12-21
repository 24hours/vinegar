import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AppState } from '../../app.service';
import { Http } from '@angular/http';

@Component({
    selector: 'label-dialog',
    templateUrl: './label.dialog.html',
    styleUrls: [ './label.dialog.css' ]
})
export class LabelDialog {
    private id: string = "";
    private dataName: string = "";
    private height: number = 0;
    private width: number = 0;

    constructor(private _state: AppState,
                public dialogRef: MdDialogRef<LabelDialog>) { }

    ngOnInit(){
        this.height = Math.min(400, window.innerHeight * .7);
        this.width = Math.min(400, window.innerWidth * .7);
        this.dataName = '';
        console.log("open")
        this._state.subscribe('upload.data', (v:any)=>{
            this.dataName = v.name;
            this.id = v.id;
        })
    }

}
