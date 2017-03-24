import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Story } from '../story';

declare let ga: Function;

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

  goToCollection(key: string) {
    let link = ['/collections', key];
    this.router.navigate(link);
  }

  facebook(event: Event) {
    event.stopPropagation();
    this.handleShare('facebook');
    FB.ui(
      {
        method: 'feed',
        name: this.story.title,
        description: this.story.description,
        picture: this.story.image_url,
        link: 'https://ramblinstories.com'+this.router.url
      }, function(response){});
  }

  stopPropTwitter(event: Event) {
    event.stopPropagation();
    this.handleShare('twitter');
    document.getElementById("proxyAnchor-twitter-"+this.story.$key).click();
  }
  
  stopPropPinterest(event: Event) {
    event.stopPropagation();
    this.handleShare('pinterest');
    document.getElementById("proxyAnchor-pinterest-"+this.story.$key).click();
  }

  handleShare(socialNetwork: string) {
    ga('send', {
      hitType: 'social',
      socialNetwork: socialNetwork,
      socialAction: 'share',
      socialTarget: this.story.$key+"-card"
    });

    ga('send', 'event', {
      eventCategory: 'share',
      eventAction: socialNetwork,
      eventLabel: this.story.$key+"-card",
      transport: 'beacon'
    });
  }

}
