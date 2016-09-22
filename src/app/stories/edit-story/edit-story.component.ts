import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AdminService } from '../../admin/admin.service';
import { StoryService } from '../story.service';
import { Story } from '../story';

@Component({
  selector: 'app-edit-story',
  templateUrl: './edit-story.component.html',
  styleUrls: ['./edit-story.component.css']
})
export class EditStoryComponent implements OnInit {

  key: string;
  isAuth: any;
  story: Observable<Story[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storyService: StoryService,
    private adminService: AdminService
  ) { }

  /**
   * On Init: 
   * get key from params, get authentication from service, get story from service
   */
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.key = params['key'];
      this.isAuth = this.adminService.isAuth();
      this.story = this.storyService.getStoryAsArray(this.key);
    });
  }

  /**
   * FOR NOW ONLY PROPERTIES
   * update story and wait for completion to navigate away
   */
  updateStory(story: Story) {
    this.storyService.updateStory(story)
    .then(_ => {
      this.goBack();
    })
    .catch(err => console.log(err));
  }

  /**
   * deletes story and navigates to story list upon completion
   */
  deleteStory(key: string) {
    this.storyService.deleteStory(key)
    .then( x => {
      let link = ['/stories'];
      this.router.navigate(link);
    })
    .catch( err => {
      console.log(err);
    });
  }

  /**
   * redirects back to story
   */
  goBack(): void {
    let link = ['/stories', this.key];
    this.router.navigate(link);
  }

}
