// user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userId: string = '';
  private name: string | null = '';

  setUser(id: string, name: string | null): void {
    this.userId = id;
    this.name = name;
  }

  getUserId(): string {
    return this.userId;
  }

  getUserName(): string | null {
    return this.name;
  }

  clearUser(): void {
    this.userId = '';
    this.name = '';
  }
}
