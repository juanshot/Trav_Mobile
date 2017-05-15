import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CountriesProvider {

  countries:any;
  constructor(public http: Http) {

  }


}
