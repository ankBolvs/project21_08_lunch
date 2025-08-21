import { RestDataSource } from './model/restDatasource';
import { GroupDetailComponent } from './view/groupDetails.component';
import { ShowGroupsComponent } from './view/showGroups.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { ViewModule } from './view/view.module';
import { LoginComponent } from './view/login.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from './environment/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { GroupRepositroy } from './model/group.repository';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { AddExpenseComponent } from './view/addExpense.component';
import { AddUserComponent } from './view/addUser.component';
import { CreateGroupComponent } from './view/createGroups.component';
@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    ViewModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),

    RouterModule.forRoot([
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'create-group',
        component: CreateGroupComponent,
      },
      {
        path: 'group-details',
        component: GroupDetailComponent,
      },
      {
        path: 'group-details/:id',
        component: GroupDetailComponent,
      },
      {
        path: 'group/:id/:name',
        component: ShowGroupsComponent,
      },
      {
        path: 'show-groups',
        component: ShowGroupsComponent,
      },
      {
        path: 'addExpense',
        component: AddExpenseComponent,
      },
      {
        path: 'group-details/:id/addUsers',
        component: AddUserComponent,
      },
      {
        path: 'addUsers',
        component: AddUserComponent,
      },
      {
        path: '**',
        redirectTo: '/login',
      },
    ]),
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent],
})
export class AppModule {}
