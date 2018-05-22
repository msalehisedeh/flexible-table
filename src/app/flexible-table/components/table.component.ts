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
	EventEmitter,
	ElementRef
} from '@angular/core';

import { DropEvent, DragEvent } from 'drag-enabled';

export interface FlexibleTableHeader {
	key: string,
	value: string,
	present: boolean,
	width?: string,
	format?: string,
	filter?: string,
	dragable?: boolean,
	sortable?: boolean,
	class?:string,
	locked?:boolean,
	ascending?: boolean,
	descending?: boolean
}

@Component({
	selector: 'table-view',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})
export class TableViewComponent implements OnInit {
	dragging = false;
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

	@Input("lockable")
	lockable:boolean;

	@Input("caption")
    public caption: string;

    @Input("action")
    public action: string;

    @Input("pageInfo")
    public pageInfo;

    @Input("actionKeys")
    public actionKeys;

    @Input("tableClass")
    public tableClass = 'default-flexible-table';

	@Input("headers")
	public headers: any[];

	@Input("items")
	public items: any[];

	@Input("tableInfo")
	public tableInfo: any;

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

	@Output('onchange')
	private onchange = new EventEmitter();

	@Output('onfilter')
	private onfilter = new EventEmitter();

	@ViewChild('flexible', {read: ViewContainerRef}) private table: ViewContainerRef;

    constructor(public el:ElementRef) {}


	private findColumnWithID(id: string) {
        const list = this.headerColumnElements();
		let column = null;
		for (let i = 0; i < list.length; i++) {
			if (list[i].getAttribute("id") === id) {
				column = list[i];
				break;
			}
		}
		return column;
	}

	private swapColumns(source: any, destination: any) {

		if (source.node.parentNode === destination.node.parentNode) {
			const srcIndex = this.getColumnIndex(source.medium.key);
			const desIndex = this.getColumnIndex(destination.medium.key);
			if (srcIndex < 0 || desIndex < 0) {
				console.log("invalid drop id", source.medium.key, destination.medium.key);
				return;
			}
			const x = this.filteredItems;
			this.filteredItems = [];

			setTimeout(()=>{
				const sobj = this.headers[srcIndex];
				this.headers[srcIndex] = this.headers[desIndex];
				this.headers[desIndex] = sobj;
				this.filteredItems = x;

				this.onfilter.emit(this.filteredItems);
				this.onchange.emit(this.headers);
			}, 33);
	
		} else if (source.medium.locked || destination.medium.locked) {
			const x = this.filteredItems;
			this.filteredItems = [];
			this.onfilter.emit(this.filteredItems);
			setTimeout(()=>{
				source.medium.locked = !source.medium.locked;
				destination.medium.locked = !destination.medium.locked;
				this.filteredItems = x;
				this.onfilter.emit(this.filteredItems);
				this.onchange.emit(this.headers);
			},33);
		}
	}

	private getColumnIndex(id: string) {
		let index = -1;
		for (let i = 0; i < this.headers.length; i++) {
			if (this.headers[i].key === id) {
				index = i;
				break;
			}
		}
		return index;
	}
	private itemValue(item, hpath) {
		let subitem = item;
		hpath.map( (subkey) => {
			if (subitem) {
				subitem = subitem[subkey];
			}
		})
		return subitem === undefined || subitem === null || subitem === "null" ? "" : String(subitem);
	}

	lock(header: FlexibleTableHeader, event) {
        event.stopPropagation();	
        event.preventDefault();
		header.locked = !header.locked;
		this.onchange.emit(this.headers);
	}
	sort(header: FlexibleTableHeader, icon) {
		if (header.sortable) {
			for (let i = 0; i < this.headers.length ; i++) {
                const h = this.headers[i];

                if (h.key !== header.key) {
					const item = this.findColumnWithID(h.key);

					if (item) {
						item.classList.remove("ascending");
						item.classList.remove("descending");
						item.classList.add("sortable");
					}
                    h.descending = false;
                    h.ascending = false;
				}
			}
            icon.classList.remove("fa-sort");
			if (header.ascending || (!header.ascending && !header.descending)) {
				header.descending = true;
				header.ascending = false;
				icon.classList.remove("fa-sort-asc");
				icon.classList.add("fa-sort-desc");
			} else {
				header.descending = false;
				header.ascending = true;
				icon.classList.remove("fa-sort-desc");
				icon.classList.add("fa-sort-asc");
			}
			const hpath = header.key.split(".");
			this.items.sort((a, b) => {
				const v1 = this.itemValue(a, hpath);
				const v2 = this.itemValue(b, hpath);

				if (header.ascending) {
					return v1 > v2 ? 1 : -1;
				}
				return v1 < v2 ? 1 : -1;
			});
		}
	}

	offsetWidth() {
		return this.table.element.nativeElement.offsetWidth;
	}

	ngOnInit() {
		if (!this.headers) {
			this.headers = [];
		}
		if (this.enableFiltering) {
			this.filterItems();
		} else {
			this.filteredItems = this.items;
		}
        if (this.actionKeys) {
            this.actionKeys = this.actionKeys.split(",");
		}
		if (!this.rowDetailer && this.expandable) {
			this.rowDetailer = function(item) {
				return {data: item, headers: []};
			};
		}
		if (!this.expandable) {
			this.expandable = function(item, showIcon) {return showIcon};
		}
		if (!this.rowDetailerHeaders) {
			this.rowDetailerHeaders = (item) => [];
		}
	}

    headerColumnElements() {
		return this.table.element.nativeElement.children ?
				this.table.element.nativeElement.children[1].children[0].children : [];
    }

	headerById(id) {
		let h;
		for (const i in this.headers) {
			if (this.headers[i].key === id) {
				h = this.headers[i];
				break;
			}
		}
		return h;
	}

    columnsCount() {
		let count = 0;
		this.headers.map( (item) => {
            if (item.present) {
                count++;
            }
		});
        if (this.action) {
            count++;
        }
        return count;
	}
	hover(item, flag) {
		if (flag) {
			item.hover = true;
		} else {
			delete item.hover;
		}
	}

    keydown(event, item) {
        const code = event.which;
        if ((code === 13) || (code === 32)) {
			item.click();
		}
    }
    offScreenMessage(item) {
        let message: string = this.action;
        this.actionKeys.map((key) => { message = message.replace(key, item[key.substring(1, key.length - 1)]); })
        return message;
    }

    cellContent(item, header) {
		let content = this.itemValue(item, header.key.split("."));
        return (content !== undefined && content != null) ? content : '&nbsp;';
	}

	rowDetailerContext(item) {
		return {
			data: item,
			tableInfo: this.tableInfo,
			headers: this.rowDetailerHeaders(item)
		};
	}

	changeFilter(event, header) {
        const code = event.which;

		header.filter = event.target.value;

		if (code === 13) {
			this.filterItems();
		}
	}
	actionClick(event, item: any) {
		event.stopPropagation();
        if (this.rowDetailer && (this.expandIf || this.expandable(item, false)) ) {
            if (item.expanded) {
                delete item.expanded;
            } else {
                item.expanded = true;
            }
        } else {
            this.onaction.emit(item);
		}
		return false;
	}

	// <5, !5, >5, *E, E*, *E*
	private shouldSkipItem(value, filterBy) {
		let result = false;

		if (value !== undefined && value !== null && value.length) {			
			if (filterBy[0] === '<') {
				result = parseFloat(value) >= parseFloat(filterBy.substring(1));
			} else if (filterBy[0] === '>') {
				result = parseFloat(value) <= parseFloat(filterBy.substring(1));
			} else if (filterBy[0] === '!') {
				result = parseFloat(value) == parseFloat(filterBy.substring(1));
			} else if (filterBy[0] === '=') {
				result = parseFloat(value) !== parseFloat(filterBy.substring(1));
			} else if (filterBy[0] === '*' && filterBy[filterBy.length-1] !== '*') {
				const f = filterBy.substring(1);
				result = value.toLowerCase().indexOf(f) !== value.length - f.length
			} else if (filterBy[0] !== '*' && filterBy[filterBy.length-1] === '*') {
				const f = filterBy.substring(0, filterBy.length-1);
				result = value.toLowerCase().indexOf(f) !== 0;
			} else if (filterBy[0] === '*' && filterBy[filterBy.length-1] === '*') {
				const f = filterBy.substring(1, filterBy.length-1);
				result = value.toLowerCase().indexOf(f) < 0;
			} else {
				result = value.toLowerCase().indexOf(filterBy) < 0;
			}
		}
		return result;
	}
	filterItems() {
		this.filteredItems = this.items.filter((item) => {
			let keepItem = true;

			for (let i = 0; i < this.headers.length; i++) {
				const header = this.headers[i];
				if (header.filter && header.filter.length) {
					const v2= header.filter.toLowerCase();
					const v = this.itemValue(item, header.key.split("."));

					if (this.shouldSkipItem(v,v2)) {
						keepItem = false;
						break;
					}
				}
			}
			return keepItem;
		});
		this.onfilter.emit(this.filteredItems);
	}

	onTableCellEdit(event) {
		const id = event.id.split("-");
		const name = event.name;
		const value= event.value;
		const item = this.items[parseInt(id[1])];

		if (item) {
			const list = id[0].split(".");
			let subitem = item[list[0]];
			for(let i = 1; i < (list.length - 1); i++) {
				subitem = subitem[list[i]]
			}
			if (subitem && list.length > 1){
				subitem[list[list.length - 1]] = value;
			}
		}
    }

	dragEnabled(event: DragEvent) {
		return event.medium.dragable;
	}
	dropEnabled(event: DropEvent) {
		return event.destination.medium.dragable;
	}
	onDragStart(event: DragEvent){
//        this.dragging = true;
	}
	onDragEnd(event: DragEvent){
 //       this.dragging = false;
	}
	onDrop(event:DropEvent){
		this.swapColumns(event.source, event.destination);
	}
}
