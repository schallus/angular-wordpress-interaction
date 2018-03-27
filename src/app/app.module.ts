import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { Http } from '@angular/http';
import { WpApiModule, WpApiLoader, WpApiStaticLoader } from 'wp-api-angular';

import { Config } from './config';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PageHomeComponent } from './page-home/page-home.component';
import { PageListArticlesComponent } from './page-list-articles/page-list-articles.component';
import { NewPostFormComponent } from './new-post-form/new-post-form.component';

export function WpApiLoaderFactory(http: Http) {
  return new WpApiStaticLoader(http, Config.apiUrl, /* namespace is optional, default: '/wp/v2' */);
}

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    PageHomeComponent,
    PageListArticlesComponent,
    NewPostFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    AppRoutingModule,
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
