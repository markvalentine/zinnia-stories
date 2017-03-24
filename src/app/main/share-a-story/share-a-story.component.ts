import { Component, OnInit } from '@angular/core';

declare let ga: Function;

@Component({
  selector: 'app-share-a-story',
  templateUrl: './share-a-story.component.html',
  styleUrls: ['./share-a-story.component.css']
})
export class ShareAStoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  handleOutboundLinkClicks(event, link: string) {
    ga('send', 'event', {
      eventCategory: 'Outbound Link',
      eventAction: 'click',
      eventLabel: link,
      transport: 'beacon'
    });
  }

}
