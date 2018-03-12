/*
* Provides pagination of a data set in a table.
*/
import {
	Component,
	ComponentFactory,
	ReflectiveInjector,
	ViewContainerRef,
	Input,
	Output,
	HostListener,
    EventEmitter,
    OnInit,
	ViewChild,
	ElementRef} from "@angular/core";

export interface PaginationInfo {
	contentSize: number,
	pageSize: number,
    maxWidth?: string,
	pages?: number,
	from?: number,
	to?: number,
	currentPage?: number,
    resetSize?: boolean
}

@Component({
    selector: 'table-pagination',
	templateUrl: './table.pagination.component.html',
	styleUrls: ['./table.pagination.component.scss']
})
export class TablePaginationComponent implements OnInit {
    @ViewChild('paginationWrapper') private pager: TablePaginationComponent;
	@ViewChild('paginationWrapper', {read: ViewContainerRef}) private root: ViewContainerRef;

    @Input("vocabulary")
    public vocabulary = {setSize: "", firstPage: "", lastPage: "", previousPage: ""};

    @Input("info")
    info: PaginationInfo = { contentSize: 0, pageSize: 0, maxWidth: "0" };

	@Output('onchange')
    onchange = new EventEmitter();

    @Output('onready')
    onready = new EventEmitter();

	private el: HTMLElement;

	constructor(el: ElementRef) {
		this.el = el.nativeElement;
    }

	ngOnInit() {
		if (!this.info) {
			this.info = { contentSize: 1000, pageSize: 1000, maxWidth: "0" };
		}
		if (this.info.contentSize && this.info.pageSize) {
			this.info.pages = Math.ceil(this.info.contentSize / this.info.pageSize);
			this.info.from = 0;
			this.info.to = this.info.pageSize - 1;
			this.info.currentPage = 1;
		    setTimeout(() => this.ready(), 66);
		}
    }

    public setWidth(width: number) {
        this.info.maxWidth = width + "px";
    }

    ready() {
        this.onready.emit(this);
        this.onchange.emit(this.info);
    }

    selectFirst() {
        if (this.info.currentPage > 1) {
		    this.info.from = 0;
		    this.info.to = this.info.from + this.info.pageSize - 1;
		    this.info.currentPage = 1;
            this.onchange.emit(this.info);
        }
   }

   selectNext() {
        if (this.info.currentPage < this.info.pages) {
 		this.info.from = this.info.to + 1;
		this.info.to = this.info.from + this.info.pageSize - 1;
		this.info.currentPage++;
        this.onchange.emit(this.info);
        }
    }

    selectPrev() {
        if (this.info.currentPage > 1) {
 		    this.info.from -= this.info.pageSize;
		    this.info.to = this.info.from + this.info.pageSize - 1;
		    this.info.currentPage--;
            this.onchange.emit(this.info);
        }
    }

    selectLast() {
        if (this.info.currentPage < this.info.pages) {
		    this.info.from = this.info.pageSize * (this.info.pages - 1);
		    this.info.to = this.info.from + this.info.pageSize - 1;
		    this.info.currentPage = this.info.pages;
            this.onchange.emit(this.info);
        }
    }

    changeCurrent(ranger: any) {
        const v = parseInt( ranger.value, 10 );
        if (this.info.currentPage < v && v > 0 && v < this.info.pages) {
		    this.info.from = v * (this.info.pageSize - 1);
		    this.info.to = this.info.from + this.info.pageSize - 1;
		    this.info.currentPage = v;
            this.onchange.emit(this.info);
        } else {
            ranger.value = this.info.currentPage;
        }
    }

    changeSize(sizer: any) {
        const v = parseInt( sizer.value, 10 );
        if (this.info.contentSize >= v && v > 1) {
            this.info.pageSize = v;
 			this.info.pages = Math.ceil(this.info.contentSize / v);
            this.info.from = 0;
			this.info.to = this.info.pageSize - 1;
			this.info.currentPage = 1;
            this.onchange.emit(this.info);
        } else {
            sizer.value = this.info.pageSize;
        }
    }
}
