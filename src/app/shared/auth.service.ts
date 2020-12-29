import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {from, Subject} from 'rxjs';
import { getUserRole } from 'src/app/utils/util';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {rejects} from 'assert';

export interface ISignInCredentials {
  email: string;
  password: string;
}

export interface ICreateCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface IPasswordReset {
  code: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  url = 'http://localhost:3000/api/users';
  private token: string;
  private isAuthenticated = false;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer;
  private user: ICreateCredentials = {email: '', password: '', displayName: ''};

  constructor(private auth: AngularFireAuth, private http: HttpClient, private router: Router) {}


  // tslint:disable-next-line:typedef
  signIn(credentials: ISignInCredentials) {
    return this.login(credentials.email, credentials.password)
      .then(({ user }) => {
        return user;
      });
  }

  // tslint:disable-next-line:typedef
  login(email: string, password: string) {
    const loginData: ISignInCredentials = {email, password};
    // tslint:disable-next-line:max-line-length
    return new Promise((resolve, reject) => {
      // tslint:disable-next-line:max-line-length
      this.http.post<{token: string, expiresIn: number, userId: string, fullName: string}>(this.url + '/login', loginData)
        .subscribe( respData => {
          this.token = respData.token;
          if (this.token) {
            this.userId = respData.userId;
            const expiresInDuration = respData.expiresIn;
            this.setAuthenticationTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate  = new Date(now.getTime() + expiresInDuration * 1000);
            this.setAuthenticationData(this.token, expirationDate);
            // localStorage.setItem('userId', this.userId);
            this.user.displayName = respData.fullName;
            this.user.email = email;
            resolve(this.user);
          }
          else {
            reject();
          }
        });
    });
  }

  private setAuthenticationData(token: string, expirationDate: Date): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private setAuthenticationTimer(duration: number): void {
    // Set time out functioneaza in milisecunde
    this.tokenTimer = setTimeout(() => {
    //  this.logout();
    }, duration * 1000) ;
  }
  // tslint:disable-next-line:typedef
  signOut() {
    this.logout();
    // DE MODIFICAT !!!!!!!
    return from(this.auth.signOut());
  }

  // tslint:disable-next-line:typedef
  register(credentials: ICreateCredentials) {
    return this.registerUser(credentials.email, credentials.password, credentials.displayName)
      .then(async ({ user }) => {
        return user;
      });
  }

  // tslint:disable-next-line:typedef
  sendPasswordEmail(email) {
    return this.auth.sendPasswordResetEmail(email).then(() => {
      return true;
    });
  }

  // tslint:disable-next-line:typedef
  resetPassword(credentials: IPasswordReset) {
    return this.auth
      .confirmPasswordReset(credentials.code, credentials.newPassword)
      .then((data) => {
        return data;
      });
  }

  // tslint:disable-next-line:typedef
  async getUser() {
    const u = await this.auth.currentUser;
    return { ...u, role: getUserRole() };
  }

  logout(): void {
    this.token = null;
    this.isAuthenticated = false;
    // localStorage.removeItem('userId');
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.removeAuthenticationData();
    this.router.navigate(['user/login']);
  }
  private  removeAuthenticationData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }


  // tslint:disable-next-line:typedef
  private getAuthenticationData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate)
    };
  }

  getToken(): string {
    return this.token;
  }

  autoAuthUser(): void {
    const authenticationInformation = this.getAuthenticationData();
    if (!authenticationInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authenticationInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authenticationInformation.token;
      this.isAuthenticated = true;
      this.setAuthenticationTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  // tslint:disable-next-line:typedef
  getIsAuth() {
    return this.isAuthenticated;
  }

  // tslint:disable-next-line:typedef
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  // tslint:disable-next-line:typedef
  registerUser(email: string, password: string, displayName: string) {
    const authData: ICreateCredentials = {email, password, displayName};
    return new Promise ((resolve, reject) => {
      this.http.post(this.url + '/register', authData).
      subscribe(respData => {
        // this.router.navigate(['/login']);
        this.user.email = email;
        this.user.password = password;
        this.user.displayName = displayName;
        resolve(this.user);
      });
    });
  }
}
