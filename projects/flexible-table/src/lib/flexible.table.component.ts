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
	OnInit,
	OnChanges,
	EventEmitter
} from '@angular/core';

import { TableHeadersGenerator } from './components/table-headers-generator';
import { TableViewComponent, defaultPageInfo } from './components/table.component';
import { FlexibleTableHeader, PaginationInfo, PaginationType, StylePositionInterface, StyleServiceInterface, VocabularyInterface } from './interfaces/flexible-table.interface';

class DefaultStylerService implements StyleServiceInterface {
	styleFor(location: StylePositionInterface){return ''}
}

@Component({
	selector: 'flexible-table',
	templateUrl: './flexible.table.component.html',
	styleUrls: ['./flexible.table.component.scss']
})
export class FlexibleTableComponent implements OnInit, OnChanges {

	subHeaders:any;
	formeditems!: any[];

	@Input() styler: StyleServiceInterface = new DefaultStylerService();

	@Input("vocabulary")
    public vocabulary: VocabularyInterface = {
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

    @Input('inlinePagination')
    inlinePagination: PaginationType = PaginationType.none;

	@Input("headers")
	public headers!: FlexibleTableHeader[];

	@Input("items")
	public items!: any[];

	@Input("pageInfo")
	public pageInfo: PaginationInfo = defaultPageInfo;

	@Input("tableInfo")
	public tableInfo: any;

    @Input("configurable")
    public configurable!: boolean;

	@Input("configAddon")
	public configAddon: any;

	@Input("enableIndexing")
    public enableIndexing!: boolean;

	@Input("showActionable") showActionable = true;

    @Input("enableFiltering")
    public enableFiltering!: boolean;

    @Input("expandable")
    public expandable: any;

    @Input("filterwhiletyping")
    public filterwhiletyping!: boolean;

    @Input("detailers")
    public detailers: any;

	@Output('onaction')
	private onaction = new EventEmitter();

	@Output('onCellContentEdit')
	private onCellContentEdit = new EventEmitter();

	@Output('onfilter')
	private onfilter = new EventEmitter();

	@Output('onconfigurationchange')
	private onconfigurationchange = new EventEmitter();

	@ViewChild('viewTable', {static: false})
	viewTable!: TableViewComponent;

    constructor(private generator: TableHeadersGenerator) {}

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
		if (this.configurable && this.persistenceKey) {
			const headers: FlexibleTableHeader[] = this.generator.retreiveHeaders(this.persistenceKey, this.persistenceId);

			if (headers) {
				this.headers = headers;
			}
		}
		if (!this.headers || this.headers.length === 0) {
			this.headers = this.generator.generateHeadersFor(this.items[0],"", 5, this.enableFiltering);
			if (this.configurable && this.persistenceKey) {
				this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
			}
        }
		if (this.pageInfo && this.inlinePagination !== PaginationType.none) {
			if (!this.pageInfo.to) {
				this.pageInfo.to = this.pageInfo.pageSize;
			}
			this.pageInfo.contentSize = this.items.length;
		} else if (!this.pageInfo) {
			this.pageInfo = {
				defaultSize: 8,
				contentSize: 100000,
				pageSize: 100000,
				resetSize: true,
				pages: 1,
				from: 0,
				to: 100000,
				currentPage: 1
			};
		}
		this.updateLimits();
	}

	updateLimits() {
		this.subHeaders = (this.headers && this.headers.filter) ? 
							this.headers.filter( (header: FlexibleTableHeader) => header.present === true) : 
							this.headers;
	}

	change(event: any) {
		this.updateLimits();
		this.onconfigurationchange.emit(event);

		if (this.configurable && this.persistenceKey) {
			this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
		}
	}
	reconfigure(event: any) {
		this.headers = JSON.parse(JSON.stringify(event.headers ? event.headers : event));
		this.updateLimits();
		this.onconfigurationchange.emit(event);

		if (this.configurable && this.persistenceKey) {
			this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
		}
	}

	onPaginationChange(event: PaginationInfo) {
		this.pageInfo = event;
		this.viewTable?.evaluateRows();
	}

	tableAction(event: any) {
		this.onaction.emit(event)
	}

	onDrop(event: any){

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
		return this.inlinePagination === PaginationType.onbottom || 
				this.inlinePagination === PaginationType.topbottom ||
				this.inlinePagination == PaginationType.floating
	}
	isInliner() {
		return this.inlinePagination !== PaginationType.floating;
	}
}
