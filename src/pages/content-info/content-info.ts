import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
@Component({
  selector: 'page-content-info',
  templateUrl: 'content-info.html'
})
export class ContentInfoPage {
  section:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.section = navParams.get('info');        
  }
          

}
