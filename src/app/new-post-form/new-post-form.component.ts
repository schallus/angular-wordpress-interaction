import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WpApiPosts } from 'wp-api-angular';
import { map } from 'rxjs/operators';
import { Headers } from '@angular/http';
import { NgForm } from '@angular/forms';

import { Config } from '../config';
import { Post } from '../../models/post';

@Component({
  selector: 'app-new-post-form',
  templateUrl: './new-post-form.component.html',
  styleUrls: ['./new-post-form.component.css']
})
export class NewPostFormComponent implements OnInit {

  @Output()
  created = new EventEmitter<string>();
  
  post: Post;
  headers: Headers;

  constructor(
    private wpApiPosts: WpApiPosts
  ) { 
    this.headers = new Headers({
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': 'Basic ' + btoa(Config.wordPressUsername + ':' + Config.wordPressPassword)
    });

    this.post = new Post();
  }

  ngOnInit() { }

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('the form is valid!', this.post);
      this.wpApiPosts.create(this.post, {headers: this.headers}).pipe(
        map(res => res.json())
      ).subscribe((post) => {
        console.log(post);
        this.created.emit('complete');
      }, (err) => {
        console.warn('Could not create the new post', err);
      });
    }
  }
}
