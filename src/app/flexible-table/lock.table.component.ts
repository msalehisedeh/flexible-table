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
	Renderer,
	ElementRef,
	EventEmitter
} from '@angular/core';

import { DropEvent, DragEvent } from 'drag-enabled';
import { TableViewComponent } from './components/table.component';
import { TableHeadersGenerator } from './components/table-headers-generator';

@Component({
	selector: 'lock-table',
	templateUrl: './lock.table.component.html',
	styleUrls: ['./lock.table.component.scss']
})
export class LockTableComponent implements OnInit {

	lockedHeaders:any;
	unlockedHeaders:any;
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

	@Input("enableFiltering")
    public enableFiltering: boolean;

    @Input("enableIndexing")
    public enableIndexing: boolean;

    @Input("filterwhiletyping")
    public filterwhiletyping: boolean;


	@Output('onaction')
	private onaction = new EventEmitter();

	@Output('onCellContentEdit')
	private onCellContentEdit = new EventEmitter();

	@Output('onconfigurationchange')
	private onconfigurationchange = new EventEmitter();

	@ViewChild('lockedTable')
	private lockedTable: TableViewComponent;

	@ViewChild('unlockedTable')
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

	ngOnInit() {
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
		this.filteredItems = this.items;
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
		if (this.lockedTable) {
			this.lockedTable.filteredItems = event;
		}
	}
	changeUnlockedTableFilteredItems(event) {
		if (this.unlockedTable) {
			this.unlockedTable.filteredItems = event;
		}
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

