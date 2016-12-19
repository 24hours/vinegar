import { Component, Optional } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';

@Component({
  selector: 'home',
  styleUrls: [ './home.component.css' ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
    private datas: Array<any> = [
        {name: "Data 1"},
        {name: "Data 2"},
        {name: "Data 3"}
    ]

    constructor(public dialog: MdDialog) { }

    ngOnInit(){
        this.openDialog();
    }

    openDialog() {
        let dialogRef = this.dialog.open(DataDialog, {
            disableClose: false
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('result: ' + result);
            dialogRef = null;
        });
    }
}


@Component({
    selector: 'pizza-dialog',
    template: `
    <div [style.height.px]="height" [style.width.px]="width">
        <h3>New Dataset</h3>
        <md-input   [dividerColor]="dColor"
                    [(ngModel)]="dataName"
                    (ngModelChange)="dColor=''"
                    [style.margin-bottom.em]="1"
                    placeholder="Name">
            <md-hint *ngIf="dColor=='warn'" align="end">Set Input Name before upload</md-hint>
        </md-input>
        <div [class.nv-file-over]="allowDrop"
            (drop)="fileDrop($event)"
            (dragover)="dragover($event);allowDrop=true"
            (dragleave)="allowDrop=false"
            class="drop-zone my-drop-zone">
            <md-icon>file_upload</md-icon>
            <div>Drop file here</div>
        </div>
    </div>
    `,
    styleUrls: [ './home.component.css' ]
})
export class DataDialog {
    private allowDrop: boolean = false;
    private dataName: string = "";
    private dColor: string = "";
    private height: number = 0;
    private width: number = 0;

    constructor(public dialogRef: MdDialogRef<DataDialog>,
                private _http: Http) { }

    ngOnInit(){
        this.height = Math.min(400, window.innerHeight * .7);
        this.width = Math.min(400, window.innerWidth * .7);
        this.dataName = '';
        this.dColor = 'primary';
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
        form.append('path', path)
        console.log(path)
        form.append("file", file);
        this._http.post('http://localhost:8080/api', form)
            .map(resp => {})
            .subscribe(()=>{})
    };
}
