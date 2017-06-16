import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../admin/admin.service';
import { MapService } from '../map.service';
import { Camp } from '../map';

@Component({
  selector: 'app-add-camp',
  templateUrl: './add-camp.component.html',
  styleUrls: ['./add-camp.component.css']
})
export class AddCampComponent implements OnInit {

  camp: Camp;
  isAuth: any;
  isAdding: boolean;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private mapService: MapService
  ) { }

  ngOnInit() {
    this.camp = new Camp();
    this.isAuth = this.adminService.isAuth();
    this.isAdding = false;

  }

  resetForm() {
    this.camp = new Camp();
    this.isAdding = false;
  }

  addCamp() {
    this.isAdding = true;
    this.mapService.addCamp(this.camp)
      .then(camp => {
        this.resetForm();
      })
      .catch(err => {
        console.log(err);
        this.isAdding = false;
      });
  }

}