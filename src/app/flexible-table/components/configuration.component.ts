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

	@Input("title")
	public title: string;

	@Input("action")
	public action: string;

	@Input("headers")
	public headers: any[];

	@Output('onchange')
	private onchange = new EventEmitter();

	reconfigure(item, header) {
        header.present = item.checked;
		this.onchange.emit(this.headers);
	}

    keyup(event) {
        const code = event.which;
        if (code === 13) {
			event.target.click();
		}
    }
}
