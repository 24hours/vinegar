import { Component, Optional } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import { DatasetService } from './dataset.service';
import { AppState } from '../app.service';
import { DatasetDialog } from '../dialog/dataset/dataset.dialog';
import { UploadDialog } from '../dialog/upload/upload.dialog';

@Component({
  selector: 'dataset',
  styleUrls: [ './dataset.component.css' ],
  templateUrl: './dataset.component.html'
})
export class DatasetComponent {
    private datas: Array<any> = []
    private stateListener: any;

    constructor(private _state: AppState,
                private dialog: MdDialog,
                private _data: DatasetService) { }

    ngOnInit(){
        this._state.subscribe('data.refresh', ()=>{
            this._data.getDataset().subscribe((data: any)=>{
                this.datas = data['data'];
            }, (error)=>{})
        });
        this._state.notifyDataChanged("data.refresh", true)
    }

    openCreateDialog() {
        let dialogRef = this.dialog.open(DatasetDialog, {
            disableClose: false
        });

        dialogRef.afterClosed().subscribe(result => {
            dialogRef = null;
        });
    }

    openUploadDialog(id: string | number, name: string) {
        let dialogRef = this.dialog.open(UploadDialog, {
            disableClose: false
        });
        this._state.notifyDataChanged('upload.data', {id:id, name:name});

        dialogRef.afterClosed().subscribe(result => {
            dialogRef = null;
        });
    }

    ngOnDestroy(){
        this.stateListener.unsubscribe()
    }
}
