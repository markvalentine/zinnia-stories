import { Component, Input, OnInit } from '@angular/core';
import { Story } from '../story';

@Component({
  selector: 'app-story-card',
  templateUrl: './story-card.component.html',
  styleUrls: ['./story-card.component.css']
})
export class StoryCardComponent implements OnInit {
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
