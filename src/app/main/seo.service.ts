import { Injectable } from '@angular/core';
import { Title, BrowserModule, Meta } from '@angular/platform-browser';

@Injectable()
export class SeoService {

  constructor(private titleService: Title, private metaService: Meta) {}

  public getTitle(): string {
    return this.titleService.getTitle();
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  public getMetaDescription(): string {
    return this.metaService.getTag('description').content;
  }

  public setMetaDescription(description: string) {
    if (this.getMetaDescription()) {
      this.metaService.getTag('description').content = description;
    }
  }
  
  public setCanonical(link: string) {
    
  }
}
