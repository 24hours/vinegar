import { Routes, RouterModule } from '@angular/router';
import { DatasetComponent } from './dataset';
import { DataComponent } from './data/data.component';
import { MaterialComponent } from './material';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';


export const ROUTES: Routes = [
  { path: '',      component: DatasetComponent },
  { path: 'dataset',  component: DatasetComponent },
  { path: 'dataset/:id',  component: DataComponent },
  { path: 'material',  component: MaterialComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'detail', loadChildren: () => System.import('./+detail')
      .then((comp: any) => comp.default),
  },
  { path: '**',    component: NoContentComponent },
];
