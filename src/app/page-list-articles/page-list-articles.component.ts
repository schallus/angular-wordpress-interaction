import { Component, OnInit } from '@angular/core';
import { WpApiPosts } from 'wp-api-angular';
import { map, retryWhen, zip, mergeMap } from 'rxjs/operators';
import { Observable, pipe } from 'rxjs';
import { timer } from 'rxjs/observable/timer';
import { range } from 'rxjs/observable/range';

import { Post } from '../../models/post';

@Component({
  selector: 'app-page-list-articles',
  templateUrl: './page-list-articles.component.html',
  styleUrls: ['./page-list-articles.component.css']
})
export class PageListArticlesComponent implements OnInit {

  posts: any;

  constructor(
    private wpApiPosts: WpApiPosts
  ) { 
    this.loadPostsList();
  }

  ngOnInit() {

  }

  backoff(maxTries, ms) {
    return pipe(
      retryWhen(attempts => range(1, maxTries)
        .pipe(
          zip(attempts, (i) => i),
          map(i => i * i),
          mergeMap(i =>  timer(i * ms))
        )
      )
    );
   }

  /*loadPostsList() {
    console.log('Load post list');
    this.wpApiPosts.getList()
    .pipe(
      map(res => res.json()),
      this.backoff(3, 250)
    )
    .subscribe(posts => {
      console.log(posts);
      this.posts = posts;
    });
  }*/

  loadPostsList() {
    this.wpApiPosts.getList()
        .toPromise()
        .then(response => response.json())
        .then(posts => this.posts = posts)
        .catch(error => console.error("Couldn't get the posts list", error));
  }

}
