import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { StoryService } from '../../stories/story.service';
import { Story } from '../../stories/story';
import { CollectionService } from '../../collections/collection.service';
import { Collection } from '../../collections/collection';
import { SeoService } from '../seo.service';

declare let ga: Function;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private pageTitle = "Ramblin Stories: Sharing Stories from the Older Generation";
  private pageDescription = "We’re traveling the country in our Ramblin Story Wagon sharing the stories of old-timers we meet along the way.";

  featuredStoryCards: Observable<any[]>;
  featuredStoryCardsMiddle: Observable<any[]>;
  featuredStoryCardsLast: Observable<any[]>;
  collections: FirebaseListObservable<any[]>;

  background_url = "assets/images/0.jpg";
  background_color= "#C58B57";

  colors = ["#C58B57", "#233128", "#E6BB58"];

  constructor(
    private storyService: StoryService,
    private collectionService: CollectionService,
    private seoService: SeoService
  ) {
    this.seoService.setTitle(this.pageTitle);
    this.seoService.setMetaDescription(this.pageDescription)
    let index = (Math.round((Date.now()/600000))%3);
    this.background_url = "url(/assets/images/backgrounds/"+index+".jpg)";
    this.background_color = this.colors[index];
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.featuredStoryCards = this.storyService.getXFeaturedStoryCards(3);
    this.featuredStoryCardsMiddle = this.storyService.getXFeaturedStoryCards(6);
    this.featuredStoryCardsLast = this.storyService.getXFeaturedStoryCards(10);
    this.collections = this.collectionService.getCollections();
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
