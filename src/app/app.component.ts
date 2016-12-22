import { Component, ViewEncapsulation } from '@angular/core';
import * as PouchDB from 'pouchdb';
import { AppState } from './app.service';
var jsep = require('jsep');

@Component({
  selector: 'app',
  styleUrls: [ './app.component.css' ],
  templateUrl: './app.component.html'
})
export class AppComponent {
    private search: string;
    private filter_valid: string = 'accent';

    private menus: Array<any> = [
        {name: "Dataset", icon: "home", link: "dataset"},
        {name: "Material", icon: "view_agenda", link: "material"},
    ]

    constructor(
        public appState: AppState) {

    }

    ngOnInit() {

    }

    emitSearch($event){
        if($event.length != 0){
            try{
                let parse_tree = jsep($event);
                this.appState.notifyDataChanged("search.string", parse_tree)
                this.filter_valid = 'accent';
            } catch (err) {
                this.filter_valid = 'warn';
            }
        } else {
            this.appState.notifyDataChanged("search.string", -1)
            this.filter_valid = 'accent';
        }
    }
}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
