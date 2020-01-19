import { OnChanges, OnInit, Renderer } from '@angular/core';
import { DropEvent } from '@sedeh/drag-enabled';
import { TableHeadersGenerator } from './components/table-headers-generator';
export declare class LockTableComponent implements OnInit, OnChanges {
    private generator;
    private renderer;
    holdlocked: boolean;
    holdunlocked: boolean;
    lockedHeaders: any;
    unlockedHeaders: any;
    formeditems: any;
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
    headerSeparation: boolean;
    persistenceId: string;
    persistenceKey: string;
    caption: string;
    action: string;
    actionKeys: any;
    tableClass: string;
    headers: any[];
    items: any[];
    inlinePagination: boolean;
    pageInfo: any;
    tableInfo: any;
    configurable: boolean;
    configAddon: any;
    enableFiltering: boolean;
    enableIndexing: boolean;
    filterwhiletyping: boolean;
    private onaction;
    private onCellContentEdit;
    private onfilter;
    private onconfigurationchange;
    private lockedTable;
    private unlockedTable;
    scroll(event: any): void;
    constructor(generator: TableHeadersGenerator, renderer: Renderer);
    ngOnChanges(changes: any): void;
    ngOnInit(): void;
    evaluatePositioning(): void;
    reconfigure(event: any): void;
    onlock(event: any): void;
    changeLockedTableFilteredItems(event: any): void;
    changeUnlockedTableFilteredItems(event: any): void;
    onPaginationChange(event: any): void;
    tableAction(event: any): void;
    onDrop(event: DropEvent): void;
    onCellEdit(event: any): void;
    onTableFilter(event: any): void;
}
