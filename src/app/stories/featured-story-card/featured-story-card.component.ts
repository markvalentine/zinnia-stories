import { Component, Input, OnInit } from '@angular/core';
import { Story } from '../story';

@Component({
  selector: 'app-featured-story-card',
  templateUrl: './featured-story-card.component.html',
  styleUrls: ['./featured-story-card.component.css']
})
export class FeaturedStoryCardComponent implements OnInit {
  @Input()
  storyString: string;

  story: Story

  constructor() {
  }

  /**
   * create the story from input json string
   */
  ngOnInit() {
    this.story = new Story(this.storyString);
  }

}
