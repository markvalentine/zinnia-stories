import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AdminService } from '../../admin/admin.service';
import { StoryService } from '../story.service';
import { Story } from '../story';

@Component({
  selector: 'app-story-detail',
  templateUrl: './story-detail.component.html',
  styleUrls: ['./story-detail.component.css']
})
export class StoryDetailComponent implements OnInit {

  key: string;
  isAuth: any;
  story: Observable<Story>;
  storyObject: Story;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storyService: StoryService,
    private adminService: AdminService
  ) {
  }

  /**
   * On Init: 
   * get key from params, get authentication from service, get story from service
   */
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      window.scrollTo(0, 0);
      this.key = params['key'];
      this.isAuth = this.adminService.isAuth();
      this.story = this.storyService.getStory(this.key);
      this.story.subscribe(x => {
        this.storyObject = x;
        if (this.storyObject.delta) {
          var tempCont = document.getElementById('delta');
          (new Quill(tempCont, {readOnly: true})).setContents(this.storyObject.delta);
          tempCont.getElementsByClassName("ql-editor")[0].setAttribute("style", "padding: 0;");
          return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
        }
      });
    });
  }

  /**
   * redirects to edit page for this story
   */
  toEdit(): void {
    let link = ['/edit-story', this.key];
    this.router.navigate(link);
  }

  goToCollection(key: string) {
    let link = ['/collections', this.key];
    this.router.navigate(link);
  }

  facebook() {
    console.log(this.router.url);
    FB.ui(
      {
        method: 'feed',
        name: this.storyObject.title,
        description: this.storyObject.description,
        picture: this.storyObject.image_url,
        link: 'https://markvalentine.github.io/zinnia-stories'+this.router.url
      }, function(response){});
  }

}
