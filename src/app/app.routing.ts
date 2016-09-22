import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './main/home/home.component';
import { AboutComponent } from './main/about/about.component';
import { HelpComponent } from './main/help/help.component';

import { AdminComponent } from './admin/admin.component';

import { AllStoriesComponent } from './stories/all-stories/all-stories.component';
import { StoryDetailComponent } from './stories/story-detail/story-detail.component';
import { EditStoryComponent } from './stories/edit-story/edit-story.component';
import { AddStoryComponent } from './stories/add-story/add-story.component';

import { PageNotFoundComponent } from './main/page-not-found/page-not-found.component';

const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'help',
        component: HelpComponent
    },
    {
        path: 'admin',
        component: AdminComponent
    },
    {
        path: 'stories',
        component: AllStoriesComponent
    },
    {

        path: 'stories/:key',
        component: StoryDetailComponent
    },
    {
        path: 'edit-story/:key',
        component: EditStoryComponent
    },
    {
        path: 'add-story',
        component: AddStoryComponent
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);