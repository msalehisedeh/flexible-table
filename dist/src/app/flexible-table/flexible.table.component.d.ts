import { OnInit } from '@angular/core';
import { InToPipe } from 'into-pipes';
import { DropEvent } from 'drag-enabled';
export interface FlexibleTableHeader {
    key: string;
    value: string;
    present: boolean;
    width?: string;
    format?: string;
    dragable?: boolean;
    sortable?: boolean;
    class?: string;
    lockable?: boolean;
    locked?: boolean;
    ascending?: boolean;
    descending?: boolean;
}
export declare class FlexibleTableComponent implements OnInit {
    private intoPipe;
    subItems: any;
    subHeaders: any;
    vocabulary: {
        configureTable: string;
        configureColumns: string;
        clickSort: string;
        setSize: string;
        firstPage: string;
        lastPage: string;
        previousPage: string;
    };
    caption: string;
    action: string;
    actionKeys: any;
    tableClass: string;
    headers: any[];
    items: any[];
    pageInfo: any;
    tableInfo: any;
    configurable: boolean;
    enableIndexing: boolean;
    rowDetailer: any;
    expandable: any;
    expandIf: boolean;
    rowDetailerHeaders: any;
    private onaction;
    private onconfigurationchange;
    constructor(intoPipe: InToPipe);
    ngOnInit(): void;
    updateLimits(): void;
    reconfigure(event: any): void;
    onPaginationChange(event: any): void;
    tableAction(event: any): void;
    onDrop(event: DropEvent): void;
}
