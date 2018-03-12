import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';

import { FlexibleTableHeader } from './flexible-table/flexible.table.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Flexible Table';

  pageInfo = {pageSize:8,currentPage:1,from:0,resetSize: true, contentSize: 0};

  usersHeader:FlexibleTableHeader[] = [
    {key: "id",value: "ID",present: true, dragable:true, sortable: true},  
	  {key: "name",value: "Name",present: true, dragable:true, sortable: true},  
	  {key: "username",value: "User Name",present: true, dragable:true, sortable: true},  
	  {key: "address.city",value: "City", present: true, dragable:true, sortable: true},  
	  {key: "company.name",value: "Company",present: true, dragable:true, sortable: true} 
  ];

  users: any[];
  
  events: string[] = [];

  constructor(private service: AppService) {

  }

  ngOnInit() {
    this.service.usersList().subscribe(
      (users) => {
        this.users = users.json();
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
