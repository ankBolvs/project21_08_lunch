import { Injectable } from '@angular/core';
import { RestDataSource } from './restDatasource';
import { User } from './user.model';
import { Group } from './group.model';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable()
export class GroupRepositroy {
  private usersData: User[] = [];
  public groupSubject = new BehaviorSubject<any>(null);
  // ✅ Instead of plain array, use BehaviorSubject
  private groupsData$ = new BehaviorSubject<Group[]>([]);

  constructor(private res: RestDataSource) {
    // Load initial users
    res.getUsers().subscribe((data) => (this.usersData = data));

    // Load initial groups into BehaviorSubject
    this.loadGroups().subscribe();
  }

  /** 🔹 Observable for components to subscribe */
  get groups$(): Observable<Group[]> {
    return this.groupsData$.asObservable();
  }

  /** 🔹 Load groups from backend and update BehaviorSubject */
  loadGroups(): Observable<Group[]> {
    return this.res
      .getGroups()
      .pipe(tap((groups) => this.groupsData$.next(groups)));
  }

  /** 🔹 Add a new group and emit updated list */
  addGroup(group: Group): Observable<Group> {
    const currentGroups = this.groupsData$.getValue();
    const lastGroup = currentGroups[currentGroups.length - 1];
    const lastId = lastGroup ? parseInt(lastGroup.group_id || '100', 10) : 100;

    group.group_id = (lastId + 1).toString();
    group.id = group.group_id;

    return this.res.addGroup(group).pipe(
      tap((newGroup) => {
        this.groupsData$.next([...currentGroups, newGroup]);
      })
    );
  }

  /** 🔹 Get user groups dynamically from BehaviorSubject */
  getUserGroups(userId: string): Group[] {
    const user = this.getUser(userId);
    const allGroups = this.groupsData$.getValue();

    if (!user || !user.userGroups) return [];
    return user.userGroups
      .map((groupId) => allGroups.find((g) => g.group_id === groupId))
      .filter((g): g is Group => g !== undefined);
  }

  getUser(userId: string) {
    return this.usersData.find((userData) => userData.user_id == userId);
  }

  getGroup(groupId: string): Group | undefined {
    return this.groupsData$.getValue().find((g) => g.group_id == groupId);
  }

  getGroupUsersData(groupid: string): User[] {
    const group = this.getGroup(groupid);
    if (!group || !group.members) return [];

    return group.members
      .map((userId) => this.usersData.find((u) => u.user_id === userId))
      .filter((u): u is User => u !== undefined);
  }
  getGroupExpenses(groupId: string) {
    return this.res.getExpensesByGroup(Number(groupId));
  }
  async updateGroup(groupId: string, updatedGroup: Group): Promise<void> {
    try {
      const updated = await this.res.updateGroup(groupId, updatedGroup);
      this.groupSubject.next(updated); // Emit updated group
      console.log('Update successful');
    } catch (error) {
      console.error('Update failed', error);
    }
  }
  getGroups(): Observable<any[]> {
    return this.res.getGroups();
  }
  deleteGroup(groupId?: string): Observable<any> {
    return this.res.deleteGroup(groupId);
  }
}
