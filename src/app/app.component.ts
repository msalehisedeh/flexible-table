import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { ComponentPool } from '@sedeh/into-pipes';

import { FlexibleTableHeader } from './flexible-table/components/table.component'
import { SelectService } from './select.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Flexible Table';

  userPageInfo = {pageSize:8,currentPage:1,from:0,resetSize: true, contentSize: 0};
  lockPageInfo = {pageSize:8,currentPage:1,from:0,resetSize: true, contentSize: 0};

  usersHeader:FlexibleTableHeader[] = [
	  {key: "registered",value: "Registered On",present: true, dragable:true, sortable: true, format:"calendar:short"},  
	  {key: "name",value: "Name",present: true, dragable:true, sortable: true, format: "input", filter: ""},  
	  {key: "age",value: "age",present: true, dragable:true, sortable: true, format: "input", filter: ""},  
	  {key: "isActive",value: "Active",present: true, dragable:true, sortable: true, format: "checkbox:true:true"},
	  {key: "picture",value: "Picture",present: true, dragable:true, sortable: true, format: "image:auto:14px", hideOnPrint: true},
	  {key: "address.city",value: "City", present: true, dragable:true, sortable: true, format: "input", filter: ""},  
	  {key: "company",value: "Company",present: true, dragable:true, sortable: true, format: "select", filter: ""} 
  ];
  lockHeader:FlexibleTableHeader[] = [
	  {key: "registered",value: "Registered On",present: true, dragable:true, sortable: true, format:"calendar:short"},  
	  {key: "name",value: "Name",present: true, dragable:true, sortable: true, format: "input", filter: ""},  
	  {key: "balance",value: "Balance",present: true, dragable:true, sortable: true, format: "currency", filter: ""},  
	  {key: "age",value: "age",present: true, dragable:true, sortable: true, format: "input", filter: ""},  
	  {key: "isActive",value: "Active",present: true, dragable:true, sortable: true, format: "checkbox:true:true"},
	  {key: "picture",value: "Picture",present: true, dragable:true, sortable: true, format: "image:auto:14px", hideOnPrint: true},
	  {key: "address.city",value: "City", present: true, dragable:true, sortable: true, format: "input", filter: ""},  
	  {key: "company",value: "Company",present: true, dragable:true, sortable: true, format: "select", filter: ""} 
  ];

  users: any[];
  lockUsers: any[];
  
  events: any[] = [];

  constructor(private service: AppService, private pool: ComponentPool) {
    this.pool.registerServiceForComponent("select", new SelectService());
  }

  ngOnInit() {
    this.service.usersList().subscribe(
      (users) => {
        this.users = users;//.json();
        this.lockUsers = JSON.parse(JSON.stringify(users));
        this.userPageInfo.contentSize = this.users.length;
        this.lockPageInfo.contentSize = this.lockUsers.length;
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

  onCellEdit(event) {
    this.events.push(event);
  }
  onfilter(event) {
    this.events.push({
      filtered: true,
      data: event
    });
  }
  log(message) {
    console.log(message)
  }

}
