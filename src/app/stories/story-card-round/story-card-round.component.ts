import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoryCard } from '../story';

declare let ga: Function;

@Component({
  selector: 'app-story-card-round',
  templateUrl: './story-card-round.component.html',
  styleUrls: ['./story-card-round.component.css']
})
export class StoryCardRoundComponent implements OnInit {
  @Input()
  storycardString: string;
  @Input()
  storycard: StoryCard;

  constructor(private router: Router) {
  }

  /**
   * create the story from input json string
   */
  ngOnInit() {
    if(this.storycardString){
      this.storycard = new StoryCard(this.storycardString);
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
    this.handleShare('facebook');
    FB.ui(
      {
        method: 'feed',
        name: this.storycard.title,
        description: this.storycard.description,
        picture: this.storycard.image_url,
        link: 'https://ramblinstories.com'+this.router.url
      }, function(response){});
  }

  stopPropTwitter(event: Event) {
    event.stopPropagation();
    this.handleShare('twitter');
    document.getElementById("proxyAnchor-twitter-"+this.storycard.$key).click();
  }

  stopPropPinterest(event: Event) {
    event.stopPropagation();
    this.handleShare('pinterest');
    document.getElementById("proxyAnchor-pinterest-"+this.storycard.$key).click();
  }

  handleShare(socialNetwork: string) {
    ga('send', {
      hitType: 'social',
      socialNetwork: socialNetwork,
      socialAction: 'share',
      socialTarget: this.storycard.$key+"-card"
    });

    ga('send', 'event', {
      eventCategory: 'share',
      eventAction: socialNetwork,
      eventLabel: this.storycard.$key+"-card",
      transport: 'beacon'
    });
  }

}