
# Welcome to Flexible table!

Have you ever wanted a simple way of flushing your data in a all versatile table and pass in a few metadata just to get your data displayed the way you wanted? AND how about adding graphics into the resulting table with some nifty formatting rules just by mapping your JSON data into table column headers! Ha? Say it again!!

FlexibleTable is an Angular based code. LockTable will allow you to lock/unlock columns. Both tables are fully configurable with pagination and ability to re-order table columns through drag/drop operation.

[Source code](https://github.com/msalehisedeh/flexible-table) | [Comments/Requests](https://github.com/msalehisedeh/flexible-table/issues)

# Version 1.2.0

flexible table is now getting more flexible... if you do not supply the headers metadata, smart table will generate it for you. This will be a good way of flushing unknown json into the table and have it displayed.
In addition, a filtering mechanism is added. If you enable filtering of a column, then you can filter rows based on what is typed in the filter for that columns. You will need to specifically add blank filter (filter: "") atteribute in headers metadata or enable filter for each header through configuration panel. If smart table is generating headers automatically, it will include filters attribute if filtering is enabled. When requesting to filter on a column, you have option of including the following operands:
| Operand  | Example      | Description                                 |
|----------|--------------|---------------------------------------------|
| <        | <5           | Perform less than operation                 |
| >        | >5           | Perform greater than operation              |
| !        | !5           | Perform not equal operation                 |
| =        | =5           | Perform equal to operation                  |
| *        | *Name        | Perform Ends with operation                 |
| *        | Name*        | Perform Starts with operation               |
| *        | \*Name\*     | Perform contains with operation             |
|          | Name         | Same as contains with operation             |


```javascript
<flexible-table 
      caption="total records found {{unknownJsonList.length}}" 
      enableFiltering="true"
      enableIndexing="true"
      configurable="true"
      [items]="unknownJsonList"
      [pageInfo]="pageInfo"
      (onconfigurationchange)="onconfigurationchange($event)"
      (onaction)="onaction($event)"></flexible-table>
```

And the header metadata will be:
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

# Version 1.1.0

With this release you will be able to make table cells editable / interactable.. For more information read into-pipes documentation.

```javascript
MODULE:
  FlexibleTableModule

EXPORTS:
  FlexibleTableComponent
  LockTableComponent

DEPENDENCIES: 
	"font-awesome": "^4.7.0",
	"drag-enabled": "^0.2.3",
	"into-pipes": "^1.2.2"
```

# Version 1.0.0

Good news. With this release you will have access to lockable table!!

```javascript
MODULE:
  FlexibleTableModule

EXPORTS:
  FlexibleTableComponent
  LockTableComponent

DEPENDENCIES: 
	"font-awesome": "^4.7.0",
	"drag-enabled": "^0.0.1",
	"into-pipes": "^0.3.1"
```

## Features Update
* Expand / Collapse rows (will not happen for LockTableComponent. But is available on  FlexibleTableComponent)

## Attributes (LockTableComponent)
| Attribute          |Description                                 |
|--------------------|--------------------------------------------|
|caption             |Caption to be displayed                     |
|action              |off-screen message to be displayed if click on a row results in an action. If supplied, action column will be displayed and will take effect on user click                   |
|actionKeys          |parameters to feed the action.  parameters should exist in headers mapping.            |
|tableClass          |class name to be assigned to the table.     |
|headers             |mapping of items to be displayed as headers including insturctions on formatting, dragging, ...                               |
|items               |items to be displayed                       |
|pageInfo            |pagination information. If is not supplied, paggination will not take place.            |
|tableInfo           |Information about component owning the table. this information will be passed to the component that will display when a row is expanded.                                |
|configurable        |flag to allow hidding/displaying of specific headers.                                    |
|enableIndexing      |flag to display index of rows.              |

## Events
| Event                |Description                                     |
|----------------------|------------------------------------------------|
|onaction              |Will be published on a click action of a row    |
|onconfigurationchange |Will be called when user selects to hide/unhide some of headers on configuration popup          |

Sample table tag in your HTML content:
```javascript
<lock-table 
      caption="total records found {{users.length}}" 
      action="View details of %name% where ID is %id%"
      actionKeys="%name%,%id%"
      [headers]="usersHeader" 
      [items]="users" 
      [pageInfo]="pageInfo"
      enableIndexing="true"
      actionable="true"
      configurable="true"
      (onconfigurationchange)="onconfigurationchange($event)"
      (onaction)="onaction($event)"></lock-table>
```

![alt text](https://raw.githubusercontent.com/msalehisedeh/flexible-table/master/sample2.png  "What you would see when a flexible table is used")

# Version 0.1.0

This release is basically performance improvements and internal arangement of components to make it possible to provide additional functionalities which will be released soon. 

```javascript
MODULE:
  FlexibleTableModule

DEPENDENCIES: 
	"font-awesome": "^4.7.0",
	"drag-enabled": "^0.0.1",
	"into-pipes": "^0.2.2"
```

# Version 0.0.1

The following are available functionalities presented in this version. 

```javascript
MODULE:
  FlexibleTableModule

DEPENDENCIES: 
	"font-awesome": "^4.7.0",
	"drag-enabled": "^0.0.1",
	"into-pipes": "^0.1.0"
```

## Formatting the table cell content.

We are using "into-pipes" library. to see available formatting options, please follow what is supported by the library.

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

## Attributes (FlexibleTableComponent)
| Attribute          |Description                                 |
|--------------------|--------------------------------------------|
|caption             |Caption to be displayed                     |
|action              |off-screen message to be displayed if click on a row results in an action. If supplied, action column will be displayed and will take effect on user click                   |
|actionKeys          |parameters to feed the action.  parameters should exist in headers mapping.            |
|tableClass          |class name to be assigned to the table.     |
|headers             |mapping of items to be displayed as headers including insturctions on formatting, dragging, ...                               |
|items               |items to be displayed                       |
|pageInfo            |pagination information. If is not supplied, paggination will not take place.            |
|tableInfo           |Information about component owning the table. this information will be passed to the component that will display when a row is expanded.                                |
|configurable        |flag to allow hidding/displaying of specific headers.                                    |
|enableIndexing      |flag to display index of rows.              |
|rowDetailer         |reference to template that should be displayed when a row is expanded.           |
|expandable          |function in component that owns the table which determines in a specific row is expandable. This function is called twice with a flag argument. If flag is false, call is to determine if action icon should be displayed on row. othwerwise is to give before expanssion opportunity to the owner to perform possible operation before expanssion on the table take effect.        |
|expandIf            |flag to override calling of expandable function.                                   |
|rowDetailerHeaders  |If the expanding row should be displayed in another table inside, then this attribute will be passed to the expanssion template.  |

## Events
| Event                |Description                                     |
|----------------------|------------------------------------------------|
|onaction              |Will be published on a click action of a row    |
|onconfigurationchange |Will be called when user selects to hide/unhide some of headers on configuration popup          |

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

And you want user ID, name, username, the city he/she lives in, and the company works for. All you need is to map your data as it follows:
```javascript
[
	  {key: "name",value: "Name",present: true, dragable:true, sortable: true},  
	  {key: "isActive",value: "Active",present: true, dragable:true, sortable: true, format: "if:~:true:\"font:fa fa-check:replace\":\"\""},
	  {key: "picture",value: "Picture",present: true, dragable:true, sortable: true, format: "image:auto:32px"},
	  {key: "address.city",value: "City", present: true, dragable:true, sortable: true},  
	  {key: "company",value: "Company",present: true, dragable:true, sortable: true} 
  ]
```
The above will instruct the table to make the mentioned columns visible and sortable.  You can hide anyone of them or disable sorting on any columns.  You can make them draggable or have the content of a cell formatted if you add a "format" attribute to the column metadata you want to be formatted. 

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
    // decide on what to do with the evet
  }
  onconfigurationchange(event) {
    // decide on what to do with the evet
  }
```

![alt text](https://raw.githubusercontent.com/msalehisedeh/flexible-table/master/sample.png  "What you would see when a flexible table is used")

