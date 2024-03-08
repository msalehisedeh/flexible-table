/*
* Provides rendering of a table which is using the given FlexibleTableHeader set in
* order to tabulate the given data. As per definition of earch header component,
* a column could be hidden, sortable, or dragable. Each table row can expand/collapse
* or respond to a click action.
*/
import {
    Component,
	Input,
	Output,
	ViewChild,
	OnChanges,
	OnInit,
	Renderer2,
	EventEmitter,
	AfterViewInit
} from '@angular/core';

import { DropEvent, DragEvent } from '@sedeh/drag-enabled';
import { TableViewComponent } from './components/table.component';
import { TableHeadersGenerator } from './components/table-headers-generator';
import { FlexibleTableHeader, PaginationInfo, PaginationType, VocabularyInterface } from './interfaces/flexible-table.interface';

@Component({
	selector: 'lock-table',
	templateUrl: './lock.table.component.html',
	styleUrls: ['./lock.table.component.scss']
})
export class LockTableComponent implements OnInit, OnChanges, AfterViewInit {

	holdlocked = false;
	holdunlocked = false;
	lockedHeaders!:FlexibleTableHeader[];
	unlockedHeaders!:FlexibleTableHeader[];
	formeditems:any;
	indexing = true;
	filteredItems = [];

    @Input("vocabulary")
    public vocabulary: VocabularyInterface = {
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
    public persistenceId!: string;

    @Input("persistenceKey")
    public persistenceKey!: string;

    @Input("caption")
    public caption!: string;

    @Input("action")
    public action!: string;

    @Input("actionKeys")
    public actionKeys: any;

    @Input("tableClass")
    public tableClass = 'default-flexible-table';

	@Input("headers")
	public headers!: any[];

	@Input("items")
	public items!: any[];

    @Input('inlinePagination')
    inlinePagination: PaginationType = PaginationType.none;

	@Input("pageInfo")
	public pageInfo: PaginationInfo = {defaultSize:8, pageSize:8,currentPage:1,from:0,to: 8, pages: 1, maxWidth: '100%', resetSize: true, contentSize: 0};

	@Input("tableInfo")
	public tableInfo: any;

    @Input("configurable")
    public configurable!: boolean;

	@Input("configAddon")
	public configAddon: any;

	@Input("enableFiltering")
    public enableFiltering!: boolean;

    @Input("enableIndexing")
    set enableIndexing(value: boolean) {
		this.indexing = value;
		setTimeout(this.evaluatePositioning.bind(this),111);
	}

	@Input("showActionable") showActionable = true;

    @Input("filterwhiletyping")
    public filterwhiletyping!: boolean;


	@Output('onaction')
	private onaction = new EventEmitter();

	@Output('onCellContentEdit')
	private onCellContentEdit = new EventEmitter();

	@Output('onfilter')
	private onfilter = new EventEmitter();

	@Output('onconfigurationchange')
	private onconfigurationchange = new EventEmitter();

	@ViewChild('lockedTable', {static: false})
	private lockedTable!: TableViewComponent;

	@ViewChild('unlockedTable', {static: false})
	private unlockedTable!: TableViewComponent;

    scroll(event: any) {
		this.renderer.setStyle(
				this.lockedTable.el.nativeElement,
				"left",
				event.target.scrollLeft+"px");
	}

    constructor(
		private generator: TableHeadersGenerator,
		private renderer: Renderer2
	) {}

	ngAfterViewInit() {
		const width = this.lockedTable.offsetWidth() // + (this.indexing ? 40 : 0);
		this.renderer.setStyle(this.unlockedTable.el.nativeElement,"margin-left", width+ "px");
	}
	ngOnChanges(changes: any) {
		if (changes.items) {
			const list: any[] = [];
			this.items?.map(
				(item: any) => {
					const copy = Object.assign({}, item);
					this.headers.map(
						(header: FlexibleTableHeader) => {
							if (header.format) {
								const formats = typeof header.format === 'string' ? [header.format] : header.format;
								const v = copy[header.key];
								formats.map(
									(format: string) => {
										if (v && typeof v === 'string') {
											const f = format.split(':');
											if (f[0] === 'calendar') {
												copy[header.key] = Date.parse(v);
											} else if (f[0] === 'date') {
												copy[header.key] = Date.parse(v);
											} else if (f[0] === 'number') {
												copy[header.key] = f.length > 2 ? parseFloat(v) : parseInt(v, 10);
											} else if (f[0] === 'currency') {
												copy[header.key] = parseFloat(v.replace(/[^0-9\.-]+/g,""));
											}
										}
									}
								)
							}
						}
					)
					list.push(copy);
				}
			)
			this.formeditems = list;
		}
		if (changes.inlinePagination) {
			if (this.pageInfo && this.inlinePagination !== PaginationType.none) {
				this.pageInfo.from = 0;
				this.pageInfo.currentPage = 1;
				this.pageInfo.to = this.pageInfo.defaultSize;
				this.pageInfo.pageSize = this.pageInfo.defaultSize;
				this.pageInfo.contentSize = this.items.length;
			} else {
				this.pageInfo.from = 0;
				this.pageInfo.currentPage = 1;
				this.pageInfo.to = 100000000;
				this.pageInfo.pageSize = 100000000;
				this.pageInfo.contentSize = 100000000;
				this.onPaginationChange(this.pageInfo);
			}
		}
	}
	ngOnInit() {
		if (this.pageInfo) {
			if (!this.pageInfo.to) {
				this.pageInfo.to = this.pageInfo.pageSize;
			}
		} else {
			this.pageInfo = {
				defaultSize: 8,
				contentSize: 100000,
				pageSize: 100000,
				resetSize: true,
				pages: 1,
				from: 0,
				to: 100000,
				currentPage: 1,
				maxWidth: "300"
			};
		}
		if (this.configurable && this.persistenceKey) {
			const headers:any = this.generator.retreiveHeaders(this.persistenceKey, this.persistenceId);

			if (headers) {
				this.headers = headers;
			}
		}
		if (!this.headers) {
			this.headers = this.generator.generateHeadersFor(this.items[0],"", 5, this.enableFiltering);
			if (this.configurable && this.persistenceKey) {
				this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
			}
		}
		this.filteredItems = this.formeditems ? this.formeditems: this.items;
		this.pageInfo.contentSize = this.items.length;
		
		this.reconfigure(this.headers);

	}

	evaluatePositioning() {
		if (this.unlockedTable?.el) {
			this.renderer.setStyle(this.unlockedTable.el.nativeElement,"margin-left", this.lockedTable.offsetWidth()+ "px");
		}
	}

	reconfigure(event: any) {
		this.headers = JSON.parse(JSON.stringify(event.headers ? event.headers : event));
		this.lockedHeaders = this.headers.filter( (item) => item.locked === true && item.present);
		this.unlockedHeaders = this.headers.filter( (item) => item.locked !== true  && item.present);	
		this.onconfigurationchange.emit(event);

		if (this.configurable && this.persistenceKey) {
			this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
		}
		setTimeout(this.evaluatePositioning.bind(this),111);
	}

	onlock(event: any) {
		if (event.action === 'column lock') {
			this.lockedHeaders = this.headers.filter( (item) => item.locked === true && item.present);
			this.unlockedHeaders = this.headers.filter( (item) => item.locked !== true  && item.present);	
		}
		this.onconfigurationchange.emit(event);
	
		if (this.configurable && this.persistenceKey) {
			this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
		}
		setTimeout(this.evaluatePositioning.bind(this),111);
	}
	changeLockedTableFilteredItems(event: any) {
		if (this.lockedTable && !this.holdlocked) {
			this.lockedTable.filteredItems = event.items;
			this.lockedTable.initVisibleRows(undefined);
		}
		this.holdlocked = false;
	}
	changeUnlockedTableFilteredItems(event: any) {
		if (this.unlockedTable && !this.holdunlocked) {
			this.unlockedTable.filteredItems = event.items;
			this.unlockedTable.initVisibleRows(undefined);
		}
		this.holdunlocked = false;
	}
	onPaginationChange(event: any) {
		this.pageInfo = event;
		this.holdlocked = true;
		this.holdunlocked = true;
		this.lockedTable?.evaluateRows();
		this.unlockedTable?.evaluateRows();
	}

	tableAction(event: any) {
		this.onaction.emit(event)
	}

	onDrop(event: any, lock: boolean){

	}
	onCellEdit(event: any){
		this.onCellContentEdit.emit(event);
	}
	onTableFilter(event: any){
		this.onfilter.emit(event);
	}
	showTopPagination() {
		return this.inlinePagination === PaginationType.ontop || this.inlinePagination === PaginationType.topbottom
	}
	showBottomPagination() {
		return this.inlinePagination === PaginationType.onbottom || this.inlinePagination === PaginationType.topbottom
	}
	isInliner() {
		return this.inlinePagination !== PaginationType.floating;
	}
}

