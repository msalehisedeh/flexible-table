import { OnInit, OnChanges, ElementRef } from '@angular/core';
import { DropEvent, DragEvent } from 'drag-enabled';
export interface FlexibleTableHeader {
    key: string;
    value: string;
    present: boolean;
    width?: string;
    minwidth?: string;
    format?: string;
    filter?: string;
    dragable?: boolean;
    sortable?: boolean;
    class?: string;
    locked?: boolean;
    ascending?: boolean;
    descending?: boolean;
}
export declare class TableViewComponent implements OnInit, OnChanges {
    el: ElementRef;
    dragging: boolean;
    printMode: boolean;
    filteredItems: any[];
    vocabulary: {
        configureTable: string;
        configureColumns: string;
        clickSort: string;
        setSize: string;
        firstPage: string;
        lastPage: string;
        previousPage: string;
    };
    lockable: boolean;
    caption: string;
    action: string;
    pageInfo: any;
    actionKeys: any;
    tableClass: string;
    headers: any[];
    items: any[];
    tableInfo: any;
    enableIndexing: boolean;
    enableFiltering: boolean;
    rowDetailer: any;
    expandable: any;
    expandIf: boolean;
    rowDetailerHeaders: any;
    private onaction;
    private onchange;
    private onfilter;
    private table;
    constructor(el: ElementRef);
    private findColumnWithID(id);
    private swapColumns(source, destination);
    private getColumnIndex(id);
    private itemValue(item, hpath);
    lock(header: FlexibleTableHeader, event: any): void;
    sort(header: FlexibleTableHeader, icon: any): void;
    offsetWidth(): any;
    ngOnChanges(changes: any): void;
    ngOnInit(): void;
    headerColumnElements(): any[];
    headerById(id: any): any;
    columnsCount(): number;
    hover(item: any, flag: any): void;
    keydown(event: any, item: any): void;
    offScreenMessage(item: any): string;
    cellContent(item: any, header: any): string;
    rowDetailerContext(item: any): {
        data: any;
        tableInfo: any;
        headers: any;
    };
    changeFilter(event: any, header: any): void;
    actionClick(event: any, item: any): boolean;
    print(): void;
    private shouldSkipItem(value, filterBy);
    filterItems(): void;
    onTableCellEdit(event: any): void;
    dragEnabled(event: DragEvent): any;
    dropEnabled(event: DropEvent): any;
    onDragStart(event: DragEvent): void;
    onDragEnd(event: DragEvent): void;
    onDrop(event: DropEvent): void;
}
