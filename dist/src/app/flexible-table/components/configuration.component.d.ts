export declare class ConfigurationComponent {
    showConfigurationView: boolean;
    title: string;
    action: string;
    printTable: string;
    headers: any[];
    configAddon: any;
    private onchange;
    private onprint;
    reconfigure(item: any, header: any): void;
    enableFilter(item: any, header: any): void;
    print(event: any): void;
    keyup(event: any): void;
}
