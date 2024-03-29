import { Observable } from "rxjs";

export interface VocabularyInterface {
    configureTable?: string;
    configureColumns?: string;
    clickSort?: string;
    setSize: string;
    firstPage: string;
    lastPage: string;
    previousPage: string;
    nextPage?: string;
    printTable?: string;
}

export interface StylePositionInterface {
    type: string;
    item?: any;
    header?: FlexibleTableHeader;
}
export interface RequestParameterInterface {
    key: string;
    filterBy: string;
    sortBy: string;
}
export interface StyleServiceInterface {
    styleFor(location: StylePositionInterface): string;
}
export interface DataServiceInterface {
    evaluateData(items: any[], headers: FlexibleTableHeader[]):void;
    getData(info: PaginationInfo, headers: FlexibleTableHeader[]): Observable<any[]>;
}
export interface PaginationInfo {
    defaultSize: number;
	contentSize: number;
	pageSize: number;
	pages: number;
	from: number;
	to: number;
	currentPage: number;
    resetSize?: boolean
}
export interface FlexibleTableHeader {
	key: string;
	value: string;
	present: boolean;
	width?: string;
	minwidth?: string;
	format?: string | string[];
	hideOnPrint?:boolean;
	filter?: string;
    filterOptions?: string[];
    selectedFilterOption?: string;
	dragable?: boolean;
	dropable?: boolean;
	sortable?: boolean;
    ascending?: boolean;
    descending?: boolean;
	class?:string;
	locked?:boolean;
    lockable?: boolean;
    active: boolean;
    disabled: boolean;
    validate?: (tem: any, value: any) => boolean;
    style?: (tem: any) => string;

}
export enum PaginationType {
    none = 0,
    floating = 1,
    ontop = 2,
    onbottom = 3,
    topbottom = 4
}
export interface CellEditInfo {
    index: number;
    header: FlexibleTableHeader; 
    key: string;
    value: string;
    type: string;
    item: any;
    tableInfo: any;
}
export interface FilteredItemsInfo {
    filters: any[],
    items: any;
    tableInfo: any;
}
export interface ActionEventInfo {
    action: string;
    row: any;
    index: number;
    tableInfo: any;
}
export interface ChangedtemsInfo {
    headers: FlexibleTableHeader[];
    action: string;
    sourceIndex: number;
    destinationIndex?: number;
    tableInfo: any;
}