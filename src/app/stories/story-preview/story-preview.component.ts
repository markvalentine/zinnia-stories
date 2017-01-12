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

  previewStory() {
    var tempCont = document.getElementById('delta');
    (new Quill(tempCont, {readOnly: true})).setContents(this.story.delta);
    tempCont.getElementsByClassName("ql-editor")[0].setAttribute("style", "padding: 0;");
    return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
  }

}
