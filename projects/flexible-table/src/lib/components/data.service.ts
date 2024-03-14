import { BehaviorSubject, Observable } from "rxjs";
import { PaginationInfo, RequestParameterInterface, DataServiceInterface, FlexibleTableHeader } from "../interfaces/flexible-table.interface";

/**
 * This service is a stub service and each application needs to extend it per needs. 
 * Basically it is allowing applications to do a server side or client side sorted and paginated data, 
 * then extension of this service will override getData method and call backend with fetch parameters to receive paginated results.
 */
export class DataService implements DataServiceInterface {
    private results: any[] = [];
    protected getRequestParams(headers:FlexibleTableHeader[]): RequestParameterInterface[] {
        const list: any[] = [];
        headers?.map((h: FlexibleTableHeader) => {
            const key = h.key;
            const filterBy = (h.selectedFilterOption ? h.selectedFilterOption : (h.filter ? h.filter: ''));
            const sortBy = h.sortable ? (h.ascending ? 'ascending' : h.descending ? 'descending' : '') : '';
            if (filterBy || sortBy) {
                list.push({key, filterBy, sortBy})
            }
            return ;
        });
        return list;
    }
    evaluateData(items: any[], headers: FlexibleTableHeader[]) {
        items?.map(
            (item: any) => {
                headers.map(
                    (header: FlexibleTableHeader) => {
                        if (header.format) {
                            const formats = typeof header.format === 'string' ? [header.format] : header.format;
                            const v = item[header.key];
                            formats.map(
                                (format: string) => {
                                    if (v && typeof v === 'string') {
                                        const f = format.split(':');
                                        if (f[0] === 'calendar') {
                                            item[header.key] = Date.parse(v);
                                        } else if (f[0] === 'date') {
                                            item[header.key] = Date.parse(v);
                                        } else if (f[0] === 'number') {
                                            item[header.key] = f.length > 2 ? parseFloat(v) : parseInt(v, 10);
                                        } else if (f[0] === 'currency') {
                                            item[header.key] = parseFloat(v.replace(/[^0-9\.-]+/g,""));
                                        }
                                    }
                                }
                            )
                        }
                    }
                )
            }
        )
    }

    getData(info: PaginationInfo, headers: FlexibleTableHeader[]): Observable<any[]> {
        const parameters: RequestParameterInterface[] = this.getRequestParams(headers);
        // use info to get pagination information and params to get sort order and 
        // filtering information and make an http requst all to get JSON response.
        return new BehaviorSubject(this.results);
    }
}