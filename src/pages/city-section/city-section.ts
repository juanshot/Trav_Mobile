import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the CitySection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-city-section',
  templateUrl: 'city-section.html'
})
export class CitySectionPage {
  section:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.section = navParams.get('sections');
    console.log(this.section);
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CitySectionPage');
  }

}
