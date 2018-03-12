
# Welcome to Flexible table!

Have you ever wanted a simple way of flushing your data in a all versatile table and pass in a few metadata 
just to get your data displayed the way you wanted?


# Version 0.0.1

The following are available functionalities presented in this version. 

```
DEPENDENCIES: 
	"font-awesome": "^4.7.0",
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
* Conditional row highlight
* Conditional row select
* Conditional Column highlight
* Conditional Column select
* Configure any column to sort content
* Configure any column to show / hide
* Configure any column to format content
* Configure any column to reorder by drag/drop
* Configure any column to filter content

## Attributes
| Attribute          |Description                                 |
|--------------------|--------------------------------------------|
|caption             |Caption to be displayed                     |
|action              |off-screen message to be displayed if click on a row results in an action. If supplied, action column will be displayed and will take effect on user click                   |
|actionKeys          |parameters to feed the action.  parameters should exist in headers mapping.            |
|tableClass          |class name to be assigned to the table.     |
|headers             |mapping of items to be displayed as headers including instructions on formatting, dragging, ...                               |
|items               |items to be displayed                       |
|pageInfo            |pagination information. If is not supplied, pagination will not take place.            |
|tableInfo           |Information about component owning the table. this information will be passed to the component that will display when a row is expanded.                                |
|configurable        |flag to allow hiding/displaying of specific headers.                                    |
|enableIndexing      |flag to display index of rows.              |
|rowDetailer         |reference to template that should be displayed when a row is expanded.           |
|expandable          |function in component that owns the table which determines in a specific row is expandable. This function is called twice with a flag argument. If flag is false, call is to determine if action icon should be displayed on row. otherwise is to give before expansion opportunity to the owner to perform possible operation before expansion on the table take effect.        |
|expandIf            |flag to override calling of expandable function.                                   |
|rowDetailerHeaders  |If the expanding row should be displayed in another table inside, then this attribute will be passed to the expansion template.  |

## Events
| Event                |Description                                     |
|----------------------|------------------------------------------------|
|onaction              |Will be published on a click action of a row    |
|onconfigurationchange |Will be called when user selects to hide/display some of headers on configuration pop-up          |

## How to do it?
It is very simple. You have a JSON data to display and you want to allow user to configure columns, plus having ability to paginate, and sort/drag specific columns.
All you will need is to add a header JSON and you are set to get the job done. That simple!!

Let's say you have the following data to be displayed:
```
{
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
      "street": "Kulas Light",
      "suite": "Apt. 556",
      "city": "Gwenborough",
      "zipcode": "92998-3874",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
      }
    },
    "phone": "1-770-736-8031 x56442",
    "website": "hildegard.org",
    "company": {
      "name": "Romaguera-Crona",
      "catchPhrase": "Multi-layered client-server neural-net",
      "bs": "harness real-time e-markets"
    }
}
```

And you want user ID, name, username, the city he/she lives in, and the company works for. All you need is to map your data as it follows:
```
[
    {key: "id",value: "ID",present: true, dragable:true, sortable: true},  
	  {key: "name",value: "Name",present: true, dragable:true, sortable: true},  
	  {key: "username",value: "User Name",present: true, dragable:true, sortable: true},  
	  {key: "address.city",value: "City", present: true, dragable:true, sortable: true},  
	  {key: "company.name",value: "Company",present: true, dragable:true, sortable: true} 
  ]
```
The above will instruct the table to make the mentioned columns visible and sortable.  You can hide anyone of them or disable sorting on any columns.  You can make them draggable or have the content of a cell formatted if you add a "format" attribute to the column metadata you want to be formatted. 

For example: "format: 'date:MM/dd/yyyy'" or "format: 'currency'"

Now you need to set the **Pagination** data To something like:
```
{
	pageSize:8,
	currentPage:1,
	from:0,
	resetSize: true,
	contentSize: 0
}
```

**AND** pagination data should re-evaluate contentSize immediately when data items are available
```
	this.service.usersList().subscribe(
    	(users) => {
        	this.users = users.json();
        	this.pageInfo.contentSize = this.users.length;
    	}
    )
```

Now you need to set the table tag in your HTML content:
```
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
      <li>email: {{detail.email}}</li>
      <li>address: {{detail.address}}</li>
      <li>phone: {{detail.phone}}</li>
      <li>website: {{detail.website | into:link}}</li>
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

[Source code](https://github.com/msalehisedeh/flexible-table)

