import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { ComponentPool } from 'into-pipes';

import { FlexibleTableHeader } from './flexible-table/components/table.component'
import { SelectService } from './select.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Flexible Table';

  pageInfo = {pageSize:8,currentPage:1,from:0,resetSize: true, contentSize: 0};

  usersHeader:FlexibleTableHeader[] = [
	  {key: "registered",value: "Registered On",present: true, dragable:true, sortable: true, format:"calendar:short"},  
	  {key: "name",value: "Name",present: true, dragable:true, sortable: true, format: "input", filter: ""},  
	  {key: "age",value: "age",present: true, dragable:true, sortable: true, format: "input", filter: ""},  
	  {key: "isActive",value: "Active",present: true, dragable:true, sortable: true, format: "checkbox:true:true"},
	  {key: "picture",value: "Picture",present: true, dragable:true, sortable: true, format: "image:auto:14px"},
	  {key: "address.city",value: "City", present: true, dragable:true, sortable: true, format: "input", filter: ""},  
	  {key: "company",value: "Company",present: true, dragable:true, sortable: true, format: "select", filter: ""} 
  ];

  users: any[];
  
  events: string[] = [];

  constructor(private service: AppService, private pool: ComponentPool) {
    this.pool.registerServiceForComponent("select", new SelectService());
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

  onCellEdit(event) {
    this.events.push(event);
  }

  log(message) {
    console.log(message)
  }

}
