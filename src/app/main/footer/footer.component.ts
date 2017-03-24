import { Component, OnInit } from '@angular/core';
declare let ga: Function;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  handleOutboundLinkClicks(event) {
    console.log(event);
    ga('send', 'event', {
      eventCategory: 'Outbound Link',
      eventAction: 'click',
      eventLabel: event.target.href,
      transport: 'beacon'
    });
  }

}
