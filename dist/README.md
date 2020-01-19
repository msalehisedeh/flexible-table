
# Welcome to Flexible table!

Have you ever looked for a simple way of flushing your data in a versatile table by passing in a few meta-data instructions just to get your data displayed the way you wanted with interactive components inside? AND how about adding graphics into the resulting table with some nifty formatting rules just by mapping your JSON data into table column headers! Ha? Say it again!! And all is done without writing much of any code!! On top of that, if you do not want to take time and write meta-data rules, FlexibleTable will generate the rules for you. You can feed any data to the table and see it tabulated!!

FlexibleTable and LockTable are Angular based code. LockTable will allow you to lock/unlock columns. Both tables are fully configurable with pagination and ability to re-order table columns through drag/drop operation.

**NOTE:** If your project still is angular 2, 4, or 5; please luck-down your version reference to flexible table to 1.7.1 version by removing ^ from the version dependency in your package json. Otherwise for Angular 6+, please use 1.7.2 version or higher.

**NOTE:** Starting with version 1.8.2 you need to import this library through @sedeh/flexible-table.

Please send your requests or comments through the link provided below:

[Live Demo](https://flexible-table.stackblitz.io)  | [Source code](https://github.com/msalehisedeh/flexible-table/tree/master/src/app) | [Comments/Requests](https://github.com/msalehisedeh/flexible-table/issues)

## Features
* Responsive
* map any part of your data to a column in the table
* Pagination enabled / disabled
* Indexing enabled / disabled
* Expand / Collapse rows
* Configure any column to sort content
* Configure any column to show / hide
* Configure any column to format content
* Configure any column to reorder by drag/drop
* Configure any column to filter content
* ADA Compliant

## Dependencies

```javascript
MODULE:
  FlexibleTableModule

EXPORTS:
  FlexibleTableComponent
  LockTableComponent

DEPENDENCIES: 
    "font-awesome": "^4.7.0",
    "@sedeh/drag-enabled": "^2.1.0",
    "@sedeh/into-pipes": "^2.3.10"
```
## How to do it?
It is very simple. You have a JSON data to display and you want to allow user to configure columns, plus having ability to paginate, and sort/drag specific columns.
All you will need is to add a header JSON and you are set to get the job done. That simple!!

Let's say you have the following data to be displayed:
```javascript
{
  "guid": "701134c1-82cd-4f24-a867-f896350643f9",
  "isActive": false,
  "balance": "$3,666.56",
  "picture": "https://image.flaticon.com/icons/png/128/701/701997.png",
  "age": 37,
  "eyeColor": "brown",
  "name": "Cecelia Hartman",
  "gender": "female",
  "company": "MOMENTIA",
  "email": "ceceliahartman@momentia.com",
  "phone": "+1 (937) 578-2156",
  "address": {
    "street": "548 Clymer Street",
    "suite": "Apt. 556",
    "city": "Loveland",
    "zipcode": "92998-3641"
  },
  "about": "Est voluptate ea occaecat officia excepteur anim ipsum. Ipsum aliquip pariatur.\r\n",
  "registered": "2016-09-03T07:03:48 +07:00",
  "latitude": -56.348654,
  "longitude": 52.767967,
  "tags": [
    "est",
    "id",
    "ut",
    "sint",
    "cillum",
    "minim",
    "commodo"
  ],
  "friends": [
    {
      "id": 0,
      "name": "Yang Barrera"
    },
    {
      "id": 1,
      "name": "Rosella Lane"
    },
    {
      "id": 2,
      "name": "Doyle Welch"
    }
  ],
  "greeting": "Hello, Cecelia Hartman! You have 5 unread messages.",
  "favoriteFruit": "banana"
}
```

And you want user ID, name, user-name, the city he/she lives in, and the company works for. All you need is to map your data as it follows:
```javascript
[
	  {key: "name",value: "Name",present: true, dragable:true, sortable: true},  
	  {key: "isActive",value: "Active",present: true, dragable:true, sortable: true, format: "if:~:true:\"font:fa fa-check:replace\":\"\""},
	  {key: "picture",value: "Picture",present: true, dragable:true, sortable: true, format: "image:auto:32px"},
	  {key: "address.city",value: "City", present: true, dragable:true, sortable: true},  
	  {key: "company",value: "Company",present: true, dragable:true, sortable: true} 
  ]
```
The above will instruct the table to make the mentioned columns visible and sortable.  You can hide anyone of them or disable sorting on any columns.  You can make them draggable or have the content of a cell formatted if you add a "format" attribute to the column meta-data you want to be formatted. 

For example: "format: 'date:MM/dd/yyyy'" or "format: 'currency'"

Now you need to set the **Pagination** data To something like:
```javascript
{
	pageSize:8,
	currentPage:1,
	from:0,
	resetSize: true,
	contentSize: 0
}
```

**AND** pagination data should re-evaluate contentSize immediately when data items are available
```javascript
	this.service.usersList().subscribe(
    	(users) => {
        	this.users = users.json();
        	this.pageInfo.contentSize = this.users.length;
    	}
    )
```

Now you need to set the table tag in your HTML content:
```javascript
<flexible-table 
      *ngIf="users" 
      caption="total records found {{users.length}}" 
      [headers]="usersHeader" 
      [items]="users" 
      [inlinePagination]="true"
      [pageInfo]="pageInfo"
      enableIndexing="true"
      actionable="true"
      configurable="true"
      [rowDetailer]="detailer"
      (onconfigurationchange)="onconfigurationchange($event)"
      (onaction)="onaction($event)"></flexible-table>

<ng-template #detailer let-detail="data">
  <div class="custom-class">
    <h3>Detail information about row {{detail.id}}</h3>
    <ol>
      <li>id: {{detail.id}}</li>
      <li>name: {{detail.name}}</li>
      <li>username: {{detail.username}}</li>
      <li>email: {{detail.email | into:'email'}}</li>
      <li>address: {{detail.address | into:'address'}}</li>
      <li>phone: {{detail.phone}}</li>
      <li>website: {{detail.website | into:'link'}}</li>
      <li>company: {{detail.company.name}}</li>
    </ol>
  </div>
</ng-template>
```

You will also need to implement a few functions

```javascript
  allowExpanding(item, showIcon) {
    return (item.company || item.address); 
    // or any other way to determine if you can allow expanding of given item in a row
  }
  
  onaction(event) {
    // decide on what to do with the event
  }
  onconfigurationchange(event) {
    // decide on what to do with the event
  }
```

## Interfaces

```javascript
export interface FlexibleTableHeader {
	key: string,
	value: string,
	present: boolean,
	width?: string,
  minwidth?: string,
  hideOnPrint?: boolean,
	format?: string,
	filter?: string,
	dragable?: boolean,
	sortable?: boolean,
	class?:string,
	locked?:boolean
}
```

## Attributes (LockTableComponent)

* Expand / Collapse rows (will not happen for LockTableComponent. But is available on  FlexibleTableComponent)

## Formatting the table cell content.

We are using "@sedeh/into-pipes" library. to see available formatting options, please follow what is supported by the library.

### Attributes (FlexibleTableComponent)

| Attribute          |Status    |Description                                                                         |
|--------------------|----------|--------- --------------------------------------------------------------------------|
|caption             |Optional  |Caption to be displayed                                                             |
|action              |Optional  |off-screen message to be displayed if click on a row results in an action. If supplied, action column will be displayed and will take effect on user click |
|actionKeys          |Optional  |parameters to feed the action.  parameters should exist in headers mapping.            |
|tableClass          |Optional  |class name to be assigned to the table.                                             |
|headers             |Optional  |mapping of items to be displayed as headers including instructions on formatting, dragging, ...                               |
|items               |Required  |items to be displayed                                                               |
|pageInfo            |Optional  |pagination information. If is not supplied, pagination will not take place.         |
|tableInfo           |Optional  |Information about component owning the table. this information will be passed to the component that will display when a row is expanded. |
|inlinePagination    |Optional  |Flag to make pagination display as a sticky div or stay in a fixed location at the bottom right corner of table. |
|configurable        |Optional  |flag to allow hiding/displaying of specific headers.                                |
|enableIndexing      |Optional  |flag to display index of rows.                                                      |
|rowDetailer         |Optional  |reference to template that should be displayed when a row is expanded.              |
|expandable          |Optional  | in component that owns the table which determines in a specific row is expandable. This function is called twice with a flag argument. If flag is false, call is to determine if action icon should be displayed on row. otherwise is to give before expansion opportunity to the owner to perform possible operation before expansion on the table take effect. |
|expandIf            |Optional  |flag to override calling of expandable function.                                    |
|rowDetailerHeaders  |Optional  |If the expanding row should be displayed in another table inside, then this attribute will be passed to the expansion template. |
|configAddon         |Optional  |Template to include additional control items alongside print and configure actions. |


### Attributes (LockTableComponent)

| Attribute          |Status    |Description                                                                         |
|--------------------|----------|------------------------------------------------------------------------------------|
|caption             |Optional  |Caption to be displayed                                                             |
|action              |Optional  |off-screen message to be displayed if click on a row results in an action. If supplied, action column will be displayed and will take effect on user click |
|actionKeys          |Optional  |parameters to feed the action.  parameters should exist in headers mapping.         |
|tableClass          |Optional  |class name to be assigned to the table.                                             |
|headers             |Optional  |mapping of items to be displayed as headers including instructions on formatting, dragging, ... |
|items               |Required  |items to be displayed                                                               |
|pageInfo            |Optional  |pagination information. If is not supplied, pagination will not take place.         |
|inlinePagination    |Optional  |Flag to make pagination display as a sticky div or stay in a fixed location at the bottom right corner of table. |
|tableInfo           |Optional  |Information about component owning the table. this information will be passed to the component that will display when a row is expanded. |
|configurable        |Optional  |flag to allow hiding/displaying of specific headers.                                |
|enableIndexing      |Optional  |flag to display index of rows.                                                      |
|filterwhiletyping   |Optional  |flag to perform filtering while typing in a filter field. If not set will filter only on a hit return after typing. |
|configAddon         |Optional  |Template to include additional control items alongside print and configute actions.  |


## Metadata Rules

| Metadata             |status    |Description                                                                       |
|----------------------|----------|----------------------------------------------------------------------------------|
|key                   |Required  |JSON path to the value to be displayed on a column.                               |
|value                 |Required  |Title of the column on the table.                                                 |
|present               |Optional  |Display the column if set. Hide it otherwise.                                     |
|width                 |Optional  |Column width.                                                                     |
|minwidth              |Optional  |Minimum column with.                                                              |
|format                |Optional  |How the cell should be displayed. use into-pipe components to make the cell interactive and editable. |
|filter                |Optional  |If undefined, no filtering. Otherwise show filter field for the column.           |
|dragable              |Optional  |Should column position be reorganized through drag and drop action?               |
|sortable              |Optional  |Should the column be sortable?                                                    |
|class                 |Optional  |Apply the class to the column.                                                    |
|locked                |Optional  |In a lock table, should the column be locked out.                                 |
|hideOnPrint           |Optional  |Should the column be displayed when prinitinf.                                    |


## Events
| Event                |Description                                                                                  |
|----------------------|---------------------------------------------------------------------------------------------|
|onaction              |Will be published on a click action of a row                                                 |
|onfilter              |Will be published on when user types in something in filter fields to reduce table rows.     |
|onCellContentEdit     |Will be published when content of an editable cell is modified                               |
|onconfigurationchange |Will be called when user selects to hide/un-hide some of headers on configuration pop-up     |

## Filtering rules

| Operand  | Example      | Description                                                                              |
|----------|--------------|------------------------------------------------------------------------------------------|
| <        | <5           | Perform less than operation                                                              |
| >        | >5           | Perform greater than operation                                                           |
| !        | !5           | Perform not equal operation                                                              |
| =        | =5           | Perform equal to operation                                                               |
| *        | *Name        | Perform Ends with operation                                                              |
| *        | Name*        | Perform Starts with operation                                                            |
| *        | * Name*      | Perform contains with operation                                                          |
|          | Name         | Same as contains with operation                                                          |


## Adding custom pipe component to create interactive cell items

```javascript
import { Component, EventEmitter } from '@angular/core';
import { PipeComponent } from '@sedeh/into-pipes';

@Component({
    selector: 'link-component',
    template: `<a [href]="'http://somewhere.com/?id=' + data.userId" [target]="target" [textContent]="source"></a>`,
    styles: [
        `
        color: blue;
        `
    ]
})
export class CustomLinkComponent implements PipeComponent {
  source: string;
	id: string;
	data: any;
	name: string;
  title: string;
  target: string;
	onIntoComponentChange: EventEmitter<any>;

    transform(source: any, data: any, args: any[]) {
        this.data = data;
        this.source = source;
        this.target = (args && args.length) ? args[0] : "";
        this.title = (args && args.length > 1) ? args[1] : "";
    }
}
```

Then you need to register it
```javascript
import { ComponentPool } from '@sedeh/into-pipes';
...
constructor(private pool:ComponentPool){
  // you can also register this as "link" in which it will override default link component.
  this.pool.registerComponent("myLink",new CustomLinkComponent())
}
```
then you will need to use your formatter in header meta-data
```javascript
{key:'userName', value:'Name', present: true, format:'myLink'}
```

## Using tags
Sample table tag in your HTML content:

```javascript
<flexible-table 
      caption="total records found {{unknownJsonList.length}}" 
      enableFiltering="true"
      enableIndexing="true"
      persistenceId="usersRecordsTable"
      persistenceKey="users-headers-102018"
      configurable="true"
      filterwhiletyping="true"
      [inlinePagination]="true"
      [items]="unknownJsonList"
      [pageInfo]="pageInfo"
      (onfilter)="onfilter($event)"
      (onCellContentEdit)="onCellModified($event)"
      (onconfigurationchange)="onconfigurationchange($event)"
      (onaction)="onaction($event)"></flexible-table>

<lock-table 
      caption="total records found {{users.length}}" 
      action="View details of %name% where ID is %id%"
      actionKeys="%name%,%id%"
      [inlinePagination]="true"
      [headers]="usersHeader" 
      [items]="users" 
      [pageInfo]="pageInfo"
      enableIndexing="true"
      actionable="true"
      configurable="true"
      (onfilter)="onfilter($event)"
      (onconfigurationchange)="onconfigurationchange($event)"
      (onaction)="onaction($event)"></lock-table>
```

And the header meta-data will be:
```javascript
FlexibleTableHeader {
	key: string,       // JSON path to a value
	value: string,     // column textual representation of JSON attribute
	present: boolean,  // If the column should be displayed or not
	width?: string,    // column width
	format?: string,   // formatting instruction
	filter?: string,   // filter 
	dragable?: boolean,// should be dragged or accept a dragged column
	sortable?: boolean,// should sort
	class?:string,     // CSS class representing the column
	locked?:boolean    // If column is locked in a lock table.
}
```

## Revision History

| Version | Description                                                                                              |
|---------|----------------------------------------------------------------------------------------------------------|
| 2.0.1   | Fixed issue caused by upgarde to angular 8.                                                              |
| 2.0.0   | Updated to Angular 8.                                                                                    |
| 1.8.9   | Worked on table printing and improved mobile display. Added hideOnPrint option to have control over printing columns. |
| 1.8.8   | Updated dependencies.                                                                                    |
| 1.8.7   | Added fix for sorting if column is number, date, currency formatted.                                     |
| 1.8.6   | fixed sorting numbers if given as strings. fixed pagination to keep sorting order when paginating table. |
| 1.8.5   | made filtered event trigger after sort so the items sent would reflect the table row order.              |
| 1.8.4   | Added onfilter event if there is a need to update some other parts of application when list is filtered. |
| 1.8.3   | fixed display issues. upgraded into-pipes library to benefit hover effects over interactive cells.       |
| 1.8.2   | Updated dependencies.                                                                                    |
| 1.8.0   | It was brought to my attention that some users have trouble using my components in their angular 6 environment. Since I had only updated few dependencies when moved to Angular 6, I am thinking dependencies are causing issues. So, for this release, I am updating all dependencies to what Angular 6 applications are expecting to have. Please let me know if this is fixing or not fixing any issues you are facing. |
| 1.7.3   | Fixed problem with table. When pagination is not given to the table, an undefined exception was occurring. |
| 1.7.2   | rolling to angular 6+ after fixing the dependency issue.                                                 |
| 1.7.1   | Temporary roll-back to angular 5. I forgot to luck-down the dependencies for angular 5 before upgrading to angular 6. this will cause problem if you are still using angular 5.   |
| 1.7.0   | Updated libraries to become compatible with Angular 6+.                                                  |
| 1.6.0   | Fixed issue with filtering while using operational characters. If allowing filter while typing and if type an operation character like "*", "!","=","<", ">" we do not want to filter any row out of tabulating data.  Also, modified printing mechanism to print only the current page. In case of 4000 records in a table, we definitely do not want to print all rows to avoid performance degradation.   |
| 1.5.6   | Made performance improvement for filtering. If there are more than 1000 records and you have set the filterWhileTyping, then there could be performance issues. As a result, removed case insensitivity to perform better. Also, introduced delay filtering for those who type fast!! |
| 1.5.5   | Made performance improvements. Upgraded into-pipes version.                                              |
| 1.5.2   | Upgraded into-pipes version.                                                                             |
| 1.5.1   | Provided **configAddon** attribute to include additional control items along side the print and configuration buttons.  Consider a situation where you want to have a add row to a table inside a table expandable row. in such a case you would want to place the buttons in right place for each table. to make this happen, create a ng-template for the additional controls and pass a reference to it to the corresponding table thruogh **configAddon** attribute. For example, You can use the **configAddon** to give information about filtering operations and print policy or for any other reaon you see it fit. |
| 1.4.7   | Upgraded to latest version of into-pipes and introduced **onCellContentEdit** event which will be triggered when cell content is edited. To make a cell editable, use format attribute of header meta-data. Look at documentation of into-pipes to decide if you want to format a field into a text, a checkbox, a select drop-down or any other formats.  If you want to format a cell in a special way that is not supported by into-pipes, you will need to create a custom component and register. For example, lets say you want to display a link and the link href should point to somewhere with other parameters in the road. You would need to import **ComponentPool**, create your format component, and register it. You will then have to register it and use the registered component name as a format rule. When a cell content is edited, you will receive onCellContentEdit event where you will have opportunity to save the changed cell content in your data source.   |
| 1.4.6   | Added a flag for filtering lookup to filter while tying vs. filter after a hit return.                   |
| 1.4.5   | Compiled with AOT option and resolved issues.                                                            |
| 1.4.0   | Fixed few issues and added persistence to table configuration. As a result, if you enable persistence, you will need to give a version number through "persistenceKey". This is necessary for the persistence mechanism to decide if it has to take the stored data or override it because of difference in version number. "persistenceId" is necessary if you are using multiple persistent tables in your application. If persistence is enabled and you are not supplying headers meta-data and flexible table auto generates the headers for you, then auto generation will happen only once and future generations will be lost because persisted headers will override generation of new headers. If you are modifying the headers by adding, removing, or replacing header meta-data; then you have to change the "persistenceKey" as well. Also, an optional minwidth attribute is added to table headers meta-data. this can become handy if you are setting a width on some headers and not others. |
| 1.3.0   | Fixed few issues and added ability to print the content of flexible table.. Did not do the same for lock table as it is not an easy thing to do. If you are making a flexible table configurable, you will be able to see two icons side by side.. one for printing and the other for configuring display columns. |
| 1.2.0   | Flexible table is now getting more flexible... if you do not supply the headers meta-data, smart table will generate it for you. This will be a good way of flushing unknown JSON into the table and have it displayed. In addition, a filtering mechanism is added. If you enable filtering of a column, then you can filter rows based on what is typed in the filter for that columns. You will need to specifically add blank filter (filter: "") attribute in headers meta-data or enable filter for each header through configuration panel. If smart table is generating headers automatically, it will include filters attribute if filtering is enabled. When requesting to filter on a column, you have option of including the following operands: |
| 1.1.0   | With this release you will be able to make table cells editable / intractable.. For more information read into-pipes documentation. |
| 1.0.0   | Good news. With this release you will have access to lockable table!!                                    |
| 0.1.0   | This release is basically performance improvements and internal arrangement of components to make it possible to provide additional functionalities which will be released soon.  |
| 0.0.1   | Initial release.                                                                                         |


![alt text](https://raw.githubusercontent.com/msalehisedeh/flexible-table/master/sample.png  "What you would see when a flexible table is used")


![alt text](https://raw.githubusercontent.com/msalehisedeh/flexible-table/master/sample2.png  "What you would see when a flexible table is used")


### How to include font-awesome in your project?

In your project root folder, find and open the file 'angular-cli.json' in any editor 
Locate the styles[] array and add font-awesome references directory. like:

```javascript
"apps": 
	[
        {
            ....
            "styles": [
              "../node_modules/font-awesome/css/font-awesome.css"
              "styles.css"
            ],
            ...
        }
    ]
```