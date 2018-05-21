export declare class ConfigurationComponent {
    showConfigurationView: boolean;
    title: string;
    action: string;
    headers: any[];
    private onchange;
    reconfigure(item: any, header: any): void;
    enableFilter(item: any, header: any): void;
    keyup(event: any): void;
}
