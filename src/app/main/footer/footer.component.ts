import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare let ga: Function;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  display = "block";

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if(this.router.url.includes('map')) {
        this.display = "none";
      } else {
        this.display = "block";
      }
    })
  }

  handleOutboundLinkClicks(link: string) {
    ga('send', 'event', {
      eventCategory: 'Outbound Link',
      eventAction: 'click',
      eventLabel: link,
      transport: 'beacon'
    });
  }

}
