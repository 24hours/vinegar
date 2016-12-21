import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AppState } from '../../app.service';
import { Http } from '@angular/http';
import { DatasetService } from '../../dataset/dataset.service';

@Component({
    selector: 'upload-dialog',
    templateUrl: './upload.dialog.html',
    styleUrls: [ './upload.dialog.css' ]
})
export class UploadDialog {
    private id: string = "";
    private allowDrop: boolean = false;
    private dataName: string = "";
    private height: number = 0;
    private width: number = 0;

    constructor(private _state: AppState,
                public dialogRef: MdDialogRef<UploadDialog>,
                private _data: DatasetService) { }

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

    dragover($event){
        $event.stopPropagation();
        $event.preventDefault();
    }

    fileDrop($event){
        $event.stopPropagation();
        $event.preventDefault();
        this.allowDrop = false;
        if(this.id == ""){
            console.error("dataset id is not specificed for upload")
        } else {
            $event.dataTransfer.getFilesAndDirectories().then((filesAndDirs)=>{
                this.iterateFilesAndDirs(filesAndDirs, '/');
                this.dialogRef.close()
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
        form.append('path', path)
        form.append("file", file);
        this._data.upload(this.id, form).subscribe(()=>{});
    };
}
