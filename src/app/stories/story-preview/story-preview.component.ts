import { Component, OnInit, Input } from '@angular/core';
import { Story } from '../story';

@Component({
  selector: 'app-story-preview',
  templateUrl: './story-preview.component.html',
  styleUrls: ['./story-preview.component.css']
})
export class StoryPreviewComponent implements OnInit {

  @Input()
  storyString: string;
  @Input()
  story: Story;

  constructor() {
  }

  /**
   * create the story from input json string
   */
  ngOnInit() {
    if(this.storyString){
      this.story = new Story(this.storyString);
    }
  }

}
