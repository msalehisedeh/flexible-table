import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    Output,
    Renderer,
    EventEmitter
} from '@angular/core';

@Directive({
    selector: '[tableSort]'
})
export class TableSortDirective {
    
    @Input('medium')
    medium: any;
        
    @Input('headers')
    headers: any;
        
    @Input()
    dropEffect = "move";
        
    @Input("tableSort")
    tableSort = (path) => {};

    constructor(
         private renderer: Renderer,
        private el: ElementRef
    ) {}
    
    private headerColumnElements() {
		return this.el.nativeElement.parentNode.children;
    }

    private findColumnWithID(id: string) {
        const list = this.headerColumnElements();
		let column = null;
		for (let i = 0; i < list.length; i++) {
			if (list[i].getAttribute("id") === id) {
				column = list[i];
				break;
			}
		}
		return column;
	}

	sort(icon) {
		if (this.medium.sortable) {
			for (let i = 0; i < this.headers.length ; i++) {
                const h = this.headers[i];

                if (h.key !== this.medium.key) {
					const item = this.findColumnWithID(h.key);

					if (item) {
                        this.renderer.setElementClass(item, "ascending", false);
                        this.renderer.setElementClass(item, "descending", false);
                        this.renderer.setElementClass(item, "sortable", true);
					}
                    h.descending = false;
                    h.ascending = false;
				}
			}
            this.renderer.setElementClass(icon, "fa-sort", false);
			if (this.medium.ascending || (!this.medium.ascending && !this.medium.descending)) {
				this.medium.descending = true;
				this.medium.ascending = false;
                this.renderer.setElementClass(icon, "fa-sort-asc", false);
                this.renderer.setElementClass(icon, "fa-sort-desc", true);
			} else {
				this.medium.descending = false;
				this.medium.ascending = true;
                this.renderer.setElementClass(icon, "fa-sort-desc", false);
                this.renderer.setElementClass(icon, "fa-sort-asc", true);
			}
			this.tableSort(this.medium.key.split("."));
		}
	}
}