import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { StoryService } from '../story.service';

declare let ga: Function;

@Component({
  selector: 'app-all-stories',
  templateUrl: './all-stories.component.html',
  styleUrls: ['./all-stories.component.css']
})
export class AllStoriesComponent implements OnInit, OnDestroy {
  featuredStoryIDs: FirebaseListObservable<any[]>;
  featuredStories: Observable<any>;
  storycards: FirebaseListObservable<any[]>;
  storycardSubscription: Subscription
  // don't load next stories until the previous load finishes
  isLoadingNext = true;

  constructor(
    private router: Router,
    private storyService: StoryService
  ) {}

  /**
   * get stories and subscribe to the story list to see when
   * infinite scroll is done loading
   */
  ngOnInit() {
    window.scrollTo(0, 0);
    // this.featuredStoryIDs = this.storyService.getFeaturedStoryIDs();
    // this.featuredStories = this.storyService.getFeaturedStories();
    this.storycards = this.storyService.getStoryCards();
    this.storycardSubscription = this.storycards.subscribe(x => this.isLoadingNext = false );
  }

  /**
   * unsubscribe from the stories
   */
  ngOnDestroy() {
    this.storycardSubscription.unsubscribe();
  }

  /**
   * navigate to the detail page
   * called by clicking on a story card in template
   */
  goToDetail(key: string) {
    let link = ['/stories', key];
    this.router.navigate(link);
  }

  /**
   * load next x stories
   */
  moreStories() {
    this.isLoadingNext = true;
    this.storyService.nextStorycards(10);
  }

  /**
   * listen to the scrolling to determine when to load next x stories
   */
  // @HostListener('window:scroll', ['$event']) 
  //   checkScroll(event) {
  //     if (document.body.scrollTop >= document.body.scrollHeight - window.innerHeight) {
  //       if (!this.isLoadingNext) {
  //         this.moreStories();
  //       }
  //     }
  //   }

  handleOutboundLinkClicks(event, link: string) {
    ga('send', 'event', {
      eventCategory: 'Outbound Link',
      eventAction: 'click',
      eventLabel: link,
      transport: 'beacon'
    });
  }

}
