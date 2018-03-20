import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { Http } from '@angular/http';
import { WpApiModule, WpApiLoader, WpApiStaticLoader } from 'wp-api-angular';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PageHomeComponent } from './page-home/page-home.component';
import { PageListArticlesComponent } from './page-list-articles/page-list-articles.component';

export function WpApiLoaderFactory(http: Http) {
  return new WpApiStaticLoader(http, 'http://wordpress-api.test/wp-json/', /* namespace is optional, default: '/wp/v2' */);
}

const appRoutes: Routes = [
  { path: 'home', component: PageHomeComponent, data: { title: 'Accueil' } },
  { path: 'articles', component: PageListArticlesComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    PageHomeComponent,
    PageListArticlesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    WpApiModule.forRoot({
      provide: WpApiLoader,
      useFactory: (WpApiLoaderFactory),
      deps: [Http]
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
