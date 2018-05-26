export interface VisualizationPoint {
    key: string;
    value: string;
}
export declare class TableHeadersGenerator {
    private headers;
    constructor();
    generateHeadersFor(root: {}, path: string, maxVisible: number, filteringEnabled: boolean): any[];
    retreiveHeaders(key: any, trackingkey: any): any;
    persistHeaders(key: any, trackingkey: any, headers: any): void;
    private makeWords(name);
}
