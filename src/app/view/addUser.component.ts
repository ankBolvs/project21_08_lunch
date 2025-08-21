// import { Component } from '@angular/core';
// import { UserRepository } from '../model/user.repository';
// import { User } from '../model/user.model';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'addUsers',
//   templateUrl: 'addUser.component.html',
//   styleUrl: 'addUser.component.css',
// })
// export class AddUserComponent {
//   searchEmail: string = '';
//   members: User[] = [];
//   filteredMembers: User[] = [];
//   selectedMembers: User[] = [];

//   constructor(private userRepo: UserRepository, private router: Router) {
//     // Load all users from the repository
//     this.members = this.userRepo.getUsers();
//     this.filteredMembers = [...this.members]; // Initially show all users
//   }

//   // Filter members based on search input
//   filterMembers(): void {
//     const term = this.searchEmail.toLowerCase();
//     this.filteredMembers = this.members.filter((member) =>
//       member.email?.toLowerCase().includes(term)
//     );
//   }

//   // Add member to selected list if not already added
//   addToSelected(member: User): void {
//     const alreadySelected = this.selectedMembers.some(
//       (m) => m.email === member.email
//     );
//     if (!alreadySelected) {
//       this.selectedMembers.push(member);
//     }
//   }

//   // Confirm selection and navigate to group details
//   confirmSelection(): void {
//     this.router.navigate(['/group-details', '102']); // Replace '102' with dynamic group ID if needed
//   }
// }
import { Component } from '@angular/core';
import { GroupRepositroy } from '../model/group.repository';
import { UserRepository } from '../model/user.repository';
import { User } from '../model/user.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'addUsers',
  templateUrl: 'addUser.component.html',
})
export class AddUserComponent {
  searchEmail: string = '';
  members: User[] = []; // Full list of members
  filteredMembers: any[] = [];
  selectedMembers: User[] = [];
  groupId: any;
  constructor(
    private userRepo: UserRepository,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private groupRepo: GroupRepositroy
  ) {
    this.members = this.userRepo.getUsers();
    console.log(this.members);

    this.filteredMembers = this.members;
    this.groupId = activatedRoute.snapshot.params['id'];
  }

  // get getUsers() {
  //   this.members = this.userRepo.getUsers;
  //   console.log(this.members);

  //   this.filteredMembers = this.members;

  //   return this.members;
  // }

  filterMembers() {
    const term = this.searchEmail.toLowerCase();
    this.filteredMembers = this.members.filter((member) =>
      member.email?.toLowerCase().includes(term)
    );
  }

  addToSelected(member: User) {
    if (!this.selectedMembers.find((m) => m.email === member.email)) {
      this.selectedMembers.push(member);
    }
  }

  async confirmSelection() {
    const selectedIds = this.selectedMembers.map((member) => member.user_id);

    try {
      // 1. Fetch current group data
      const group = await this.groupRepo.getGroup(this.groupId);
      console.log(group);

      // // 2. Update members

      if (!group) {
        // Handle error or show message
        return;
      }

      const existingIds = group.members ?? [];

      // Filter out IDs that are already in the group
      const newIds = (selectedIds ?? []).filter(
        (id): id is string =>
          typeof id === 'string' && !existingIds.includes(id)
      );

      const updatedGroup = {
        ...group,
        members: [...existingIds, ...newIds],
      };

      console.log(updatedGroup);

      // 4. Update group in the repository
      await this.groupRepo.updateGroup(this.groupId, updatedGroup);

      // 2. Update each user's userGroups
      for (const userId of newIds) {
        const user = await this.groupRepo.getUser(userId);
        if (user) {
          const updatedUser = {
            ...user,
            userGroups: [
              ...new Set([...(user.userGroups ?? []), this.groupId]),
            ],
          };
          await this.userRepo.updateUser(userId, updatedUser);
        }
      }

      this.router.navigate(['/group-details', this.groupId]);
    } catch (error) {
      console.error('Error updating group:', error);
    }
  }
}
