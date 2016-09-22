import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { StoryService } from '../story.service';

@Component({
  selector: 'app-all-stories',
  templateUrl: './all-stories.component.html',
  styleUrls: ['./all-stories.component.css']
})
export class AllStoriesComponent implements OnInit, OnDestroy {

  stories: FirebaseListObservable<any[]>;
  storySubscription: Subscription
  // don't load next stories until the previous load finishes
  isLoadingNext = true;

  constructor(
    public router: Router,
    public storyService: StoryService
  ) {}

  /**
   * get stories and subscribe to the story list to see when
   * infinite scroll is done loading
   */
  ngOnInit() {
    this.stories = this.storyService.getStories();
    this.storySubscription = this.stories.subscribe(x => this.isLoadingNext = false );
  }

  /**
   * unsubscribe from the stories
   */
  ngOnDestroy() {
    this.storySubscription.unsubscribe();
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
    this.storyService.nextStories();
  }

  /**
   * listen to the scrolling to determine when to load next x stories
   */
  @HostListener('window:scroll', ['$event']) 
    checkScroll(event) {
      if (document.body.scrollTop >= document.body.scrollHeight - window.innerHeight) {
        if (!this.isLoadingNext) {
          this.moreStories();
        }
      }
    }

}
