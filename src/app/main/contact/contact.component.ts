import { Component, OnInit } from '@angular/core';
import { SeoService } from '../seo.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  private pageTitle = "Contact Us | Ramblin Stories";
  private pageDescription = "Have a story you want to share?  How about a question?  Want to partner up?  Or do you just want to talk?  Get in touch with us!";

  constructor(private seoService: SeoService) {
    this.seoService.setTitle(this.pageTitle);
    this.seoService.setMetaDescription(this.pageDescription);
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

}
