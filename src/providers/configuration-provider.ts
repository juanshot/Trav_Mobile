import { Injectable } from '@angular/core';
import {EnvConfigurationProvider} from "gl-ionic2-env-configuration";
import 'rxjs/add/operator/map';
@Injectable()
export class ConfigurationProvider {
  url:any;

  constructor(public envConfiguration: EnvConfigurationProvider<any>) {
    let config = envConfiguration.getConfig();
    this.url = config.api_url; 
  }

}
