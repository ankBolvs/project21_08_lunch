import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupRepositroy } from '../model/group.repository';
import { Group } from '../model/group.model';
import { User } from '../model/user.model';
import { Expense } from '../model/expense.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'group-details',
  templateUrl: 'groupDetails.component.html',
  styleUrl: 'groupDetails.component.css',
})
export class GroupDetailComponent implements OnInit {
  group?: Group;
  groupId!: string;
  groupMembers: User[] = [];
  balances: { [userId: string]: number } = {};
  currentUserId: string = '';
  groupMembersData?: User[];

  constructor(
    private groupRepo: GroupRepositroy,
    private activeRoute: ActivatedRoute,
    private userService: UserService
  ) {
    this.groupId = activeRoute.snapshot.params['id'];
    this.currentUserId = this.userService.getUserId(); // ✅ logged-in user
  }

  ngOnInit(): void {
    this.group = this.groupRepo.getGroup(this.groupId);

    if (this.group?.members) {
      this.groupMembers = this.groupRepo.getGroupUsersData(this.groupId);

      // Initialize balances
      this.groupMembers.forEach((m) => (this.balances[m.user_id!] = 0));

      // Fetch expenses for this group
      this.groupRepo
        .getGroupExpenses(this.groupId)
        .subscribe((expenses: Expense[]) => {
          this.calculateBalances(expenses);
        });
    }
  }

  private calculateBalances(expenses: Expense[]) {
    // Reset (important if this method can run more than once)
    Object.keys(this.balances).forEach((id) => (this.balances[id] = 0));

    expenses.forEach((exp) => {
      const amount = Number(exp.amount) || 0;
      const participants = exp.users ?? [];
      if (amount <= 0 || participants.length === 0) return;

      const share = amount / participants.length;

      // 1) Every participant owes their equal share
      participants.forEach((u) => {
        if (this.balances[u] === undefined) this.balances[u] = 0;
        this.balances[u] -= share;
      });

      // 2) The payer is credited the FULL amount they paid
      if (exp.paid_by) {
        if (this.balances[exp.paid_by] === undefined)
          this.balances[exp.paid_by] = 0;
        this.balances[exp.paid_by] += amount;
      }
    });

    // Round to 2 decimals
    Object.keys(this.balances).forEach(
      (id) => (this.balances[id] = Math.round(this.balances[id] * 100) / 100)
    );
  }

  // get groupDetail(): Group | undefined {
  //   return this.group;
  // }
  get groupDetail(): Group | undefined {
    this.group = this.groupRepo.getGroup(this.groupId);

    return this.group;
  }

  get getGroupUsersData() {
    this.groupMembersData = this.groupRepo.getGroupUsersData(this.groupId);
    return this.groupMembersData;
  }

  // ✅ Only members except current user
  get otherMembers(): User[] {
    return this.groupMembers.filter((m) => m.user_id !== this.currentUserId);
  }
}
