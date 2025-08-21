import { Injectable } from '@angular/core';
import { GroupRepositroy } from '../model/group.repository';
import { Group } from '../model/group.model';

@Injectable({ providedIn: 'root' })
export class GroupDataeService {
  private groupsData: Group[] = [];
  constructor(private groupRepo: GroupRepositroy) {
    groupRepo.getGroups().subscribe((group) => {
      this.groupsData = group;
    });
  }

  deleteGroup(groupId?: string) {
    this.groupRepo.deleteGroup(groupId).subscribe((group) => {
      this.groupsData.splice(
        this.groupsData.findIndex((group) => {
          groupId == group.id;
        })
      );
    });
  }
}
