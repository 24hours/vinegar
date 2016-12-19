import { Component, ViewEncapsulation } from '@angular/core';
import * as PouchDB from 'pouchdb';
import { AppState } from './app.service';

@Component({
  selector: 'app',
  styleUrls: [ './app.component.css' ],
  templateUrl: './app.component.html'
})
export class AppComponent {
    angularclassLogo = 'assets/img/angularclass-avatar.png';
    name = 'Angular 2 Webpack Starter';
    url = 'https://twitter.com/AngularClass';

    private menus: Array<any> = [
        {name: "Dataset", icon: "home", link: "dataset"},
        {name: "Material", icon: "view_agenda", link: "material"},

    ]
    constructor(
        public appState: AppState) {

    }

    ngOnInit() {

    }
}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
