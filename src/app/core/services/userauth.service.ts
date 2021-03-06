import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';


const httoption = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('Token')
  })
}
@Injectable({
  providedIn: 'root'
})
export class UserauthService {

  user: User;
  helper = new JwtHelperService();
  Token;


  url = "https://localhost:44377/Identity/register"
  url2 = "https://localhost:44377/Identity/login"
  url3 = "https://localhost:44377/Identity/addRole"
  url4 = "https://localhost:44377/Identity/allusers"
  url5 = "https://localhost:44377/Identity/getrolesofuser?Username="
  islogged: Boolean = false;
  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());
  @Output() fireIsLoggedIn: EventEmitter<any> = new EventEmitter<any>();
  isAuthenticated = false;
  constructor(private http: HttpClient, private route: Router) {


  }

  private hasToken(): boolean {
    if (this.loggedIn()) {
      return true
    }
    else return false
  }

  getallusers(): Observable<string[]> {
    return this.http.get<string[]>(this.url4)
  }

  postrole(data) {
    console.log(httoption)
    return this.http.post(this.url3, data, httoption)

  }
  signup(data) {
    return this.http.post<any>(this.url, data);
  }
  login(data) {
    return this.http.post<any>(this.url2, data);

  }
  getusername() {

    let token = localStorage.getItem("Token")
    let decode = this.helper.decodeToken(token)
    return decode.given_name


  }

  savelocal(username: any, res) {

    localStorage.setItem("username", username);
    this.Token = res.token
    localStorage.setItem("Token", res.token)
    let decode = this.helper.decodeToken(this.Token)
    let role = decode.role;
    let userid = decode.nameid
    localStorage.setItem("userid", userid)
    this.isLoginSubject.next(true);
    localStorage.setItem("Role", role)

  }
  // getallusers(): Observable<string[]> {
  //   return this.http

  // }
  isLoggedIn(): Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }

  loggedIn() {

    let token: any = localStorage.getItem('Token')
    let decodeToken = this.helper.decodeToken(token)

    if (this.helper.isTokenExpired(token)) {
      return false;
    }
    return true
  }
  logout() {
    localStorage.clear();
    this.isLoginSubject.next(false);
    this.route.navigate(['/login']).then(() => {
      window.location.reload();
    })
    console.clear();

  }
  Role() {
    let token: any = localStorage.getItem('Token')
    let decodeToken = this.helper.decodeToken(token)
    let role = decodeToken.role
    // var c = role.find(ele => ele == "Admin")
    var c = localStorage.getItem('username')

    if (c !== "Hichem") {
      return false;
    }

    else {
      return true
    }

  }
  getRolebyusername(username: any): Observable<string[]> {
    return this.http.get<string[]>(this.url5 + username);
  }
  deleteRole(username, rolename) {
    return this.http.delete('https://localhost:44377/Identity/DeleteuserRole?UserName=' + username + '&RoleName=' + rolename, { responseType: 'text' })
  }

  deletuser(id: any) {
    return this.http.delete('https://localhost:44377/Identity/Deleteuser?id=' + id, { responseType: 'text' })

  }
}