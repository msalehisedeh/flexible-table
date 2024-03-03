/*
* Provides ability to configure displaying of table columns. As per definition of earch header component,
* a column could be hidden.
*/
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FlexibleTableHeader } from '../interfaces/flexible-table.interface';

@Component({
	selector: 'table-configuration',
	templateUrl: './configuration.component.html',
	styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent {
    showConfigurationView!: boolean;

	@Input("title")
	public title!: string | undefined;

	@Input("action")
	public action!: string | undefined;

	@Input("printTable")
	public printTable!: string | undefined;
	
	@Input("headers")
	public headers!: FlexibleTableHeader[];

	@Input("configAddon")
	public configAddon: any;

	@Output('onconfigurationchange')
	private onconfigurationchange = new EventEmitter();

	@Output('onprint')
	private onprint = new EventEmitter();

	reconfigure(item: any, header: any) {
        header.present = item.checked;
		this.onconfigurationchange.emit(this.headers);
	}

	enableFilter(item: any, header: FlexibleTableHeader) {
        if (header.filter === undefined) {
			header.filter = "";
		} else {
			delete header.filter;
		}
		this.onconfigurationchange.emit(this.headers);
	}

	print(event: any) {
		this.onprint.emit(true);
	}

    keyup(event: any) {
        const code = event.which;
        if (code === 13) {
			event.target.click();
		}
    }
}
