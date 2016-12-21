import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AppState } from '../../app.service';
import { Http } from '@angular/http';
import { LabelService } from '../../label/label.service';

@Component({
    selector: 'label-dialog',
    templateUrl: './label.dialog.html',
    styleUrls: [ './label.dialog.css' ]
})
export class LabelDialog {
    private id: string = "";
    private dataName: string = "";
    private dColor: string = "";
    private height: number = 0;
    private width: number = 0;

    constructor(private _state: AppState,
                public dialogRef: MdDialogRef<LabelDialog>,
                private _label: LabelService) { }

    ngOnInit(){
        this.height = Math.min(400, window.innerHeight * .7);
        this.width = Math.min(400, window.innerWidth * .7);
        this.dataName = '';
        this._state.subscribe('upload.data', (v:any)=>{
            this.dataName = v.name;
            this.id = v.id;
        })
    }

    create(){
        if(this.dataName.length == 0){
            this.dColor = 'warn';
        } else {
            this.dialogRef.close();
            //
            // this._data.create(this.dataName).subscribe(
            //     ()=>{
            //         // this._state.notifyDataChanged("data.refresh", true);
            //         this.dialogRef.close();
            //     },
            //     (v: any)=>{
            //             console.log("something is wrong", v)
            //     }
            // );
        }
    }

}
