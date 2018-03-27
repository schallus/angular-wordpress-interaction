import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PageHomeComponent } from './page-home/page-home.component';
import { PageListArticlesComponent } from './page-list-articles/page-list-articles.component';

const appRoutes: Routes = [
    { path: 'home', component: PageHomeComponent, data: { title: 'Accueil' } },
    { path: 'articles', component: PageListArticlesComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
  ];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}