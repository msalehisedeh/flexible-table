export interface VisualizationPoint {
    key: string;
    value: string;
}
export declare class TableHeadersGenerator {
    private headers;
    constructor();
    generateHeadersFor(root: {}, path: string, maxVisible: number, filteringEnabled: boolean): any[];
    private makeWords(name);
}
