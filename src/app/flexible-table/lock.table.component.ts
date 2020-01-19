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
	OnChanges,
	OnInit,
	Renderer,
	EventEmitter
} from '@angular/core';

import { DropEvent, DragEvent } from '@sedeh/drag-enabled';
import { TableViewComponent } from './components/table.component';
import { TableHeadersGenerator } from './components/table-headers-generator';

@Component({
	selector: 'lock-table',
	templateUrl: './lock.table.component.html',
	styleUrls: ['./lock.table.component.scss']
})
export class LockTableComponent implements OnInit, OnChanges {

	holdlocked = false;
	holdunlocked = false;
	lockedHeaders:any;
	unlockedHeaders:any;
	formeditems:any;
	filteredItems = [];

    @Input("vocabulary")
    public vocabulary = {
		configureTable: "Configure Table",
		configureColumns: "Configure Columns",
		clickSort: "Click to Sort",
		setSize: "Set Size",
		firstPage: "First",
		lastPage: "Last",
		previousPage: "Previous"
	};

	@Input() headerSeparation = true;
    @Input("persistenceId")
    public persistenceId: string;

    @Input("persistenceKey")
    public persistenceKey: string;

    @Input() caption: string;
    @Input() action: string;
    @Input() actionKeys;
    @Input() tableClass = 'default-flexible-table';
	@Input() headers: any[];
	@Input() items: any[];
    @Input() inlinePagination = false;
	@Input() pageInfo: any;
	@Input() tableInfo: any;
    @Input() configurable: boolean;
	@Input() configAddon: any;
	@Input() enableFiltering: boolean;
    @Input() enableIndexing: boolean;
    @Input() filterwhiletyping: boolean;


	@Output() private onaction = new EventEmitter();
	@Output() private onCellContentEdit = new EventEmitter();
	@Output() private onfilter = new EventEmitter();
	@Output() private onconfigurationchange = new EventEmitter();

	@ViewChild('lockedTable', {static: false})
	private lockedTable: TableViewComponent;

	@ViewChild('unlockedTable', {static: false})
	private unlockedTable: TableViewComponent;

    scroll(event) {
		this.renderer.setElementStyle(
				this.lockedTable.el.nativeElement,
				"left",
				event.target.scrollLeft+"px");
	}

    constructor(
		private generator: TableHeadersGenerator,
		private renderer: Renderer
	) {}

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
		if (this.pageInfo) {
			if (!this.pageInfo.to) {
				this.pageInfo.to = this.pageInfo.pageSize;
			}
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
		if (this.persistenceKey) {
			const headers:any = this.generator.retreiveHeaders(this.persistenceKey, this.persistenceId);

			if (headers) {
				this.headers = headers;
			}
		}
		if (!this.headers) {
			this.headers = this.generator.generateHeadersFor(this.items[0],"", 5, this.enableFiltering);
			if (this.persistenceKey) {
				this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
			}
		}
		this.filteredItems = this.formeditems ? this.formeditems: this.items;
		this.pageInfo.contentSize = this.items.length;
		
		this.reconfigure(this.headers);

	}

	evaluatePositioning() {
		this.renderer.setElementStyle(
			this.unlockedTable.el.nativeElement,
			"margin-left",
			this.lockedTable.offsetWidth()+"px");
	}

	reconfigure(event) {
		this.headers = event;
		this.lockedHeaders = this.headers.filter( (item) => item.locked === true && item.present);
		this.unlockedHeaders = this.headers.filter( (item) => item.locked !== true  && item.present);	
		this.onconfigurationchange.emit(event);

		if (this.persistenceKey) {
			this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
		}
		setTimeout(this.evaluatePositioning.bind(this),111);
	}

	onlock(event) {
		this.lockedHeaders = this.headers.filter( (item) => item.locked === true && item.present);
		this.unlockedHeaders = this.headers.filter( (item) => item.locked !== true  && item.present);	
		this.onconfigurationchange.emit(event);

		if (this.persistenceKey) {
			this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
		}
		setTimeout(this.evaluatePositioning.bind(this),111);
	}
	changeLockedTableFilteredItems(event) {
		if (this.lockedTable && !this.holdlocked) {
			this.lockedTable.filteredItems = event;
			this.lockedTable.initVisibleRows(null);
		}
		this.holdlocked = false;
	}
	changeUnlockedTableFilteredItems(event) {
		if (this.unlockedTable && !this.holdunlocked) {
			this.unlockedTable.filteredItems = event;
			this.unlockedTable.initVisibleRows(null);
		}
		this.holdunlocked = false;
	}
	onPaginationChange(event) {
		this.pageInfo = event;
		this.holdlocked = true;
		this.holdunlocked = true;
		this.lockedTable.evaluateRows();
		this.unlockedTable.evaluateRows();
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

