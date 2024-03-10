
# Welcome to Flexible table!

Have you ever looked for a simple way of flushing your data in a versatile table by passing in a few meta-data instructions just to get your data displayed the way you wanted with interactive components inside? AND how about adding graphics into the resulting table with some nifty formatting rules just by mapping your JSON data into table column headers! AND not paying a dime for it? Ha? Say it again!! And all is done without writing much of any code!! On top of that, if you do not want to take time and write meta-data rules, FlexibleTable will generate the rules for you. You can feed any data to the table and see it tabulated!!

FlexibleTable and LockTable are Angular based code. LockTable will allow you to lock/unlock columns. Both tables are fully configurable with pagination and ability to re-order table columns through drag/drop operation.

**NOTE** Current version 3.2.5

**NOTE:** If your project still is angular 2, 4, or 5; please luck-down your version reference to flexible table to 1.7.1 version by removing ^ from the version dependency in your package json. Otherwise for Angular 6+, please use 1.7.2 version or higher.

**NOTE:** Starting with version 1.8.2 you need to import this library through @sedeh/flexible-table.

Please send your requests or comments through [Comments/Requests](https://github.com/msalehisedeh/flexible-table/issues)

View it in action on [Live Demo](https://stackblitz.com/edit/flexible-table?file=app%2Fapp.component.ts)

Get it from [NPM](https://www.npmjs.com/package/@sedeh/flexible-table)

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
VocabularyInterface
PipeServiceComponentInterface
PaginationInfo
FlexibleTableHeader
PaginationType
CellEditInfo
FilteredItemsInfo
ActionEventInfo
ChangedtemsInfo
VisualizationPoint
FlexibleTableComponent
LockTableComponent
TableHeadersGenerator

DEPENDENCIES: 
    "@sedeh/drag-enabled": "^4.3.3",
    "@sedeh/into-pipes": "^4.5.3",
    "font-awesome": "^4.7.0"
```
                                                                                    |

![alt text](https://raw.githubusercontent.com/msalehisedeh/flexible-table/master/flexible.png  "What you would see when a flexible table is used")


![alt text](https://raw.githubusercontent.com/msalehisedeh/flexible-table/master/locked.png  "What you would see when a flexible table is used")

