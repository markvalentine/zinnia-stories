import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StoryService } from '../../stories/story.service';
import { Story } from '../../stories/story';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  featuredStories: Observable<any[]>;

  constructor(
    private storyService: StoryService
  ) { }

  ngOnInit() {
    this.featuredStories = this.storyService.getXFeaturedStories(4);
  }

}
