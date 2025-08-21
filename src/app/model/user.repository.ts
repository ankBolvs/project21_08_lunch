import { Injectable } from '@angular/core';
import { RestDataSource } from './restDatasource';
import { User } from './user.model';
import { Group } from './group.model';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable()
export class UserRepository {
  private usersData: User[] = [];
  private loaded = false;
  private userSubject = new BehaviorSubject<any>(null);
  constructor(private res: RestDataSource) {}
  private user: User = new User();
  loadUsers() {
    this.loaded = true;
    this.res.getUsers().subscribe((users) => (this.usersData = users));
  }

  getUsers(): User[] {
    if (!this.loaded) {
      this.loadUsers();
    }

    return this.usersData;
  }

  getUser(userId: string): Observable<User> {
    console.log('id searched:' + userId);
    return this.res.getUser(userId).pipe(
      map((result: any[]) => {
        if (result && result.length > 0) {
          return result[0]; // Return the first matching user
        } else {
          throw new Error('No user found with user_id: ' + userId);
        }
      })
    );
  }
  updateUserGroups(user: User): Observable<any> {
    return this.res.updateUserByUserId(user);
  }
  updateUser(userId: string, updatedUser: User) {
    return this.res.updateUser(userId, updatedUser).then((updated) => {
      this.userSubject.next(updated); // Emit updated user
      return updated;
    });
  }
}
