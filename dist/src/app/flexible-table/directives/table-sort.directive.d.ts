import { ElementRef, Renderer } from '@angular/core';
export declare class TableSortDirective {
    private renderer;
    private el;
    medium: any;
    headers: any;
    dropEffect: string;
    tableSort: (path: any) => void;
    constructor(renderer: Renderer, el: ElementRef);
    private headerColumnElements();
    private findColumnWithID(id);
    sort(icon: any): void;
}
