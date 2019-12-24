import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import { DataTransfer } from './datatransfer';
import { DropEvent } from './drag-drop.interfaces';


@Directive({
    selector: '[dropEnabled]'
})
export class DropDirective {
    
    @Input('medium')
    medium: any;
        
    @Input()
    dropEffect = "move";
        
    @Input("dropEnabled")
    dropEnabled = (event: DropEvent) => true;

    @Output()
    onDragEnter: EventEmitter<any> = new EventEmitter();
    
    @Output()
    onDragLeave: EventEmitter<any> = new EventEmitter();
    
    @Output()
    onDrop: EventEmitter<any> = new EventEmitter();
    
    @Output()
    onDragOver: EventEmitter<any> = new EventEmitter();

    constructor(
        private dataTransfer: DataTransfer,
        private el: ElementRef
    ) {}
    
	private createDropEvent(event: any): DropEvent {
		return {
            source: this.dataTransfer.getData("source"),
            destination: {
                medium: this.medium,
                node: this.el.nativeElement,
                clientX: event.clientX,
                clientY: event.clientY
            }
		};
	}

    @HostListener('drop', ['$event'])
    drop(event: any) {
        event.preventDefault();
        const dropEvent = this.createDropEvent(event);

        this.el.nativeElement.classList.remove("drag-over");

        if (this.dropEnabled(dropEvent)) {
            this.onDrop.emit(dropEvent);
        }
    }
    
    @HostListener('dragenter', ['$event']) 
    dragEnter(event: any) {
        event.preventDefault();
        const dropEvent = this.createDropEvent(event);

        if (this.dropEnabled(dropEvent)) {
            event.dataTransfer.dropEffect = this.dropEffect;

            this.el.nativeElement.classList.add("drag-over");
            this.onDragEnter.emit(dropEvent);
        } else {
            this.el.nativeElement.classList.remove("drag-over");
        }
    }
    
    @HostListener('dragleave', ['$event']) 
    dragLeave(event: any) {
        event.preventDefault();
                
        this.el.nativeElement.classList.remove("drag-over");
        this.onDragLeave.emit(event);
    }
    
    @HostListener('dragover', ['$event']) 
    dragOver(event: any) {
        const dropEvent = this.createDropEvent(event);

        if (this.dropEnabled(dropEvent)) {
            event.preventDefault();
            this.el.nativeElement.classList.add("drag-over");
            this.onDragOver.emit(dropEvent);
        } else {
            this.el.nativeElement.classList.remove("drag-over");
        }
    }
}