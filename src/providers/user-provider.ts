import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';
@Injectable()
export class UserProvider {

 public mobile_id:any;
 public  user:any;
 public registered = false;


  current_location ="";

  url_call:string = "";

  constructor(public http: Http, public storage:Storage,public platform:Platform) {


  }
  fillRegistration(id){
        let prefix;
        this.platform.is('ios')?prefix = 'apn':null;
        this.platform.is('android')?prefix = 'gcm':null;      
        this.mobile_id = prefix+id;
  }

  checkRegistration(){
           
  }
  setRegistration(){
        this.storage.set('registered',true);
  }
  setRegistrationInfo(user){
        this.storage.set('user',user);
        this.user = user;
  }
  


}
