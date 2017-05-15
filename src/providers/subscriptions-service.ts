import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { EndPoint } from './end-point';
import { ConfigurationProvider } from './configuration-provider';
import { UserProvider } from './user-provider';

@Injectable()
export class SubscriptionsService {
  tdApi;
  subscriptions
  constructor(public http: Http,public config:ConfigurationProvider,public user:UserProvider) {
    this.tdApi = config.url;
  }

  fillSubscriptions(userId:string,accountId:string,token){


      return this.http.get(this.tdApi+'subscribe?query=%7B%22type%22:%22subs%22,%22user_id%22:%22'+userId+'%22,%22account_id%22:%22'+accountId+'%22%7D&access_token='+token.access_token)

      .toPromise()
      .then(response =>{ return response.json();;
       } )
      .catch(this.handleError);
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); 
    return Promise.reject(error.message || error);
  }

}
