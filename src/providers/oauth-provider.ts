import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { ConfigurationProvider } from './configuration-provider';
@Injectable()
export class OauthProvider {
  isAuthenticated:boolean = false;
  userId;
  access_token;
  user= {
      username:'TDSUser',
      password :'testUser'
  }

  constructor(public http: Http,public config:ConfigurationProvider) {

      this.getToken().then(result=>{
          this.access_token = result.access_token;
          
          
      })

  }

getToken() {

    let headers = new Headers({
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
                "Authorization": "Basic " + btoa(this.user.username+ ':' +this.user.password)
            });

        let options = new RequestOptions({ headers: headers });
        

        let client =  "grant_type=client_credentials";

        return this.http.post(this.config.url+"oauth/token", client, options)
                .toPromise()
                .then(response =>{ return response.json() }, this.handleError )
                .catch(this.handleError);
    


  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); 
    return Promise.reject(error.message || error);
  }


}