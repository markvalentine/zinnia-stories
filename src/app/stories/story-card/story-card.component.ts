import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Story } from '../story';

@Component({
  selector: 'app-story-card',
  templateUrl: './story-card.component.html',
  styleUrls: ['./story-card.component.css']
})
export class StoryCardComponent implements OnInit {
  @Input()
  storyString: string;
  @Input()
  story: Story;
  @Input()
  noShowStar = false;
  @Input()
  position = "left";
  @Input()
  smaller = "";

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

  encodeURL(url: string): string {
    return encodeURI(url);
  }

  /**
   * navigate to the detail page
   * called by clicking on a story card in template
   */
  goToDetail(key: string) {
    let link = ['/stories', key];
    this.router.navigate(link);
  }

  facebook(event: Event) {
    event.stopPropagation();
    console.log(this.router.url);
    FB.ui(
      {
        method: 'feed',
        name: this.story.title,
        description: this.story.description,
        picture: this.story.image_url,
        link: 'https://markvalentine.github.io/zinnia-stories'+this.router.url
      }, function(response){});
  }

  stopPropTwitter(event: Event) {
    event.stopPropagation();
    document.getElementById("proxyAnchor-twitter-"+this.story.$key).click();
  }

  stopPropPinterest(event: Event) {
    event.stopPropagation();
    document.getElementById("proxyAnchor-pinterest-"+this.story.$key).click();
  }

}
