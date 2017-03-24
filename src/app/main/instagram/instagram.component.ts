import { Component, OnInit } from '@angular/core';
import { InstagramService } from './instagram.service';
import { Observable } from 'rxjs/Observable';

declare let ga: Function;

@Component({
  selector: 'app-instagram',
  templateUrl: './instagram.component.html',
  styleUrls: ['./instagram.component.css']
})
export class InstagramComponent implements OnInit {

  images: Observable<any>;

  constructor(private instagramService: InstagramService) { }

  ngOnInit() {
    this.images = Observable.create( subscriber => {
      this.instagramService.getInsta().subscribe(x => {
        console.log(x);
        subscriber.next(x['data']);
      }, error => {
        console.log("ERRRORORROORR", error);
      });
    });
  }

  getInsta() {

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
