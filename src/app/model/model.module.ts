import { RestDataSource } from './restDatasource';
import { NgModule } from '@angular/core';

import { GroupRepositroy } from './group.repository';
import { UserRepository } from './user.repository';

@NgModule({
  providers: [GroupRepositroy, RestDataSource, UserRepository],
})
export class ModelModule {}
