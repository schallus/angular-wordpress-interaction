import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  pageTitle: string;
  mainMenu: Array<{
    title: string,
    route: string,
    icon: string,
    state: string
  }>;

  constructor(){
    //called first time before the ngOnInit()

    this.mainMenu = [
      { title: 'Accueil', route: 'home', icon: 'home', state: 'active'},
      { title: 'Articles', route: 'articles', icon: 'find_in_page', state: 'inactive'},
      { title: 'Test', route: 'test', icon: 'home', state: 'inactive'}
    ];

    this.pageTitle = 'Accueil'
  }

  ngOnInit(){
    //called after the constructor and called  after the first ngOnChanges() 
  }

  menuClick(title: string, sidenav: any) {
    console.log('menu click');
    this.mainMenu = this.mainMenu.map((menuItem) => {
      if(menuItem.title == title) {
        menuItem.state = 'active';
      } else {
        menuItem.state = 'inactive';
      }
      return menuItem;
    });
    this.setPageTitle();
    sidenav.close();
  }

  private setPageTitle() {
    this.pageTitle = this.mainMenu.filter((menuItem) => menuItem.state == 'active').map((menuItem) => menuItem.title)[0];
  }
}
