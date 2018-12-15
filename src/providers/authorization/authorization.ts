import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthorizationProvider {

  constructor(public http: HttpClient) {

  }

  //public basepath = "http://192.168.15.6:3000/";
  //public basepath = "http://10.197.35.127:3000/";
public basepath = "http://192.168.15.8:3000/";
  
  public basic_header(){
    return {
      "Content-Type": "application/json",
      "access-token": window.localStorage.getItem("access-token"),
      "client": window.localStorage.getItem("client"),
      "uid": window.localStorage.getItem("uid")
    }
  };

  public set_headers(access_token, client, uid){
    if(this.verify_headers(access_token, client, uid)){
      window.localStorage.setItem("access-token", access_token);
      window.localStorage.setItem("client", client);
      window.localStorage.setItem("uid", uid);
    }
  }

  private verify_headers(access_token, client, uid) {
    if(access_token != null && client != null && uid != null){
      return true;
    }else{
      return false;
    }
  }
}
