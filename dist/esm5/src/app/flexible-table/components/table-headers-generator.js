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
var TableHeadersGenerator = /** @class */ (function () {
    function TableHeadersGenerator() {
        this.headers = [];
    }
    /**
     * @param {?} root
     * @param {?} path
     * @param {?} maxVisible
     * @param {?} filteringEnabled
     * @return {?}
     */
    TableHeadersGenerator.prototype.generateHeadersFor = /**
     * @param {?} root
     * @param {?} path
     * @param {?} maxVisible
     * @param {?} filteringEnabled
     * @return {?}
     */
    function (root, path, maxVisible, filteringEnabled) {
        var _this = this;
        if (root !== null) {
            Object.keys(root).map(function (key) {
                /** @type {?} */
                var innerPath = (path.length ? (path + "." + key) : key);
                if (typeof root[key] === "string" || typeof root[key] === "number" || typeof root[key] === "boolean") {
                    /** @type {?} */
                    var header = {
                        key: innerPath,
                        value: _this.makeWords(innerPath),
                        sortable: true,
                        dragable: true,
                        present: (path.length === 0 && _this.headers.length < maxVisible)
                    };
                    if (filteringEnabled) {
                        header.filter = "";
                    }
                    _this.headers.push(header);
                }
                else if (root[key] instanceof Array) {
                    /** @type {?} */
                    var node = root[key];
                    if (node.length && !(node[0] instanceof Array) && (typeof node[0] !== "string")) {
                        _this.generateHeadersFor(node[0], innerPath, maxVisible, filteringEnabled);
                    }
                    else {
                        _this.headers.push({
                            key: innerPath,
                            value: _this.makeWords(innerPath)
                        });
                    }
                }
                else {
                    _this.generateHeadersFor(root[key], innerPath, maxVisible, filteringEnabled);
                }
            });
        }
        return this.headers;
    };
    /**
     * @param {?} key
     * @param {?} trackingkey
     * @return {?}
     */
    TableHeadersGenerator.prototype.retreiveHeaders = /**
     * @param {?} key
     * @param {?} trackingkey
     * @return {?}
     */
    function (key, trackingkey) {
        /** @type {?} */
        var result;
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
    };
    /**
     * @param {?} key
     * @param {?} trackingkey
     * @param {?} headers
     * @return {?}
     */
    TableHeadersGenerator.prototype.persistHeaders = /**
     * @param {?} key
     * @param {?} trackingkey
     * @param {?} headers
     * @return {?}
     */
    function (key, trackingkey, headers) {
        try {
            localStorage.removeItem(trackingkey);
            localStorage.setItem(trackingkey, key);
            localStorage.setItem(key, JSON.stringify(headers));
        }
        catch (e) {
        }
    };
    /**
     * @param {?} name
     * @return {?}
     */
    TableHeadersGenerator.prototype.makeWords = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        return name
            .replace(/\./g, ' ~ ')
            .replace(/([A-Z])/g, ' $1')
            .replace(/-/g, " ")
            .replace(/_/g, " ")
            .replace(/^./, function (str) { return str.toUpperCase(); });
    };
    TableHeadersGenerator.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    TableHeadersGenerator.ctorParameters = function () { return []; };
    return TableHeadersGenerator;
}());
export { TableHeadersGenerator };
if (false) {
    /** @type {?} */
    TableHeadersGenerator.prototype.headers;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtaGVhZGVycy1nZW5lcmF0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mbGV4aWJsZS10YWJsZS8iLCJzb3VyY2VzIjpbInNyYy9hcHAvZmxleGlibGUtdGFibGUvY29tcG9uZW50cy90YWJsZS1oZWFkZXJzLWdlbmVyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFNQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7Ozs7Ozs7O0lBV3pDO3VCQUZrQixFQUFFO0tBR25COzs7Ozs7OztJQUVELGtEQUFrQjs7Ozs7OztJQUFsQixVQUFtQixJQUFRLEVBQUUsSUFBWSxFQUFFLFVBQWtCLEVBQUUsZ0JBQXlCO1FBQXhGLGlCQWtDQztRQWhDQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBRSxVQUFDLEdBQUc7O2dCQUN6QixJQUFNLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRTNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsSUFBSSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQzs7b0JBQ3JHLElBQU0sTUFBTSxHQUFRO3dCQUNsQixHQUFHLEVBQUUsU0FBUzt3QkFDZCxLQUFLLEVBQUUsS0FBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUM7d0JBQ2hDLFFBQVEsRUFBRSxJQUFJO3dCQUNkLFFBQVEsRUFBRSxJQUFJO3dCQUNkLE9BQU8sRUFBRSxDQUFDLElBQUks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VSxFQUFFLEtBQUssQ0FBQzthQUMxQixPQUFPLENBQUMsSUFBSSxFQUFDLEdBQUcsQ0FBQzthQUNqQixPQUFPLENBQUMsSUFBSSxFQUFDLEdBQUcsQ0FBQzthQUNqQixPQUFPLENBQUMsSUFBSSxFQUFFLFVBQUMsR0FBRyxJQUFLLE9BQUEsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7OztnQkExRXRELFVBQVU7Ozs7Z0NBYlg7O1NBY2EscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogVGhpcyBvYmplY3Qgd2lsbCB0cmF2ZXJzZSB0aHJvdWdoIGEgZ2l2ZW4ganNvbiBvYmplY3QgYW5kIGZpbmRzIGFsbCB0aGUgYXR0cmlidXRlcyBvZiBcclxuICogdGhlIG9iamVjdCBhbmQgaXRzIHJlbGF0ZWQgYXNzb2NpYXRpb25zIHdpdGhpbiB0aGUganNvbi4gVGhlIHJlc3VsdGluZyBzdHJ1Y3R1cmUgd291bGQgYmUgXHJcbiAqIG5hbWUgb2YgYXR0cmlidXRlcyBhbmQgYSBwYXRod2F5IHRvIHJlYWNoIHRoZSBhdHRyaWJ1dGUgZGVlcCBpbiBvYmplY3QgaGVpcmFyY2h5LlxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVmlzdWFsaXphdGlvblBvaW50IHtcclxuICBrZXk6IHN0cmluZyxcclxuICB2YWx1ZTogc3RyaW5nXHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRhYmxlSGVhZGVyc0dlbmVyYXRvciB7XHJcbiAgcHJpdmF0ZSBoZWFkZXJzID0gW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gIH1cclxuXHJcbiAgZ2VuZXJhdGVIZWFkZXJzRm9yKHJvb3Q6IHt9LCBwYXRoOiBzdHJpbmcsIG1heFZpc2libGU6IG51bWJlciwgZmlsdGVyaW5nRW5hYmxlZDogYm9vbGVhbikge1xyXG5cclxuICAgIGlmIChyb290ICE9PSBudWxsKSB7XHJcbiAgICAgIE9iamVjdC5rZXlzKHJvb3QpLm1hcCggKGtleSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlubmVyUGF0aCA9IChwYXRoLmxlbmd0aCA/IChwYXRoICsgXCIuXCIgKyBrZXkpIDoga2V5KTtcclxuICBcclxuICAgICAgICBpZiAodHlwZW9mIHJvb3Rba2V5XSA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2Ygcm9vdFtrZXldID09PSBcIm51bWJlclwiIHx8IHR5cGVvZiByb290W2tleV0gPT09IFwiYm9vbGVhblwiKSB7XHJcbiAgICAgICAgICBjb25zdCBoZWFkZXI6IGFueSA9IHtcclxuICAgICAgICAgICAga2V5OiBpbm5lclBhdGgsXHJcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLm1ha2VXb3Jkcyhpbm5lclBhdGgpLFxyXG4gICAgICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgZHJhZ2FibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHByZXNlbnQ6IChwYXRoLmxlbmd0aCA9PT0gMCAmJiB0aGlzLmhlYWRlcnMubGVuZ3RoIDwgbWF4VmlzaWJsZSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChmaWx0ZXJpbmdFbmFibGVkKSB7XHJcbiAgICAgICAgICAgIGhlYWRlci5maWx0ZXIgPSBcIlwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnB1c2goaGVhZGVyKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJvb3Rba2V5XSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICBjb25zdCBub2RlID0gcm9vdFtrZXldO1xyXG4gICAgICAgICAgaWYgKG5vZGUubGVuZ3RoICYmICEobm9kZVswXSBpbnN0YW5jZW9mIEFycmF5KSAmJiAodHlwZW9mIG5vZGVbMF0gIT09IFwic3RyaW5nXCIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVIZWFkZXJzRm9yKG5vZGVbMF0sIGlubmVyUGF0aCwgbWF4VmlzaWJsZSwgZmlsdGVyaW5nRW5hYmxlZCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmhlYWRlcnMucHVzaCh7XHJcbiAgICAgICAgICAgICAga2V5OiBpbm5lclBhdGgsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRoaXMubWFrZVdvcmRzKGlubmVyUGF0aClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5nZW5lcmF0ZUhlYWRlcnNGb3Iocm9vdFtrZXldLCBpbm5lclBhdGgsIG1heFZpc2libGUsIGZpbHRlcmluZ0VuYWJsZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5oZWFkZXJzO1xyXG4gIH1cclxuXHJcbiAgcmV0cmVpdmVIZWFkZXJzKGtleSwgdHJhY2tpbmdrZXkpIHtcclxuICAgIGxldCByZXN1bHQ6IGFueTtcclxuICAgIHRyeSB7XHJcbiAgICAgIHJlc3VsdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRyYWNraW5na2V5KTtcclxuXHJcbiAgICAgIGlmICghcmVzdWx0IHx8IHJlc3VsdCAhPSBrZXkpIHtcclxuICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7IC8vIHdlIGhhdmUgYSBuZXdlciB2ZXJzaW9uIGFuZCBpdCB3aWxsIG92ZXJyaWRlIHNhdmVkIGRhdGEuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcclxuICAgICAgICByZXN1bHQgPSByZXN1bHQgPyBKU09OLnBhcnNlKHJlc3VsdCkgOiByZXN1bHQ7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwZXJzaXN0SGVhZGVycyhrZXksIHRyYWNraW5na2V5LCBoZWFkZXJzKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0cmFja2luZ2tleSk7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRyYWNraW5na2V5LCBrZXkpO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KGhlYWRlcnMpKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgbWFrZVdvcmRzKG5hbWUpIHtcclxuICAgIHJldHVybiBuYW1lXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXC4vZywnIH4gJylcclxuICAgICAgICAgICAgLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC8tL2csXCIgXCIpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC9fL2csXCIgXCIpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHN0ci50b1VwcGVyQ2FzZSgpKTtcclxuICB9XHJcbn1cclxuIl19