import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthModel} from './auth.model';
import {LoginModel} from './login.model';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {UserModel} from './user.model';


@Injectable({ providedIn: 'root' })
export class AuthService {
  url = 'http://localhost:3000/api/users';
  private token: string;
  isEmployee: boolean;
  isAdmin: boolean;
  private isAuthenticated = false;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  private employeeStatusListener = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer;
  private user: UserModel;
  private userSubject = new Subject<UserModel>();
  private adminStatusListener = new Subject<boolean>();


  constructor(private http: HttpClient, private router: Router) {
  }

  getToken() {
    return this.token;
  }

  updateUser(id: string, firstName: string, lastName: string, email: string) {

  }

  getUserById(id: string) {
    this.http.get<{user: UserModel}>('http://localhost:3000/api/users/' + id).subscribe(responseData => {
      // tslint:disable-next-line:max-line-length
         this.user = new UserModel(responseData.user._id, responseData.user.firstName, responseData.user.lastName, responseData.user.email);
         this.userSubject.next(this.user);
      });
  }

  getUserSubjectListener() {
   return this.userSubject.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getIsEmployeeStatusListener() {
    return this.employeeStatusListener.asObservable();
  }

  getIsAdminStatusListener() {
    return this.adminStatusListener.asObservable();
  }




  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  registerUser(email: string, password: string, firstName: string, lastName: string, birthday: Date, gender: string) {
    const authData: AuthModel = {email, password, firstName, lastName, birthday, gender};
    this.http.post(this.url + '/register', authData).
    subscribe(respData => {
      this.router.navigate(['/login']);
    });
  }
  private setAuthenticationData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }
  private  removeAuthenticationData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
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

  getFromBeIsEmployee() {
    this.http.get<{isEmployee: boolean, isAdmin: boolean}>('http://localhost:3000/api/users/isEmployee/' + localStorage.getItem('userId'))
      .subscribe((respData) => {
        localStorage.setItem('isEmployee', JSON.stringify(respData.isEmployee));
        localStorage.setItem('isAdmin', JSON.stringify(respData.isAdmin));
      });
  }

  login(email: string, password: string, isEmployee: boolean) {
    const loginData: LoginModel = {email, password, isEmployee};
    // tslint:disable-next-line:max-line-length
    this.http.post<{token: string, expiresIn: number, userId: string, isEmployee: boolean, isAdmin: boolean}>(this.url + '/login', loginData)
      .subscribe( respData => {
        this.token = respData.token;
        if (this.token) {
          this.userId = respData.userId;
          const expiresInDuration = respData.expiresIn;
          this.setAuthenticationTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.isEmployee = respData.isEmployee;
          this.isAdmin = respData.isAdmin;
          localStorage.setItem('isAdmin', JSON.stringify(respData.isAdmin));
          localStorage.setItem('isEmployee', JSON.stringify(respData.isEmployee));
          this.employeeStatusListener.next(this.isEmployee);
          this.adminStatusListener.next(this.isAdmin);
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate  = new Date(now.getTime() + expiresInDuration * 1000);
          this.setAuthenticationData(this.token, expirationDate);
          localStorage.setItem('userId', this.userId);
          if (this.isAdmin === true) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        }
      });
  }

  private setAuthenticationTimer(duration: number) {
    // Set time out functioneaza in milisecunde
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000) ;
  }
   autoAuthUser() {
    const authenticationInformation = this.getAuthenticationData();
    if (!authenticationInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authenticationInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.isEmployee = JSON.parse(localStorage.getItem('isEmployee'));
      this.isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
      this.token = authenticationInformation.token;
      this.isAuthenticated = true;
      this.setAuthenticationTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.isEmployee = false;
    this.isAdmin = false;
    localStorage.removeItem('userId');
    this.authStatusListener.next(false);
    localStorage.removeItem('isEmployee');
    localStorage.removeItem('isAdmin');
    clearTimeout(this.tokenTimer);
    this.removeAuthenticationData();
    this.router.navigate(['/']);
  }


}
