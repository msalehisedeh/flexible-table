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
    selector: '[dragEnabled]',
    host: {
        '[draggable]': 'true'
    }
})
export class DragDirective {
    
    @Input("medium")
    medium: any;
    
    @Input("dragEffect")
    dragEffect = "move";
    
    @Input("dragEnabled")
    dragEnabled = (event: DragEvent) => true;
    
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
        if (this.dragEnabled(dragEvent)) {
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

    @HostListener('dragover', ['$event']) 
    drag(event: any) {
        const dragEvent: DragEvent = this.dataTransfer.getData("source");

        dragEvent.clientX = event.clientX;
        dragEvent.clientY = event.clientY;
        
        if (this.dragEnabled(dragEvent)) {
            this.onDrag.emit(dragEvent);
        }
    }
    
    @HostListener('dragend', ['$event']) 
    dragEnd(event: any) {
        event.stopPropagation();
        const dragEvent: DragEvent = this.dataTransfer.getData("source");        
        this.onDragEnd.emit(dragEvent);
        this.el.nativeElement.classList.remove("drag-over");
    }
}
