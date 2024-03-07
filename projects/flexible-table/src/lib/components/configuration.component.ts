/*
* Provides ability to configure displaying of table columns. As per definition of earch header component,
* a column could be hidden.
*/
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FlexibleTableHeader } from '../interfaces/flexible-table.interface';
import { ComponentPool } from '@sedeh/into-pipes';

@Component({
	selector: 'table-configuration',
	templateUrl: './configuration.component.html',
	styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent {
    showConfigurationView!: boolean;
	formatOptions: any[] = [];
	
	@Input("title")
	public title!: string | undefined;

	@Input("locking")
	public locking = false;

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

	constructor(private pool: ComponentPool) {
		const map = this.pool.getRegisteredPatterns();
		Object.keys(map).map(
			(key: string) => {
				const item = map[key];
				if (item instanceof Array) {
					if (item.length > 1) {
						item.map((option: string, index: number) => this.formatOptions.push({key, label: key + ' option ' + index, value: option}))
					} else {
						this.formatOptions.push({key, label: key, value: item[0]});
					}
				} else {
					this.formatOptions.push({key, label: key, value: item});
				}
			}
		)
	}

	private emitChange(type: string, header: FlexibleTableHeader) {
		const index = this.headers.indexOf(header);
		this.onconfigurationchange.emit({action: type, sourceIndex: index, headers: this.headers});
	}
	reconfigure(item: any, header: any) {
        header.present = item.checked;
		this.emitChange('column display status changed', header);
	}
	isArray(format: any) {
		return format && (format instanceof Array);
	}

	enableFilter(input: any, header: FlexibleTableHeader) {
        if (input.checked) {
			header.filter = "";
		} else {
			delete header.filter;
		}
		this.emitChange('filter changed', header);
	}

	enableLock(input: any, header: FlexibleTableHeader) {
		header.lockable = !header.lockable;
		this.emitChange('column lock status changed', header);
	}
	changeFormat(event: any, header: FlexibleTableHeader) {
		const index = event.target.selectedIndex;
		header.format = index > 0 ? this.formatOptions[index - 1].value : '';
		this.emitChange('format changed', header);
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
