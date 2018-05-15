import { Component, OnInit } from '@angular/core';
import { SeoService } from '../seo.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {
  
  private pageTitle = "Privacy Policy | Ramblin Stories";
  private pageDescription = "The Privacy Policy for ramblinstories.com, a property owned, operated and distributed by Ramblin LLC, a New Mexico Limited Liability Company.";

  constructor(private seoService: SeoService) {
    this.seoService.setTitle(this.pageTitle);
    this.seoService.setMetaDescription(this.pageDescription);
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

}
