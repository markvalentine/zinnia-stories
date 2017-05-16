import { Component, OnInit } from '@angular/core';
import { SeoService } from '../seo.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {

  private pageTitle = "Terms of Use | Ramblin Stories";
  private pageDescription = "The terms and conditions of use for ramblinstories.com, a property owned, operated and distributed by Ramblin LLC, a New Mexico Limited Liability Company.";

  constructor(private seoService: SeoService) {
    this.seoService.setTitle(this.pageTitle);
    this.seoService.setMetaDescription(this.pageDescription);
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

}
