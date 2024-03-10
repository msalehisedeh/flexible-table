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
	EventEmitter,
	ElementRef
} from '@angular/core';

import { 
	ActionEventInfo, 
	CellEditInfo, 
	ChangedtemsInfo, 
	FilteredItemsInfo, 
	FlexibleTableHeader, 
	PaginationInfo, 
	StylePositionInterface, 
	StyleServiceInterface, 
	VocabularyInterface 
} from '../interfaces/flexible-table.interface';

class DefaultStylerService implements StyleServiceInterface {
	styleFor(location: StylePositionInterface){return ''}
}

@Component({
	selector: 'table-view',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})
export class TableViewComponent implements OnInit, OnChanges {
	dragging = false;
	printMode = false;
	filteredItems: any[] = [];
	sortedItems: any[] = [];
	filteringTimerId: any;
	detailerContext: any;
	rowDetailer: any;
    validate = (item: any, newValue: any) => true;

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

	@Input() id!: string;
	@Input() headerSeparation = true;
	@Input() caption!: string;
    @Input() action!: string;
    @Input() pageInfo: PaginationInfo = {defaultSize:8, pageSize:8,currentPage:1,from:0,to: 8, pages: 1, maxWidth: '0', resetSize: true, contentSize: 0};
    @Input() actionKeys: any;
    @Input() tableClass = 'default-flexible-table';
	@Input() headers!: FlexibleTableHeader[];
	@Input() items!: any[];
	@Input() tableInfo: any;
    @Input() enableIndexing!: boolean;
    @Input() enableFiltering!: boolean;
	@Input() showActionable = true;
    @Input() expandable: any;
    @Input() filterwhiletyping!: boolean;
	@Input() styler: StyleServiceInterface = new DefaultStylerService();
	@Input() detailers: any;
	
	@Output() onaction = new EventEmitter<ActionEventInfo>();
	@Output() onchange = new EventEmitter<ChangedtemsInfo>();
	@Output() onfilter = new EventEmitter<FilteredItemsInfo>();
	@Output() onCellContentEdit = new EventEmitter<CellEditInfo>();

	@ViewChild('flexible', {static: false}) private table: any;

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

	private emitFilterChange() {
		const filters: any[] = this.headers.map((h, i) => {return {filter: (h.filter ? h.filter : ''), column: i}});
		this.onfilter.emit({
			filters,
			items: this.filteredItems,
			tableInfo: this.tableInfo
		});
	}
	private emitOnChange(type: string, from: number, to?: number) {
		this.onchange.emit({
			action: type,
			sourceIndex: from,
			destinationIndex: to,
			tableInfo: this.tableInfo,
			headers: this.headers
		});
	}
	private swapColumns(source: any, destination: any) {
		const srcIndex = this.getColumnIndex(source.medium.key);
		const desIndex = this.getColumnIndex(destination.medium.key);
		if (source.node.parentNode === destination.node.parentNode) {
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

				this.emitFilterChange();
				this.emitOnChange('swap columns', srcIndex, desIndex);
			}, 33);
	
		} else if (source.medium.locked || destination.medium.locked) {
			const x = this.filteredItems;
			this.filteredItems = [];
			this.emitFilterChange();
			setTimeout(()=>{
				source.medium.locked = !source.medium.locked;
				destination.medium.locked = !destination.medium.locked;
				this.filteredItems = x;
				this.emitFilterChange();
				this.emitOnChange('column lock', srcIndex, desIndex);
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
	private itemValue(item: any, hpath: any) {
		let subitem = item;
		hpath.map( (subkey: any) => {
			if (subitem) {
				subitem = subitem[subkey];
			}
		})
		return subitem === undefined || subitem === null || subitem === "null" ? "" : subitem;
	}
	// <5, !5, >5, *E, E*, *E*
	private shouldSkipItem(value: any, filterBy: any) {
		let result = false;

		if (value !== undefined && value !== null && String(value).length) {
			const v = String(value);
			if (filterBy[0] === '<') {
				result = filterBy.length > 1 && parseFloat(v) >= parseFloat(filterBy.substring(1));
			} else if (filterBy[0] === '>') {
				result = filterBy.length > 1 && parseFloat(v) <= parseFloat(filterBy.substring(1));
			} else if (filterBy[0] === '!') {
				result = filterBy.length > 1 && parseFloat(v) == parseFloat(filterBy.substring(1));
			} else if (filterBy[0] === '=') {
				result = filterBy.length == 1 || parseFloat(v) !== parseFloat(filterBy.substring(1));
			} else if (filterBy[0] === '*' && filterBy[filterBy.length-1] !== '*') {
				const f = filterBy.substring(1);
				result = v.indexOf(f) !== v.length - f.length
			} else if (filterBy[0] !== '*' && filterBy[filterBy.length-1] === '*') {
				const f = filterBy.substring(0, filterBy.length-1);
				result = v.indexOf(f) !== 0;
			} else if (filterBy[0] === '*' && filterBy[filterBy.length-1] === '*') {
				result = filterBy.length > 1 && v.indexOf( filterBy.substring(1, filterBy.length-1) ) < 0;
			} else {
				result = v.indexOf(filterBy) < 0;
			}
		}
		return result;
	}
	private toggleRow(item: any, header?: FlexibleTableHeader) {
		if (this.detailers && this.expandable && this.expandable(item, true) ) {
            if (item.expanded) {
                delete item.expanded;
            } else {
				this.rowDetailer = header ? this.detailers[header.key] : this.detailers['global'];
				this.detailerContext = {
					id: this.id,
					data: item,
					tableInfo: this.tableInfo,
					headers: this.headers // just incase if need to display specific items from other columns.
				};
				setTimeout(() => item.expanded = true, 0);
            }
        } else {
            this.onaction.emit({action: 'click', index: item.index, row: item, tableInfo: this.tableInfo});
		}
	}
	initVisibleRows(filtered: any[] | undefined) {
		const result = [];
		const list = filtered ? filtered : this.filteredItems;
		if (this.pageInfo) {
			for (let i = 0; i < list.length; i++) {
				if (i >= this.pageInfo.from && i <= this.pageInfo.to) {
					result.push(list[i]);
				}
			}
			this.filteredItems = result;
		}
		if (filtered) {
			this.emitFilterChange();
		}
	}
	lock(header: FlexibleTableHeader, event: any) {
		const index = this.getColumnIndex(header.key);

        event.stopPropagation();	
        event.preventDefault();
		header.locked = !header.locked;
		this.emitOnChange('column lock', index, index);
	}
	sort(header: FlexibleTableHeader, icon: any) {
		if (header.sortable && this.items && this.items.length) {
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
			let filtered = [];
			if (this.enableFiltering) {
				filtered = this.filterItems();
			} else {
				filtered = this.items ? this.items : [];
			}
			filtered.sort((a, b) => {
				const v1 = this.itemValue(a, hpath);
				const v2 = this.itemValue(b, hpath);

				if (header.ascending) {
					return v1 > v2 ? 1 : -1;
				}
				return v1 < v2 ? 1 : -1;
			});
			this.sortedItems = filtered;
			this.initVisibleRows(filtered);
		}
	}

	offsetWidth() {
		return this.table.nativeElement.offsetWidth;
	}

	ngOnChanges(changes:any) {
		// if (changes.items) {
		// 	this.evaluateRows();
		// }
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
		if (!this.headers) {
			this.headers = [];
		}
		this.evaluateRows();
        if (this.actionKeys) {
            this.actionKeys = this.actionKeys.split(",");
		}
	}
	evaluateRows() {
		let filtered = [];
		if (this.sortedItems && this.sortedItems.length) {
			filtered =this.sortedItems;
		} else {
			if (this.enableFiltering) {
				filtered = this.filterItems();
			} else {
				filtered = this.items ? this.items : [];
			}
		}
		this.initVisibleRows(filtered);
	}

    headerColumnElements() {
		let result = [];

		if (this.table.nativeElement.children) {
			const list = this.table.nativeElement.children;
			result = this.caption ? list[1].children[0].children : list[0].children[0].children;
		}
		return result;
    }

	headerById(id: string) {
		let header;
		for (const i in this.headers) {
			if (this.headers[i].key === id) {
				header = this.headers[i];
				break;
			}
		}
		return header;
	}
	headerByValue(v: string): FlexibleTableHeader {
		let header: FlexibleTableHeader = {key: 'unknown', value: 'unknown', active: true, disabled: false, present: false};
		for (const i in this.headers) {
			if (this.headers[i].value === v) {
				header = this.headers[i];
				break;
			}
		}
		return header;
	}

    columnsCount() {
		let count = 0;
		this.headers.map( (header: FlexibleTableHeader) => {
            if (header.present) {
                count++;
            }
		});
        if (this.showActionable) {
            count++;
        }
        return count;
	}
	hover(item: any, flag: boolean) {
		if (flag) {
			item.hover = true;
		} else {
			delete item.hover;
		}
	}

	toCssClass(header: any) {
		return header.key.replace(/\./g,'-');
	}
    keydown(event: any, item: any) {
        const code = event.which;
        if ((code === 13) || (code === 32)) {
			item.click();
		}
    }
    offScreenMessage(item: any) {
		let message: string = this.action;
		if (this.actionKeys) {
			this.actionKeys.map((key: string) => { message = message.replace(key, item[key.substring(1, key.length - 1)]); })
		}
        return message;
    }

    cellContent(item: any, header: any) {
		let content = this.itemValue(item, header.key.split("."));
        return (content !== undefined && content != null && String(content).length) ? content : '&nbsp;';
	}
	changeSelectedFilter(event: any, header: FlexibleTableHeader) {
		const index = event.target.selectedIndex;
		header.selectedFilterOption = (index > 0 && header.filterOptions) ? header.filterOptions[index - 1] : '';
		this.initVisibleRows(this.filterItems());
	}
	changeFilter(event: any, header: any) {
        const code = event.which;

		header.filter = event.target.value;

		if (this.filterwhiletyping || code === 13) {
			if(this.filteringTimerId) {
				clearTimeout(this.filteringTimerId);
			}
			this.filteringTimerId = setTimeout(()=>{
				this.initVisibleRows(this.filterItems());
				this.filteringTimerId  = undefined;
			}, 123);
		}
	}
	actionClick(event: any, item: any) {
		event.stopPropagation();
        this.toggleRow(item);
		return false;
	}

	print() {
		this.printMode = true;
		setTimeout(()=>{
			const content = this.el.nativeElement.innerHTML;
			const styles: any = document.getElementsByTagName('style');
			this.printMode = false;
			const popupWin: any = window.open('', '_blank', 'width=300,height=300');
			let copiedContent = '<html>';
			for(let i = 0; i < styles.length; i++) {
				copiedContent += styles[i].outerHTML;
			}
			copiedContent += '<body onload="window.print()">' + content + '</html>';

		
			popupWin.document.open();
        	popupWin.document.write(copiedContent);
        	popupWin.document.close();
		},3);
	}

	filterItems() {
		return this.items ? this.items.filter((item) => this.isAkeeper(item)) : [];
	}
	private isAkeeper(item: any) {
		const shouldSkipItem = this.headers.some(
			(header: FlexibleTableHeader) => {
				let skipper = false
				if (header.filter && header.filter.length) {
					const v = this.itemValue(item, header.key.split("."));

					if (this.shouldSkipItem(v,header.filter)) {
						skipper =  true;
					}
				} else if (header.filterOptions && header.filterOptions.length) {
					if (header.selectedFilterOption?.length) {
						const v = String(this.itemValue(item, header.key.split(".")));

						if (v !== header.selectedFilterOption) {
							skipper = true;
						}
					}
				}
				return skipper;
			}
		);
		return !shouldSkipItem;
	}

	onTableCellEdit(event: any) {
		if (event.type === 'toggle') {
			this.toggleRow(event.item, this.headerById(event.name));
		}
		const id = event.id.split("-");
		const v = event.type === 'check' ? Boolean(event.value) : event.value;
		const k = id[0];
		this.onCellContentEdit.emit({
			index: parseInt(id[1], 10),
			header: this.headerByValue(event.name), 
			key: k, 
			value: v, 
			type: event.type,
			item: event.item,
			tableInfo: this.tableInfo
		});
    }
	onDragStart(event: any){
       this.dragging = true;
	}
	onDragEnd(event: any){
       this.dragging = false;
	}
	onDrop(event: any){
		this.swapColumns(event.source, event.destination);
	}
}
