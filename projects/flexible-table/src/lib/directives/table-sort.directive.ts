import {
    Directive,
    ElementRef,
    Input,
    Renderer2
} from '@angular/core';
import { FlexibleTableHeader } from '../interfaces/flexible-table.interface';

@Directive({
    selector: '[tableSort]'
})
export class TableSortDirective {
    
    @Input('medium')
    medium: any;
        
    @Input('headers')
    headers!: FlexibleTableHeader[];
        
    @Input()
    dropEffect = "move";
        
    @Input("tableSort")
    tableSort = (path: any) => {};

    constructor(
         private renderer: Renderer2,
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

	sort(icon: any) {
		if (this.medium.sortable) {
			for (let i = 0; i < this.headers.length ; i++) {
                const h = this.headers[i];

                if (h.key !== this.medium.key) {
					const item = this.findColumnWithID(h.key);

					if (item) {
                        this.renderer.removeClass(item, "ascending");
                        this.renderer.removeClass(item, "descending",);
                        this.renderer.addClass(item, "sortable");
					}
                    h.descending = false;
                    h.ascending = false;
				}
			}
            this.renderer.removeClass(icon, "fa-sort");
			if (this.medium.ascending || (!this.medium.ascending && !this.medium.descending)) {
				this.medium.descending = true;
				this.medium.ascending = false;
                this.renderer.removeClass(icon, "fa-sort-asc");
                this.renderer.addClass(icon, "fa-sort-desc");
			} else {
				this.medium.descending = false;
				this.medium.ascending = true;
                this.renderer.removeClass(icon, "fa-sort-desc");
                this.renderer.addClass(icon, "fa-sort-asc");
			}
			this.tableSort(this.medium.key.split("."));
		}
	}
}