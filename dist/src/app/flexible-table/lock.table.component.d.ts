import { OnInit, Renderer } from '@angular/core';
import { DropEvent } from 'drag-enabled';
import { TableHeadersGenerator } from './components/table-headers-generator';
export declare class LockTableComponent implements OnInit {
    private generator;
    private renderer;
    lockedHeaders: any;
    unlockedHeaders: any;
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
    persistenceId: string;
    persistenceKey: string;
    caption: string;
    action: string;
    actionKeys: any;
    tableClass: string;
    headers: any[];
    items: any[];
    pageInfo: any;
    tableInfo: any;
    configurable: boolean;
    configAddon: any;
    enableFiltering: boolean;
    enableIndexing: boolean;
    filterwhiletyping: boolean;
    private onaction;
    private onCellContentEdit;
    private onconfigurationchange;
    private lockedTable;
    private unlockedTable;
    scroll(event: any): void;
    constructor(generator: TableHeadersGenerator, renderer: Renderer);
    ngOnInit(): void;
    evaluatePositioning(): void;
    reconfigure(event: any): void;
    onlock(event: any): void;
    changeLockedTableFilteredItems(event: any): void;
    changeUnlockedTableFilteredItems(event: any): void;
    tableAction(event: any): void;
    onDrop(event: DropEvent): void;
    onCellEdit(event: any): void;
}
