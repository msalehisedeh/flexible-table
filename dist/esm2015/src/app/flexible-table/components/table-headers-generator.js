/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/*
 * This object will traverse through a given json object and finds all the attributes of
 * the object and its related associations within the json. The resulting structure would be
 * name of attributes and a pathway to reach the attribute deep in object heirarchy.
 */
import { Injectable } from '@angular/core';
/**
 * @record
 */
export function VisualizationPoint() { }
/** @type {?} */
VisualizationPoint.prototype.key;
/** @type {?} */
VisualizationPoint.prototype.value;
export class TableHeadersGenerator {
    constructor() {
        this.headers = [];
    }
    /**
     * @param {?} root
     * @param {?} path
     * @param {?} maxVisible
     * @param {?} filteringEnabled
     * @return {?}
     */
    generateHeadersFor(root, path, maxVisible, filteringEnabled) {
        if (root !== null) {
            Object.keys(root).map((key) => {
                /** @type {?} */
                const innerPath = (path.length ? (path + "." + key) : key);
                if (typeof root[key] === "string" || typeof root[key] === "number" || typeof root[key] === "boolean") {
                    /** @type {?} */
                    const header = {
                        key: innerPath,
                        value: this.makeWords(innerPath),
                        sortable: true,
                        dragable: true,
                        present: (path.length === 0 && this.headers.length < maxVisible)
                    };
                    if (filteringEnabled) {
                        header.filter = "";
                    }
                    this.headers.push(header);
                }
                else if (root[key] instanceof Array) {
                    /** @type {?} */
                    const node = root[key];
                    if (node.length && !(node[0] instanceof Array) && (typeof node[0] !== "string")) {
                        this.generateHeadersFor(node[0], innerPath, maxVisible, filteringEnabled);
                    }
                    else {
                        this.headers.push({
                            key: innerPath,
                            value: this.makeWords(innerPath)
                        });
                    }
                }
                else {
                    this.generateHeadersFor(root[key], innerPath, maxVisible, filteringEnabled);
                }
            });
        }
        return this.headers;
    }
    /**
     * @param {?} key
     * @param {?} trackingkey
     * @return {?}
     */
    retreiveHeaders(key, trackingkey) {
        /** @type {?} */
        let result;
        try {
            result = localStorage.getItem(trackingkey);
            if (!result || result != key) {
                result = undefined; // we have a newer version and it will override saved data.
            }
            else {
                result = localStorage.getItem(key);
                result = result ? JSON.parse(result) : result;
            }
        }
        catch (e) {
        }
        return result;
    }
    /**
     * @param {?} key
     * @param {?} trackingkey
     * @param {?} headers
     * @return {?}
     */
    persistHeaders(key, trackingkey, headers) {
        try {
            localStorage.removeItem(trackingkey);
            localStorage.setItem(trackingkey, key);
            localStorage.setItem(key, JSON.stringify(headers));
        }
        catch (e) {
        }
    }
    /**
     * @param {?} name
     * @return {?}
     */
    makeWords(name) {
        return name
            .replace(/\./g, ' ~ ')
            .replace(/([A-Z])/g, ' $1')
            .replace(/-/g, " ")
            .replace(/_/g, " ")
            .replace(/^./, (str) => str.toUpperCase());
    }
}
TableHeadersGenerator.decorators = [
    { type: Injectable }
];
/** @nocollapse */
TableHeadersGenerator.ctorParameters = () => [];
if (false) {
    /** @type {?} */
    TableHeadersGenerator.prototype.headers;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtaGVhZGVycy1nZW5lcmF0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mbGV4aWJsZS10YWJsZS8iLCJzb3VyY2VzIjpbInNyYy9hcHAvZmxleGlibGUtdGFibGUvY29tcG9uZW50cy90YWJsZS1oZWFkZXJzLWdlbmVyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFNQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7Ozs7Ozs7QUFRM0MsTUFBTTtJQUdKO3VCQUZrQixFQUFFO0tBR25COzs7Ozs7OztJQUVELGtCQUFrQixDQUFDLElBQVEsRUFBRSxJQUFZLEVBQUUsVUFBa0IsRUFBRSxnQkFBeUI7UUFFdEYsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTs7Z0JBQzdCLE1BQU0sU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFM0QsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsSUFBSSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDOztvQkFDckcsTUFBTSxNQUFNLEdBQVE7d0JBQ2xCLEdBQUcsRUFBRSxTQUFTO3dCQUNkLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQzt3QkFDaEMsUUFBUSxFQUFFLElBQUk7d0JBQ2QsUUFBUSxFQUFFLElBQUk7d0JBQ2QsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLE1B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SUFBSSxFQUFDLEdBQUcsQ0FBQzthQUNqQixPQUFPLENBQUMsSUFBSSxFQUFDLEdBQUcsQ0FBQzthQUNqQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQzs7OztZQTFFdEQsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIFRoaXMgb2JqZWN0IHdpbGwgdHJhdmVyc2UgdGhyb3VnaCBhIGdpdmVuIGpzb24gb2JqZWN0IGFuZCBmaW5kcyBhbGwgdGhlIGF0dHJpYnV0ZXMgb2YgXHJcbiAqIHRoZSBvYmplY3QgYW5kIGl0cyByZWxhdGVkIGFzc29jaWF0aW9ucyB3aXRoaW4gdGhlIGpzb24uIFRoZSByZXN1bHRpbmcgc3RydWN0dXJlIHdvdWxkIGJlIFxyXG4gKiBuYW1lIG9mIGF0dHJpYnV0ZXMgYW5kIGEgcGF0aHdheSB0byByZWFjaCB0aGUgYXR0cmlidXRlIGRlZXAgaW4gb2JqZWN0IGhlaXJhcmNoeS5cclxuICovXHJcblxyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFZpc3VhbGl6YXRpb25Qb2ludCB7XHJcbiAga2V5OiBzdHJpbmcsXHJcbiAgdmFsdWU6IHN0cmluZ1xyXG59XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUYWJsZUhlYWRlcnNHZW5lcmF0b3Ige1xyXG4gIHByaXZhdGUgaGVhZGVycyA9IFtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICB9XHJcblxyXG4gIGdlbmVyYXRlSGVhZGVyc0Zvcihyb290OiB7fSwgcGF0aDogc3RyaW5nLCBtYXhWaXNpYmxlOiBudW1iZXIsIGZpbHRlcmluZ0VuYWJsZWQ6IGJvb2xlYW4pIHtcclxuXHJcbiAgICBpZiAocm9vdCAhPT0gbnVsbCkge1xyXG4gICAgICBPYmplY3Qua2V5cyhyb290KS5tYXAoIChrZXkpID0+IHtcclxuICAgICAgICBjb25zdCBpbm5lclBhdGggPSAocGF0aC5sZW5ndGggPyAocGF0aCArIFwiLlwiICsga2V5KSA6IGtleSk7XHJcbiAgXHJcbiAgICAgICAgaWYgKHR5cGVvZiByb290W2tleV0gPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHJvb3Rba2V5XSA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2Ygcm9vdFtrZXldID09PSBcImJvb2xlYW5cIikge1xyXG4gICAgICAgICAgY29uc3QgaGVhZGVyOiBhbnkgPSB7XHJcbiAgICAgICAgICAgIGtleTogaW5uZXJQYXRoLFxyXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy5tYWtlV29yZHMoaW5uZXJQYXRoKSxcclxuICAgICAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGRyYWdhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBwcmVzZW50OiAocGF0aC5sZW5ndGggPT09IDAgJiYgdGhpcy5oZWFkZXJzLmxlbmd0aCA8IG1heFZpc2libGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoZmlsdGVyaW5nRW5hYmxlZCkge1xyXG4gICAgICAgICAgICBoZWFkZXIuZmlsdGVyID0gXCJcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuaGVhZGVycy5wdXNoKGhlYWRlcik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChyb290W2tleV0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgY29uc3Qgbm9kZSA9IHJvb3Rba2V5XTtcclxuICAgICAgICAgIGlmIChub2RlLmxlbmd0aCAmJiAhKG5vZGVbMF0gaW5zdGFuY2VvZiBBcnJheSkgJiYgKHR5cGVvZiBub2RlWzBdICE9PSBcInN0cmluZ1wiKSkge1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlSGVhZGVyc0Zvcihub2RlWzBdLCBpbm5lclBhdGgsIG1heFZpc2libGUsIGZpbHRlcmluZ0VuYWJsZWQpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5oZWFkZXJzLnB1c2goe1xyXG4gICAgICAgICAgICAgIGtleTogaW5uZXJQYXRoLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0aGlzLm1ha2VXb3Jkcyhpbm5lclBhdGgpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuZ2VuZXJhdGVIZWFkZXJzRm9yKHJvb3Rba2V5XSwgaW5uZXJQYXRoLCBtYXhWaXNpYmxlLCBmaWx0ZXJpbmdFbmFibGVkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuaGVhZGVycztcclxuICB9XHJcblxyXG4gIHJldHJlaXZlSGVhZGVycyhrZXksIHRyYWNraW5na2V5KSB7XHJcbiAgICBsZXQgcmVzdWx0OiBhbnk7XHJcbiAgICB0cnkge1xyXG4gICAgICByZXN1bHQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0cmFja2luZ2tleSk7XHJcblxyXG4gICAgICBpZiAoIXJlc3VsdCB8fCByZXN1bHQgIT0ga2V5KSB7XHJcbiAgICAgICAgcmVzdWx0ID0gdW5kZWZpbmVkOyAvLyB3ZSBoYXZlIGEgbmV3ZXIgdmVyc2lvbiBhbmQgaXQgd2lsbCBvdmVycmlkZSBzYXZlZCBkYXRhLlxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0ID8gSlNPTi5wYXJzZShyZXN1bHQpIDogcmVzdWx0O1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcGVyc2lzdEhlYWRlcnMoa2V5LCB0cmFja2luZ2tleSwgaGVhZGVycykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odHJhY2tpbmdrZXkpO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0cmFja2luZ2tleSwga2V5KTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShoZWFkZXJzKSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1ha2VXb3JkcyhuYW1lKSB7XHJcbiAgICByZXR1cm4gbmFtZVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvXFwuL2csJyB+ICcpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvLS9nLFwiIFwiKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvXy9nLFwiIFwiKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiBzdHIudG9VcHBlckNhc2UoKSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==