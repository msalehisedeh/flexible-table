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
	ViewContainerRef,
	OnInit,
	EventEmitter
} from '@angular/core';

import { DropEvent, DragEvent } from 'drag-enabled';
import { TableHeadersGenerator } from './components/table-headers-generator';
import { TableViewComponent } from './components/table.component';

@Component({
	selector: 'flexible-table',
	templateUrl: './flexible.table.component.html',
	styleUrls: ['./flexible.table.component.scss']
})
export class FlexibleTableComponent implements OnInit {

	subItems:any;
	subHeaders:any;

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
	
    @Input("persistenceId")
    public persistenceId: string;

	@Input("persistenceKey")
    public persistenceKey: string;

    @Input("caption")
    public caption: string;

    @Input("action")
    public action: string;

    @Input("actionKeys")
    public actionKeys;

    @Input("tableClass")
    public tableClass = 'default-flexible-table';

	@Input("headers")
	public headers: any[];

	@Input("items")
	public items: any[];

	@Input("pageInfo")
	public pageInfo: any;

	@Input("tableInfo")
	public tableInfo: any;

    @Input("configurable")
    public configurable: boolean;

	@Input("configAddon")
	public configAddon: any;

	@Input("enableIndexing")
    public enableIndexing: boolean;

    @Input("enableFiltering")
    public enableFiltering: boolean;

    @Input("rowDetailer")
    public rowDetailer: any;

    @Input("expandable")
    public expandable: any;

    @Input("expandIf")
    public expandIf: boolean;

    @Input("filterwhiletyping")
    public filterwhiletyping: boolean;

    @Input("rowDetailerHeaders")
    public rowDetailerHeaders: any;

	@Output('onaction')
	private onaction = new EventEmitter();

	@Output('onCellContentEdit')
	private onCellContentEdit = new EventEmitter();

	@Output('onconfigurationchange')
	private onconfigurationchange = new EventEmitter();

	@ViewChild('viewTable')
	viewTable: TableViewComponent;

    constructor(private generator: TableHeadersGenerator) {}

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
}
