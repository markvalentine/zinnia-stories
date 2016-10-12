import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Story } from '../story';

@Component({
  selector: 'app-featured-story-card',
  templateUrl: './featured-story-card.component.html',
  styleUrls: ['./featured-story-card.component.css']
})
export class FeaturedStoryCardComponent implements OnInit {
  @Input()
  storyString: string;
  @Input()
  story: Story;
  @Input()
  noShowStar = false;

  constructor(private router: Router) {
  }

  /**
   * create the story from input json string
   */
  ngOnInit() {
    if(this.storyString){
      this.story = new Story(this.storyString);
    }
  }

  /**
   * navigate to the detail page
   * called by clicking on a story card in template
   */
  goToDetail(key: string) {
    let link = ['/stories', key];
    this.router.navigate(link);
  }

}
