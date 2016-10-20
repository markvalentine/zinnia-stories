import { Component } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(public router:Router) {
    this.router.events.subscribe(
      (event:Event) => {
        if (event instanceof NavigationEnd) {
          // put google analytics here
        }
      });
    }
}
