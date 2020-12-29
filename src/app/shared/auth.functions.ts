// import {Injectable} from '@angular/core';
// import {HttpClient} from '@angular/common/http';
// import {Observable, Subject} from 'rxjs';
// import {Router} from '@angular/router';
// import {ICreateCredentials, ISignInCredentials} from './auth.service';
//
// @Injectable({ providedIn: 'root' })
// export class AuthFunctions {
//   url = 'http://localhost:3000/api/users';
//   private token: string;
//   private isAuthenticated = false;
//   private userId: string;
//   private authStatusListener = new Subject<boolean>();
//   private tokenTimer: NodeJS.Timer;
//   private user: ICreateCredentials;
//   private userSubject = new Subject<ICreateCredentials>();
//
//
//   constructor(private http: HttpClient, private router: Router) {
//   }
//
//   getToken(): string {
//     return this.token;
//   }
//
//   // tslint:disable-next-line:typedef
//   getUserById(id: string) {
//     const promise = new Promise((resolve, reject) => {
//       setTimeout(() => {
//         this.http.get<{ user: ICreateCredentials }>('http://localhost:3000/api/users/' + id).subscribe(responseData => {
//           // tslint:disable-next-line:max-line-length
//           this.user.email = responseData.user.email;
//           this.user.displayName = responseData.user.displayName;
//          // responseData.user._id, responseData.user.fullName, responseData.user.email);
//           this.userSubject.next(this.user);
//         });
//       });
//     });
//     return promise;
//   }
//
//   getUserSubjectListener(): Observable<UserModel> {
//     return this.userSubject.asObservable();
//   }
//
//   getIsAuth() {
//     return this.isAuthenticated;
//   }
//
//   getIsEmployeeStatusListener() {
//     return this.employeeStatusListener.asObservable();
//   }
//
//   getIsAdminStatusListener() {
//     return this.adminStatusListener.asObservable();
//   }
//
//
//   private setAuthenticationData(token: string, expirationDate: Date) {
//     localStorage.setItem('token', token);
//     localStorage.setItem('expiration', expirationDate.toISOString());
//   }
//
//   private getAuthenticationData() {
//     const token = localStorage.getItem('token');
//     const expirationDate = localStorage.getItem('expiration');
//     if (!token || !expirationDate) {
//       return;
//     }
//     return {
//       token,
//       expirationDate: new Date(expirationDate)
//     };
//   }
//
//
//   // tslint:disable-next-line:typedef
//   login(email: string, password: string) {
//     const loginData: ISignInCredentials = {email, password};
//     // tslint:disable-next-line:max-line-length
//     this.http.post<{token: string, expiresIn: number, userId: string, isEmployee: boolean, isAdmin: boolean}>(this.url + '/login', loginData)
//       .subscribe( respData => {
//         this.token = respData.token;
//         if (this.token) {
//           this.userId = respData.userId;
//           const expiresInDuration = respData.expiresIn;
//           this.setAuthenticationTimer(expiresInDuration);
//           this.isAuthenticated = true;
//           localStorage.setItem('isAdmin', JSON.stringify(respData.isAdmin));
//           localStorage.setItem('isEmployee', JSON.stringify(respData.isEmployee));
//           this.authStatusListener.next(true);
//           const now = new Date();
//           const expirationDate  = new Date(now.getTime() + expiresInDuration * 1000);
//           this.setAuthenticationData(this.token, expirationDate);
//           localStorage.setItem('userId', this.userId);
//         }
//       });
//   }
//
//   private setAuthenticationTimer(duration: number) {
//     // Set time out functioneaza in milisecunde
//     this.tokenTimer = setTimeout(() => {
//       this.logout();
//     }, duration * 1000) ;
//   }
//   autoAuthUser() {
//     const authenticationInformation = this.getAuthenticationData();
//     if (!authenticationInformation) {
//       return;
//     }
//     const now = new Date();
//     const expiresIn = authenticationInformation.expirationDate.getTime() - now.getTime();
//     if (expiresIn > 0) {
//       this.token = authenticationInformation.token;
//       this.isAuthenticated = true;
//       this.setAuthenticationTimer(expiresIn / 1000);
//       this.authStatusListener.next(true);
//     }
//   }
//
//
//
// }
