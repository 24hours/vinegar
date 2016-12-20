import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { MaterialModule } from '@angular/material';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState } from './app.service';
import { DatasetComponent } from './dataset/dataset.component';
import { DatasetService } from './dataset/dataset.service';
import { DatasetDialog } from './dialog/dataset/dataset.dialog';
import { UploadDialog } from './dialog/upload/upload.dialog';

import { MaterialComponent } from './material';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

// Application wide providers
const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    AppState,
    DatasetService
];

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        AboutComponent,
        DatasetComponent,
        DatasetDialog,
        UploadDialog,
        MaterialComponent,
        NoContentComponent,
    ],
    imports: [ // import Angular's modules
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(ROUTES, { preloadingStrategy: PreloadAllModules }),
        MaterialModule.forRoot(),
    ],
    providers: [ // expose our Services and Providers into Angular's dependency injection
        ENV_PROVIDERS,
        APP_PROVIDERS
    ],
    entryComponents: [
        DatasetDialog,
        UploadDialog
    ],
})
export class AppModule {}
