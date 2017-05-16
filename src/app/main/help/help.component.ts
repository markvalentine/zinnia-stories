import { Component, OnInit } from '@angular/core';
import { SeoService } from '../seo.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  private pageTitle = "FAQ | Ramblin Stories";
  private pageDescription = "Frequently asked question and other helpful tips.  Have a question of your own?  Email us at help@ramblinstories.com!";

  constructor(private seoService: SeoService) {
    this.seoService.setTitle(this.pageTitle);
    this.seoService.setMetaDescription(this.pageDescription);
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

}
