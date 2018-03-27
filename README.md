# Approfondissement Angular

Dans le cadre du cours approfondissement média (AppMed), j'ai décidé d'approfondir mes compétences dans le Framework Angular 5. Pour cet approfondissement, je me suis notamment penché sur les points suivants:

Table des matières
=================
- [Service wp-api-angular](#service-wp-api-angular)
- [Utilisation avancée des Observables](#les-observables)
- [Routag avec Angular](#routage-avec-angular)
- [Composants graphiques Angular](#composants-graphiques-angular)

## Service [wp-api-angular](https://github.com/wordpress-clients/wp-api-angular)
**wp-api-angular** est un package npm permettant l'interaction entre Wordpress API et Angular

### Installation
Pour l'installer, exécutez les commandes ci-dessous.
```
bash> npm install -g typings
bash> npm install wp-api-angular
```
Modifier ensuite le fichier `app.module.ts` comme suit:
```typescript
import { Http } from '@angular/http';
import { 
  WpApiModule,
  WpApiLoader,
  WpApiStaticLoader
} from 'wp-api-angular'

export function WpApiLoaderFactory(http: Http) {
  return new WpApiStaticLoader(http, 'http://YOUR_DOMAIN/wp-json/', /* namespace is optional, default: '/wp/v2' */);
}

@NgModule({
  imports: [
    BrowserModule,
    WpApiModule.forRoot({
      provide: WpApiLoader,
      useFactory: (WpApiLoaderFactory),
      deps: [Http]
    })
  ],
  bootstrap: [App]
})
export class AppModule { }
```
### Exemples requêtes 
Vous pourrez ensuite effectuer des requêtes comme suit :

#### GET

Pour obtenir des données depuis l'API REST WordPress, il n'est pas nécessaire d'être connecté. Il vous suffit donc de faire comme celà:

```typescript

// Ex avec les Observables
loadPostsList() {
    this.wpApiPosts.getList()
    .pipe(
        map(res => res.json())
    )
    .subscribe(
        posts => this.posts = posts,
        error => console.error("Couldn't get the posts list", error)
    );
}

// Ex avec les Promises
  loadPostsList() {
    this.wpApiPosts.getList()
        .toPromise()
        .then(response => response.json())
        .then(posts => this.posts = posts)
        .catch(error => console.error("Couldn't get the posts list", error));
  }

```

#### POST

Pour l'ajout, l'édition ou la suppression de contenu a travers l'API WordPress, il est nécessaire de s'authentifier

Il existe plusieurs méthode d'authentification

* [Cookie Authentication](http://v2.wp-api.org/guide/authentication/#cookie-authentication)
* [OAuth Authentication](http://v2.wp-api.org/guide/authentication/#oauth-authentication)
* [Application Passwords or Basic Authentication](http://v2.wp-api.org/guide/authentication/#application-passwords-or-basic-authentication)

Dans l'exemple ci-dessous, nous allons utiliser la méthode `Basic Authentication` car celle-ci est facile à mettre en place. Si vous voulez qqch de sécurisé, il est fortement recommandé d'utiliser la 2e méthode `OAuth Authentication`.

Vous trouverez ici, les instructions sur comment configurer l'authentification OAuth : [https://oauth1.wp-api.org/](https://oauth1.wp-api.org/)

Avant de pouvoir utiliser la méthode `Basic Authentication`, il est nécessaire d'installer le plugin suivant sur votre site WordPress : [https://github.com/WP-API/Basic-Auth](https://github.com/WP-API/Basic-Auth)

Une fois ce plugin installé, vous pourrez insérer, modifier ou encore supprimer des contenus comme ceci: 
```javascript
// Nous passons le nom d'utilisateur et mot de passe WordPress dans l'entête de la requête.
this.headers = new Headers({
    'Content-Type': 'application/json;charset=UTF-8',
    'Authorization': 'Basic ' + btoa(Config.wordPressUsername + ':' + Config.wordPressPassword)
});

this.wpApiPosts.create(this.post, {headers: this.headers})
.pipe(
    map(res => res.json())
)
.subscribe((post) => {
    console.log('New post created', post);
}, (err) => {
    console.warn('Could not create the new post', err);
});
```


## Les observables 

Tout comme les promesses avaient modifié nos habitudes, la programmation réactive *(avec les observables)* nous oblige à apprendre un nouveau paradigme. Les documentations sont dures à comprendre, les schémas font peur et on ne sait pas par où commencer.

Et pourtant, il suffit de connaitre quelques bases pour s'en sortir dans presque tous les cas. Nous vous présenterons donc ces quelques classes et méthodes qui vous suivront tout au long de vos développements d'applications Angular.

### Qu'est ce que la programmation réactive ?
La programmation réactive se base sur le concept d'observateur. Si vous n'êtes pas familier avec ce principe, le principe est tout simplement que l'on définit des **observables** et des **observateurs**. Les observables vont émettre des événements qui seront interceptés par les observateurs.

La programmation réactive va étendre ce concept en permettant de combiner les observables, modifier les événements à la volée, les filtrer, etc.

### Créer un Observable à partir d'une Promise

```javascript
const articlesPromise = fetch('/articles').then(res => res.json());

const articles$ = Observable.fromPromise(articlesPromise);

articles$.subscribe(
    articles => console.log(articles)
);
```

et maintenant d'un Observable vers une promise

```javascript
const myObservable = Observable.of(42)
    .toPromise()
    .then(res => console.log(res))
    .catch(err => console.error(err));
```

### Combiner plusieurs observables

L'exemple ci-dessous nous log dans la console la position du curseur lorsque nous cliquons et que la position Y de notre curseur est suppérieure à 200.

```javascript
// Créer un observable à partir d'un évenement
const click$ = Observable.fromEvent(document, 'click');

click$.subscribe(
    () => console.log('clicked...')
);

const $mouse = Observable.fromEvent(document, 'mousemove')
    .filter((move:MouseEvent) => move.clientY >= 200);

mouse$.subscribe(
    (move:MouseEvent) => console.log(move)
);

const combined$ = Observable.combineLatest(mouse$, click$);

combined$.subscribe(
    combined => console.log(combined[0])
);
```

### Requetes HTTP

Le module `HttpClient` d'Angular renvoie par défaut des **Observables**

```javascript
const response$: Observable<Response> = http.get('/articles')
    // Retourne par défaut un Observable de réponse HTTP, nous devons convertir la réponse en JSON pour obtenir le contenu des articles
    .map((res: Response) => res.json());

response$.subscribe(
    // On success
    articles => console.log(articles),
    // On error
    err => console.error(err), 
    // Completed
    () => console.log('completed!')
);
```

### RxJS concat

Si vous voulez effectuer plusieurs requêtes l'une après les autres, vous pouvez utiliser la fonction `concat`.

L'exemple ci-dessous supprime les deux premiers articles en ensuite recharge la liste des articles.

```javascript
consecutiveReqs() {
    const deleteFirst$ = this.articlesService.delete(1);

    const deleteSecond$ = this.articlesService.delete(2);

    const reload$ = this.articlesService.loadArticles().cache();

    const combined$ = Observable.concat(
        deleteFirst$,
        deleteSecond$,
        reload$
    );

    combined$.subscribe(
        () => {},
        () => {},
        () => {
            console.log("reload finished");
            this.articles$ = reload$
        }
    );
}
```

### Chainer des requetes HTTP

Il est également possible de chaîner les requêtes HTTP à l'aide de la fonction `switchMap` ou `mergeMap`. Il existe des petites différences entre ces deux fonctions donc je vous recommande de lire cet article pour en savoir plus: [https://javascript.tutorialhorizon.com/2017/03/29/switchmap-vs-flatmap-rxjs/](https://javascript.tutorialhorizon.com/2017/03/29/switchmap-vs-flatmap-rxjs/)

Dans l'exemple ci-dessous, nous effectuons un appel GET vers un API et utilisons sont résultat au format JSON dans l'appel de la 2e requête.

```javascript
Rx.Observable.of('some_url')
  .switchMap(url => this.http.get(url).map(res=>res.json())
  .switchMap(res => this.http.get(url + 'res').map(res=>res.json())
```

### RxJS retry operator

Un des grand avantage des Observables sur les Promise et qu'il est possible de réessayer plusieurs fois une requête jusqu'à ce que nous obtenons le résultat escompté.

Avec la fonction `retry()` la requête sera réexécuter si l'Observable retourne une erreur.

Il existe également la fonction `retryWhen()` qui permet d'attendre un instant avant de réexécuter la requête.

```javascript
// Réessaye directement si retourne une erreur
this.articles$ = articlesService.loadArticles().retry();

// Pas une bonne idée sans attendre
// Réessaye après 5 sec
this.articles$ = articlesService.loadArticles().retryWhen(errors => errors.delay(5000));
```

### Annuler une requête
RxJS nous permet également d'annuler des requêtes. Par exemple, cela pourrait nous être utile si l'utilisateur change de page sur une single page application. Sans annuler la requête, on obtiendrais des données dont nous n'avons plus besoin. Il est donc recommandé d'annuler cette requête.

```javascript
reload() {
    this.articles$ = this.articleService.loadArticles();
    this.sub = this.articles$.subscribe(
        articles => this.articles = articles
    );
}

// Annule la requete si elle est toujours en éxecution
cancel() {
    this.sub.unsubscribe();
}
```

### Le pipe asinc ( `| async` ) dans Angular

Le pipe async dans Angular vous permet d'utiliser vos observables directement à partir des templates.

Dans l'exemple suivant, `this.articles$` contient un Observable d'articles
```javascript
this.articles$ = articlesService.loadArticles();
```
Il est possible d'afficher les articles de cette manière sans devoir stocker les articles sous la forme d'un tableau d'objets dans notre composant
```html
<p>Total articles: {{ (articles | async)?.length }}</p>
<ul *ngIf="(articles | async)">
    <li*ngFor="let article of (articles | async)">
        {{ article.title }}
    </li>
</ul>
```

## [Routage avec Angular](https://angular.io/guide/router)

Angular 5 comprend un module permettant de faire du routage.

Nous allons rapidement parcourir le fonctionnement de ce module sans entrer dans les détails.

### Module de routage

Dans le cas d'une petite application avec uniquement un `Router` il est possible d'intégrer les route directement de le fichier `app.module.ts`. Si votre application grandi, l'utilisation d'un module de routage peut s'avérer utile. Pour créer un module de routage, faites comme ceci:

* Créer un nouveau fichier appelé `angular-project/src/app/app-routing.module.ts`

```typescript
import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PageHomeComponent } from './page-home/page-home.component';
import { PageListArticlesComponent } from './page-list-articles/page-list-articles.component';

const appRoutes: Routes = [
    // http://mon-app-angular.com/home
    { path: 'home', component: PageHomeComponent, data: { title: 'Accueil' } },
    // http://mon-app-angular.com/articles
    { path: 'articles', component: PageListArticlesComponent },
    // http://mon-app-angular.com
    // Si il n'y a pas de route, on redirige vers /home
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    // Route par défaut
    // Par exemple http://mon-app-angular.com/test affichera le contenu du composant PageNotFoundComponent
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
```

* Une fois ce fichier créé, il est nécessaire d'importer ce module dans notre projet Angular. Pour ce faire, modifier le fichier `app.module.ts` comme ceci:

```typescript
import { BrowserModule } from '@angular/platform-browser';
...
import { AppRoutingModule } from './app-routing.module';
...

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...
    AppRoutingModule,
    ...
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Pour intégrer le menu dans nos template, faites comme ceci: 
```html 
<nav #sidenav id="main-navigation">
    <ul>
        <li *ngFor="let menuItem of mainMenu">
          <a [routerLink]="[menuItem.route]" (click)="menuClick(menuItem.title)"> {{ menuItem.title }}</a>
        </li>
    </ul>
</nav>

<main id="main-content" class="content">
    <router-outlet>
    <!-- Le contenu de nos routes s'affichera ici -->
    </router-outlet>
</main>
```

## Librairies de composants graphiques Angular

Il existe de nombreuses librairies UI Angular mais la plus connu d'entre elle s'appelle `Material Design for Angular` ou `material2`.
Cette librairie suit les règles de la Material Design Guidelines de Google et est relativement complète, c'est pourquoi nous allons l'utiliser pour un micro projet

Vous trouverez la [documentation complète ici](https://material.angular.io/)

Pour installer les composants requis dans votre application Angular, exécuter la commande suivante :

```
bash> npm install --save @angular/material @angular/cdk
bash> npm install --save @angular/animations
```

Créer ensuite un nouveau fichier `/src/app/material.module.ts` avec le contenu suivant:
```javascript
import { NgModule } from '@angular/core';

import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  } from '@angular/material';

@NgModule({
  imports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  exports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
  ]
})
export class MaterialModule {}
```

Dans l'exemple ci-dessus, nous importons tous les modules de tous les composants `material2`. Si vous ne les utilisez pas tous, il est recommandé de ne pas les importer afin de gagner en rapidité.

Une fois ce module créé, il est nécessaire de modifier notre fichier `app.module.ts` comme ceci:

```javascript
...
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
...

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...
    MaterialModule,
    BrowserAnimationsModule,
    ...
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

Vous pouvez désormais utiliser tous les composants graphiques de la librairie `material2`.

### Exemple d'utilisation

[Voir l'exemple sur Heroku]

```html
<h3>Checkbox</h3>
<mat-checkbox>Check me!</mat-checkbox>

<h3>Datepicker</h3>
<mat-form-field>
  <input matInput [matDatepicker]="picker" placeholder="Choose a date">
  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
  <mat-datepicker #picker></mat-datepicker>
</mat-form-field>

<h3>Form fields</h3>
<mat-form-field>
  <input matInput placeholder="Input">
</mat-form-field>

<h3>Radio buttons</h3>
<mat-radio-group>
  <mat-radio-button value="1">Option 1</mat-radio-button>
  <mat-radio-button value="2">Option 2</mat-radio-button>
</mat-radio-group>

<h3>Basic select</h3>
<mat-form-field>
  <mat-select placeholder="Favorite food">
    <mat-option value="steak">
      Steak
    </mat-option>
    <mat-option value="hamburger">
      Hamburger
    </mat-option>
    <mat-option value="frites">
      Frites
    </mat-option>
  </mat-select>
</mat-form-field>

<h3>Slider</h3>
<mat-slider></mat-slider>

<h3>Basic slide-toggles</h3>
<mat-slide-toggle>Slide me!</mat-slide-toggle>
```

## Références

**Mise en pratique de RxJS dans Angular**

[https://makina-corpus.com/blog/metier/2017/premiers-pas-avec-rxjs-dans-angular](https://makina-corpus.com/blog/metier/2017/premiers-pas-avec-rxjs-dans-angular)

**Les composants graphiques Angular à connaître en 2018**

[https://blog.bitsrc.io/11-angular-component-libraries-you-should-know-in-2018-e9f9c9d544ff](https://blog.bitsrc.io/11-angular-component-libraries-you-should-know-in-2018-e9f9c9d544ff)