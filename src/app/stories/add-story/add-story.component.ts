import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../admin/admin.service';
import { StoryService } from '../story.service';
import { Story } from '../story';

@Component({
  selector: 'app-add-story',
  templateUrl: './add-story.component.html',
  styleUrls: ['./add-story.component.css']
})
export class AddStoryComponent implements OnInit {
  
  story: Story;
  isAuth: any;
  isAdding: boolean;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private storyService: StoryService,
  ) {
    this.story = new Story();
    this.isAuth = this.adminService.isAuth();
    this.isAdding = false;
  }

  ngOnInit() {
  }

  resetForm() {
    this.story = new Story();
    this.isAdding = false;
  }

  // only does title, description, text for now
  addStory() {
    this.isAdding = true;
    
    this.storyService.addStory(this.story)
      .then(key => {
        this.resetForm()
        let link = ['/stories/'+key];
        this.router.navigate(link);
      })
      .catch(err => {
        console.log(err);
        this.isAdding = false;
      });
  }

}
