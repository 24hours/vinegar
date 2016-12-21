import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AppState } from '../../app.service';
import { Http } from '@angular/http';
import { DatasetService } from '../../dataset/dataset.service';

@Component({
    selector: 'dataset-dialog',
    templateUrl: './dataset.dialog.html',
    styleUrls: [ './dataset.dialog.css' ]
})
export class DatasetDialog {
    private allowDrop: boolean = false;
    private dataName: string = "";
    private dColor: string = "";
    private height: number = 0;
    private width: number = 0;

    constructor(private _state: AppState,
                public dialogRef: MdDialogRef<DatasetDialog>,
                private _data: DatasetService) { }

    ngOnInit(){
        this.height = Math.min(400, window.innerHeight * .7);
        this.width = Math.min(400, window.innerWidth * .7);
        this.dataName = '';
        this.dColor = 'primary';
    }

    create(){
        if(this.dataName.length == 0){
            this.dColor = 'warn';
        } else {
            this._data.create(this.dataName).subscribe(
                ()=>{
                    this._state.notifyDataChanged("data.refresh", true);
                    this.dialogRef.close();
                },
                (v: any)=>{
                        console.log("something is wrong", v)
                }
            );
        }
    }
}
