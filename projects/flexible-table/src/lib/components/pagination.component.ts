/*
* Provides pagination of a data set in a table.
*/
import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { PaginationInfo, VocabularyInterface } from "../interfaces/flexible-table.interface";

@Component({
    selector: 'table-pagination',
	templateUrl: './pagination.component.html',
	styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

    @Input("vocabulary")
    public vocabulary: VocabularyInterface = {
        setSize: "", 
        firstPage: "", 
        nextPage: "", 
        lastPage: "", 
        previousPage: ""
    };

    @Input("info")
    info: PaginationInfo = { 
        defaultSize: 8,
        contentSize: 0,
        pageSize: 0,
        maxWidth: '100%',
        pages: 0,
        from: 0,
        to: 0,
        currentPage: 0
    };

    @Input('inline')
    inline = false;

	@Output('onpaginationchange')
    onpaginationchange = new EventEmitter();

    @Output('onpaginationready')
    onpaginationready = new EventEmitter();

	ngOnInit() {
		if (!this.info) {
			this.info = { 
                defaultSize: 8,
                contentSize: 1000, 
                pageSize: 1000, 
                pages: 1, 
                from: 0, 
                to: 1000, 
                currentPage: 1, 
                maxWidth: "300" 
            };
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
        this.onpaginationready.emit(this);
        this.onpaginationchange.emit(this.info);
    }

    selectFirst() {
        if (this.info.currentPage > 1) {
		    this.info.from = 0;
		    this.info.to = this.info.from + this.info.pageSize - 1;
		    this.info.currentPage = 1;
            this.onpaginationchange.emit(this.info);
        }
   }

   selectNext() {
        if (this.info.currentPage < this.info.pages) {
 		this.info.from = this.info.to + 1;
		this.info.to = this.info.from + this.info.pageSize - 1;
		this.info.currentPage++;
        this.onpaginationchange.emit(this.info);
        }
    }

    selectPrev() {
        if (this.info.currentPage > 1) {
 		    this.info.from -= this.info.pageSize;
		    this.info.to = this.info.from + this.info.pageSize - 1;
		    this.info.currentPage--;
            this.onpaginationchange.emit(this.info);
        }
    }

    selectLast() {
        if (this.info.currentPage < this.info.pages) {
		    this.info.from = this.info.pageSize * (this.info.pages - 1);
		    this.info.to = this.info.from + this.info.pageSize - 1;
		    this.info.currentPage = this.info.pages;
            this.onpaginationchange.emit(this.info);
        }
    }

    changeCurrent(ranger: any) {
        const v = parseInt( ranger.value, 10 );
        if (v > 0 && v <= this.info.pages) {
		    this.info.from = v * (this.info.pageSize - 1);
		    this.info.to = this.info.from + this.info.pageSize - 1;
		    this.info.currentPage = v;
            this.onpaginationchange.emit(this.info);
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
            this.onpaginationchange.emit(this.info);
        } else {
            sizer.value = this.info.pageSize;
        }
    }
}
