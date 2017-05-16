import { Component, OnInit } from '@angular/core';
import { SeoService } from '../seo.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  private pageTitle = "Meet the Team | Ramblin Stories";
  private pageDescription = "We’re traveling the country in our Ramblin Story Wagon sharing the stories of old-timers we meet along the way.";

  constructor(private seoService: SeoService) {
    this.seoService.setTitle(this.pageTitle);
    this.seoService.setMetaDescription(this.pageDescription);
  }

  ngOnInit() {
    window.scrollTo(0, 0);    
  }

}
