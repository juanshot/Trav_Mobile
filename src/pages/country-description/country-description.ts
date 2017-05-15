import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
@Component({
  selector: 'page-country-description',
  templateUrl: 'country-description.html'
})
export class CountryDescriptionPage {

  showAlerts:boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CountryDescriptionPage');
  }
  changeAlertsViews(){
    if(this.showAlerts == true){
          this.showAlerts = false;
    }else{
        this.showAlerts = true;
    }
  }

}
