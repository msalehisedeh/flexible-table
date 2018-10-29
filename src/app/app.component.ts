import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Product Showcase';
  myPosition="top";
  myHoverOption = true;
  myPickOption = true;
  myTrackOption = true;
  myProductId="wer2435Quuyr";
  myItems=[
    {
      thumbnailId: "1", 
      title:"apron video", 
      type:'video',
      src: {
        egg: "https://theorganiccompany.dk/new/wp-content/uploads/2017/06/Long_Apron_The_Organic_Company_lowres.mp4",
        mp4: "https://theorganiccompany.dk/new/wp-content/uploads/2017/06/Long_Apron_The_Organic_Company_lowres.mp4",
        webm: "https://theorganiccompany.dk/new/wp-content/uploads/2017/06/Long_Apron_The_Organic_Company_lowres.mp4"
      }
    },
    {
      thumbnailId: "2", 
      title:"apron x", 
      type:'image',
      src: {
        small: "https://rlv.zcache.com/create_custom_personalized_bbq_barbecue_gardening_long_apron-r2ef3fadb6fc143078e4983d25bfa1f5d_v9wta_8byvr_140.jpg",
        medium: "https://rlv.zcache.com/create_custom_personalized_bbq_barbecue_gardening_long_apron-r2ef3fadb6fc143078e4983d25bfa1f5d_v9wta_8byvr_140.jpg", 
        large: "https://rlv.zcache.com/create_custom_personalized_bbq_barbecue_gardening_long_apron-r2ef3fadb6fc143078e4983d25bfa1f5d_v9wta_8byvr_140.jpg"
      }
    },
    {
      thumbnailId: "3", 
      title:"apron y", 
      type:'image',
      src: {
        small: "https://rlv.zcache.com/make_your_own_grill_master_bbq_apron_for_men_beige-r111e4e5082054a6b9c63753ad50ecc27_v9isa_8byvr_140.jpg",
        medium: "https://rlv.zcache.com/make_your_own_grill_master_bbq_apron_for_men_beige-r111e4e5082054a6b9c63753ad50ecc27_v9isa_8byvr_140.jpg",
        large: "https://rlv.zcache.com/make_your_own_grill_master_bbq_apron_for_men_beige-r111e4e5082054a6b9c63753ad50ecc27_v9isa_8byvr_140.jpg"
      }
    },
    {
      thumbnailId: "4", 
      title:"apron z", 
      type:'image',
      src:{
        small: "https://rlv.zcache.com/custom_personalized_arts_crafts_cooking_kitchen_kids_apron-ra9515ff7144148f491ae59924b0f019e_v9is8_8byvr_140.jpg",
        medium: "https://rlv.zcache.com/custom_personalized_arts_crafts_cooking_kitchen_kids_apron-ra9515ff7144148f491ae59924b0f019e_v9is8_8byvr_140.jpg",
        large: "https://rlv.zcache.com/custom_personalized_arts_crafts_cooking_kitchen_kids_apron-ra9515ff7144148f491ae59924b0f019e_v9is8_8byvr_140.jpg"
      }
    },
    {
      thumbnailId: "5", 
      title:"apron d", 
      type:'image',
      src: {
        small: "https://rlv.zcache.com/pink_cupcake_personalized_apron-rda3ab5911dd64079b6f500c8640f41b9_v9wh6_8byvr_140.jpg",
        medium: "https://rlv.zcache.com/pink_cupcake_personalized_apron-rda3ab5911dd64079b6f500c8640f41b9_v9wh6_8byvr_140.jpg",
        large: "https://rlv.zcache.com/pink_cupcake_personalized_apron-rda3ab5911dd64079b6f500c8640f41b9_v9wh6_8byvr_140.jpg"
      }
    },
    {
      thumbnailId: "6", 
      title:"apron e", 
      type:'image',
      src: {
        small: "https://rlv.zcache.com/pink_cupcake_personalized_apron-rda3ab5911dd64079b6f500c8640f41b9_v9wh6_8byvr_140.jpg",
        medium: "https://rlv.zcache.com/pink_cupcake_personalized_apron-rda3ab5911dd64079b6f500c8640f41b9_v9wh6_8byvr_140.jpg",
        large: "https://rlv.zcache.com/pink_cupcake_personalized_apron-rda3ab5911dd64079b6f500c8640f41b9_v9wh6_8byvr_140.jpg"
      }
    },
    {
      thumbnailId: "7", 
      title:"apron xd", 
      type:'image',
      src: {
        small: "https://rlv.zcache.com/pink_cupcake_personalized_apron-rda3ab5911dd64079b6f500c8640f41b9_v9wh6_8byvr_140.jpg",
        medium: "https://rlv.zcache.com/pink_cupcake_personalized_apron-rda3ab5911dd64079b6f500c8640f41b9_v9wh6_8byvr_140.jpg",
        large: "https://rlv.zcache.com/pink_cupcake_personalized_apron-rda3ab5911dd64079b6f500c8640f41b9_v9wh6_8byvr_140.jpg"
      }
    }
  ];
  events= [];
  
  constructor() {

  }
  
  onEventTracking(event) {
    this.events.push(event);
  }
}
