import { EventEmitter, OnInit, ElementRef } from "@angular/core";
export interface PaginationInfo {
    contentSize: number;
    pageSize: number;
    maxWidth?: string;
    pages?: number;
    from?: number;
    to?: number;
    currentPage?: number;
    resetSize?: boolean;
}
export declare class TablePaginationComponent implements OnInit {
    private pager;
    private root;
    vocabulary: {
        setSize: string;
        firstPage: string;
        lastPage: string;
        previousPage: string;
    };
    info: PaginationInfo;
    onchange: EventEmitter<{}>;
    onready: EventEmitter<{}>;
    private el;
    constructor(el: ElementRef);
    ngOnInit(): void;
    setWidth(width: number): void;
    ready(): void;
    selectFirst(): void;
    selectNext(): void;
    selectPrev(): void;
    selectLast(): void;
    changeCurrent(ranger: any): void;
    changeSize(sizer: any): void;
}
