/*
 * This directive is best suited for dragging an element with confinement of document.  it is not recomended
 * to be used in conjunction with a drop operation if an element is to be dropped on another element within 
 * a heirarchy of nodes.
 */
import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { DataTransfer } from './datatransfer';
import { DragEvent } from './drag-drop.interfaces';

@Directive({
    selector: '[dragInDocument]',
    host: {
        '[draggable]': 'true'
    }
})
export class DragInDocumentDirective {
    
    @Input("medium")
    medium: any;
    
    @Input("dragEffect")
    dragEffect = "move";
    
    @Input("dragInDocument")
    dragInDocument = (event: DragEvent) => true;
    
    @Output()
    onDragStart: EventEmitter<any> = new EventEmitter();
    
    @Output()
    onDragEnd: EventEmitter<any> = new EventEmitter();
    
    @Output()
    onDrag: EventEmitter<any> = new EventEmitter();
    
    private handle: any;
        
    constructor(
        private dataTransfer: DataTransfer,
        private el: ElementRef
    ) {
    }

    @HostListener('dragstart', ['$event']) 
    dragStart(event: any) {
        event.stopPropagation();

        const rect = this.el.nativeElement.getBoundingClientRect();
        const dragEvent: DragEvent = {
            medium: this.medium,
            node: this.el.nativeElement,
            clientX: event.clientX,
            clientY: event.clientY,
            offset: {
                x: event.clientX - rect.left, 
                y: event.clientY - rect.top
            }
        }
        if (this.dragInDocument(dragEvent)) {
            event.dataTransfer.effectAllowed = this.dragEffect;
            if (!this.isIE()) {
                event.dataTransfer.setData("makeItTick","true");// this is needed just to make drag/drop event trigger.
            }
            this.dataTransfer.setData("source", dragEvent);
            this.onDragStart.emit(dragEvent);
        }
    }
    private isIE() {
        const match = navigator.userAgent.search(/(?:Edge|MSIE|Trident\/.*; rv:)/);
        let isIE = false;
    
        if (match !== -1) {
            isIE = true;
        }
        return isIE;
    }
    
    @HostListener('document:dragover', ['$event']) 
    drag(event: any) {
        const dragEvent: DragEvent = this.dataTransfer.getData("source");

        dragEvent.clientX = event.clientX;
        dragEvent.clientY = event.clientY;
        
        if (this.dragInDocument(dragEvent)) {
            this.onDrag.emit(dragEvent);
        }
    }
    
    @HostListener('document:dragend', ['$event']) 
    dragEnd(event: any) {
        event.stopPropagation();
        const dragEvent: DragEvent = this.dataTransfer.getData("source");        
        this.onDragEnd.emit(dragEvent);
        this.el.nativeElement.classList.remove("drag-over");
    }
}
