import { Component, OnInit } from '@angular/core';
import { WpApiPosts } from 'wp-api-angular';
import { map } from 'rxjs/operators';

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

  private loadPostsList() {
    this.wpApiPosts.getList().pipe(
      map(res => res.json())
    ).subscribe((posts) => {
      this.posts = posts;
      console.log(posts);
    })
  }

}
