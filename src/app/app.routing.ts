import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './main/home/home.component';
import { AboutComponent } from './main/about/about.component';
import { HelpComponent } from './main/help/help.component';
import { TeamComponent } from './main/team/team.component';
import { ContactComponent } from './main/contact/contact.component';
import { TermsComponent } from './main/terms/terms.component';

import { AdminComponent } from './admin/admin.component';

import { AllStoriesComponent } from './stories/all-stories/all-stories.component';
import { StoryDetailComponent } from './stories/story-detail/story-detail.component';
import { EditStoryComponent } from './stories/edit-story/edit-story.component';
import { AddStoryComponent } from './stories/add-story/add-story.component';

import { AllCollectionsComponent } from './collections/all-collections/all-collections.component';
import { CollectionDetailComponent } from './collections/collection-detail/collection-detail.component';
import { EditCollectionComponent } from './collections/edit-collection/edit-collection.component';
import { AddCollectionComponent } from './collections/add-collection/add-collection.component';

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
        path: 'faq',
        component: HelpComponent
    },
    {
        path: 'team',
        component: TeamComponent
    },
    {
        path: 'contact',
        component: ContactComponent
    },
    {
        path: 'terms-of-use',
        component: TermsComponent
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
    },{
        path: 'collections',
        component: AllCollectionsComponent
    },
    {
        path: 'collections/:key',
        component: CollectionDetailComponent
    },
    {
        path: 'edit-collection/:key',
        component: EditCollectionComponent
    },
    {
        path: 'add-collection',
        component: AddCollectionComponent
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);