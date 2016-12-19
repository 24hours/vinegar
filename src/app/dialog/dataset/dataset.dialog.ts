import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AppState } from '../../app.service';
import { Http } from '@angular/http';

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
                private _http: Http) { }

    ngOnInit(){
        this.height = Math.min(400, window.innerHeight * .7);
        this.width = Math.min(400, window.innerWidth * .7);
        this.dataName = '';
        this.dColor = 'primary';
    }

    create(){
        // if(this.dataName.length == 0){
        //     this.dColor = 'warn';
        // } else {
        //     this._http.post("http://localhost:8080/data", {
        //         "name": this.dataName
        //     }).map((v: any)=>{ }).catch((v: any)=>{}).subscribe(()=>{
        //         this._state.notifyDataChanged("data.refresh", true)
        //     });
        // }
    }

    dragover($event){
        $event.stopPropagation();
        $event.preventDefault();
    }

    fileDrop($event){
        $event.stopPropagation();
        $event.preventDefault();
        this.allowDrop = false;
        if(this.dataName.length == 0){
            this.dColor = 'warn';
        } else {
            $event.dataTransfer.getFilesAndDirectories().then((filesAndDirs)=>{
                this.iterateFilesAndDirs(filesAndDirs, '/');
            });
        }
    }

    private iterateFilesAndDirs(filesAndDirs, path) {
        let i: number = 0
        for (i = 0; i < filesAndDirs.length; i++) {
            if (typeof filesAndDirs[i].getFilesAndDirectories === 'function') {
                let path = filesAndDirs[i].path;
                filesAndDirs[i].getFilesAndDirectories().then((subFilesAndDirs)=>{
                    this.iterateFilesAndDirs(subFilesAndDirs, path);
                });
            } else {
                this.uploadFile(filesAndDirs[i], path);
            }
        }
    };

    private uploadFile(file, path) {
        let form = new FormData();
        form.append('id', 3)
        form.append('path', path)
        form.append("file", file);
        this._http.post('http://localhost:8080/data/upload', form)
            .map(resp => {})
            .subscribe(()=>{})
    };
}
