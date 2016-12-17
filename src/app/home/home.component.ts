import { Component, Optional } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

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
  <h1 md-dialog-title>Would you like to order pizza?</h1>
  fghjkl;'/kjhg'
  `
})
export class DataDialog {
  constructor(public dialogRef: MdDialogRef<DataDialog>) { }
}
