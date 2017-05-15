import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import{ContentInfoPage} from '../content-info/content-info';

@Component({
  selector: 'page-section',
  templateUrl: 'section.html'
})
export class SectionPage {
  countryInfo:any;
  sections:any;
  sectionName:any;
  shownItem: any ="false";
  shownGroup = null;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.sections = navParams.get('sections');
        this.sectionName = navParams.get('sectionName');
        console.log(this.sections);
        
  }

  goToContent(info){

      this.navCtrl.push(ContentInfoPage,{info:info});
      
  }
   isItemShown (item) {
    return this.shownItem === item;
  };
  toggleGroup(group) {
        if (this.isGroupShown(group)) {
            this.shownGroup = null;
        } else {
            this.shownGroup = group;
        }
    };
    isGroupShown(group) {
        return this.shownGroup === group;
    };


}
