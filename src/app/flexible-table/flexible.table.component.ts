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
		configureTable: "Configure Table",
		configureColumns: "Configure Columns",
		clickSort: "Click to Sort",
		setSize: "Set Size",
		firstPage: "First",
		lastPage: "Last",
		previousPage: "Previous"
	};

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

    @Input("rowDetailerHeaders")
    public rowDetailerHeaders: any;

	@Output('onaction')
	private onaction = new EventEmitter();

	@Output('onconfigurationchange')
	private onconfigurationchange = new EventEmitter();

    constructor() {}

	ngOnInit() {
		if (!this.headers || this.headers.length === 0) {
			this.headers = new TableHeadersGenerator().generateHeadersFor(this.items[0],"", 5, this.enableFiltering);
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
	}

	onPaginationChange(event) {
		this.pageInfo = event;
	}

	tableAction(event) {
		this.onaction.emit(event)
	}

	onDrop(event:DropEvent){

	}
}
