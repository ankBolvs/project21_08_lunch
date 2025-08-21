import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private displayNameSource = new BehaviorSubject<string | null>(null);
  displayName$ = this.displayNameSource.asObservable();

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((user) => {
      const name = user?.displayName || null;
      this.displayNameSource.next(name);
    });
  }

  async googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await this.afAuth.signInWithPopup(provider);
    const name = result.user?.displayName || null;
    this.displayNameSource.next(name);
    return result;
  }

  async signOut() {
    this.displayNameSource.next(null);
    return await this.afAuth.signOut();
  }

  getDisplayName(): string | null {
    return this.displayNameSource.getValue();
  }
}
