import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';

import { FlexibleTableHeader } from './flexible-table/components/table.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Flexible Table';

  pageInfo = {pageSize:8,currentPage:1,from:0,resetSize: true, contentSize: 0};

  usersHeader:FlexibleTableHeader[] = [
	  {key: "registered",value: "Registered On",present: true, dragable:true, sortable: true, format:"date:short"},  
	  {key: "name",value: "Name",present: true, dragable:true, sortable: true},  
	  {key: "isActive",value: "Active",present: true, dragable:true, sortable: true, format: "if:~=:true:\"font:fa fa-check:replace\":\"font:fa:replace\""},
	  {key: "picture",value: "Picture",present: true, dragable:true, sortable: true, format: "image:auto:14px"},
	  {key: "address.city",value: "City", present: true, dragable:true, sortable: true},  
	  {key: "company",value: "Company",present: true, dragable:true, sortable: true} 
  ];

  users: any[];
  
  events: string[] = [];

  constructor(private service: AppService) {

  }

  ngOnInit() {
    this.service.usersList().subscribe(
      (users) => {
        this.users = users;//.json();
        this.pageInfo.contentSize = this.users.length;
      }
    )
  }

  allowExpanding(item, showIcon) {
    return (item.company || item.address)
  }

  onaction(event) {
    this.events.push(event);
  }
  onconfigurationchange(event) {
    this.events.push(event);
  }

}
