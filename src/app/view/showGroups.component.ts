import { Component, OnInit } from '@angular/core';
import { GroupRepositroy } from '../model/group.repository';
import { UserService } from '../services/user.service';
import { Group } from '../model/group.model';

@Component({
  selector: 'show-Group',
  templateUrl: 'showGroups.component.html',
  styleUrl: 'showGroups.component.css',
})
export class ShowGroupsComponent implements OnInit {
  userName?: string | null;
  id: string;
  userGroups: Group[] = [];

  constructor(private groupRepo: GroupRepositroy, private userDetails: UserService) {
    this.id = userDetails.getUserId();
    this.userName = userDetails.getUserName();
  }

  ngOnInit(): void {
    // ✅ Subscribe to BehaviorSubject for live updates
    this.groupRepo.groups$.subscribe((groups) => {
      this.userGroups = groups.filter((group) =>
        this.userDetails.getUserId()
          ? group.members?.includes(this.id)
          : false
      );
    });

    // ✅ Ensure initial load
    this.groupRepo.loadGroups().subscribe();
  }

  get groups(): Group[] {
    return this.userGroups;
  }
}
