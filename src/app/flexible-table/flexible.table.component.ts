/*
* Provides rendering of a table which is using the given FlexibleTableHeader set in
* order to tabulate the given data. As per definition of earch header component,
* a column could be hidden, sortable, or draggable. Each table row can expand/collapse
* or respond to a click action.
*/
import {
    Component,
	Input,
	Output,
	ViewChild,
	OnInit,
	OnChanges,
	EventEmitter
} from '@angular/core';

import { DropEvent } from '@sedeh/drag-enabled';
import { TableHeadersGenerator } from './components/table-headers-generator';
import { TableViewComponent } from './components/table.component';

@Component({
	selector: 'flexible-table',
	templateUrl: './flexible.table.component.html',
	styleUrls: ['./flexible.table.component.scss']
})
export class FlexibleTableComponent implements OnInit, OnChanges {

	subHeaders:any;
	formeditems: any[];

    @Input("vocabulary")
    public vocabulary = {
		printTable: "Print Table",
		configureTable: "Configure Table",
		configureColumns: "Configure Columns",
		clickSort: "Click to Sort",
		setSize: "Set Size",
		firstPage: "First",
		lastPage: "Last",
		previousPage: "Previous"
	};
	
	@Input() headerSeparation = true;
    @Input() persistenceId: string;
	@Input() persistenceKey: string;
    @Input() caption: string;
    @Input() action: string;
    @Input() actionKeys;
    @Input() tableClass = 'default-flexible-table';
    @Input() inlinePagination = false;
	@Input() headers: any[];
	@Input() items: any[];
	@Input() pageInfo: any;
	@Input() tableInfo: any;
    @Input() configurable: boolean;
	@Input() configAddon: any;
	@Input() enableIndexing: boolean;
    @Input() enableFiltering: boolean;
    @Input() rowDetailer: any;
    @Input() expandable: any;
    @Input() expandIf: boolean;
    @Input() filterwhiletyping: boolean;
    @Input() rowDetailerHeaders: any;

	@Output() private onaction = new EventEmitter();
	@Output() private onCellContentEdit = new EventEmitter();
	@Output() private onfilter = new EventEmitter();
	@Output() private onconfigurationchange = new EventEmitter();

	@ViewChild('viewTable', {static: false})
	viewTable: TableViewComponent;

    constructor(private generator: TableHeadersGenerator) {}

	ngOnChanges(changes: any) {
		if (changes.items) {
			const list = [];
			this.items.map(
				(item: any) => {
					const copy = Object.assign({}, item);
					this.headers.map(
						(header: any) => {
							if (header.format) {
								const v = copy[header.key];
								if (v && typeof v === 'string') {
									const format = header.format.split(':');
									if (format[0] === 'calendar') {
										copy[header.key] = Date.parse(v);
									} else if (format[0] === 'date') {
										copy[header.key] = Date.parse(v);
									} else if (format[0] === 'number') {
										copy[header.key] = format.length > 2 ? parseFloat(v) : parseInt(v, 10);
									} else if (format[0] === 'currency') {
										copy[header.key] = parseFloat(v.replace(/[^0-9\.-]+/g,""));
									}
								}
							}
						}
					)
					list.push(copy);
				}
			)
			this.formeditems = list;
		}
	}
	ngOnInit() {
		if (this.persistenceKey) {
			const headers:any = this.generator.retreiveHeaders(this.persistenceKey, this.persistenceId);

			if (headers) {
				this.headers = headers;
			}
		}
		if (!this.headers || this.headers.length === 0) {
			this.headers = this.generator.generateHeadersFor(this.items[0],"", 5, this.enableFiltering);
			if (this.persistenceKey) {
				this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
			}
        }
		if (!this.rowDetailer && this.expandable) {
			this.rowDetailer = function(item) {
				return {data: item, headers: []};
			};
		}
		if (this.pageInfo) {
			if (!this.pageInfo.to) {
				this.pageInfo.to = this.pageInfo.pageSize;
			}
			this.pageInfo.contentSize = this.items.length;
		} else {
			this.pageInfo = {
                contentSize: 100000,
                pageSize: 100000,
                pages: 1,
                from: 0,
                to: 100000,
                currentPage: 1,
                maxWidth: "0"
            };
		}
		this.updateLimits();
	}

	updateLimits() {
		this.subHeaders = this.headers.filter( (header) => header.present === true);
	}

	reconfigure(event) {
		this.headers = event;
		this.updateLimits();
		this.onconfigurationchange.emit(event);

		if (this.persistenceKey) {
			this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
		}
	}

	onPaginationChange(event) {
		this.pageInfo = event;
		this.viewTable.evaluateRows();
	}

	tableAction(event) {
		this.onaction.emit(event)
	}

	onDrop(event:DropEvent){

	}
	onCellEdit(event){
		this.onCellContentEdit.emit(event);
	}
	onTableFilter(event){
		this.onfilter.emit(event);
	}
}
