/*
* Provides ability to configure displaying of table columns. As per definition of earch header component,
* a column could be hidden.
*/
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'table-configuration',
	templateUrl: './configuration.component.html',
	styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent {
    showConfigurationView: boolean;

	@Input() title: string;
	@Input() action: string;
	@Input() printTable: string;
	@Input() headers: any[];
	@Input() configAddon: any;

	@Output() private onchange = new EventEmitter();
	@Output() private onprint = new EventEmitter();

	reconfigure(item, header) {
        header.present = item.checked;
		this.onchange.emit(this.headers);
	}

	enableFilter(item, header) {
        if (header.filter === undefined) {
			header.filter = "";
		} else {
			delete header.filter;
		}
		this.onchange.emit(this.headers);
	}

	print(event) {
		this.onprint.emit(true);
	}

    keyup(event) {
        const code = event.which;
        if (code === 13) {
			event.target.click();
		}
    }
}
