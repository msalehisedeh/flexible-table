/*
 * This object will traverse through a given json object and finds all the attributes of
 * the object and its related associations within the json. The resulting structure would be
 * name of attributes and a pathway to reach the attribute deep in object heirarchy.
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
var TableHeadersGenerator = /** @class */ (function () {
    function TableHeadersGenerator() {
        this.headers = [];
    }
    TableHeadersGenerator.prototype.generateHeadersFor = function (root, path, maxVisible, filteringEnabled) {
        var _this = this;
        if (root !== null) {
            Object.keys(root).map(function (key) {
                var innerPath = (path.length ? (path + "." + key) : key);
                if (typeof root[key] === "string" || typeof root[key] === "number" || typeof root[key] === "boolean") {
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
    TableHeadersGenerator.prototype.retreiveHeaders = function (key, trackingkey) {
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
    TableHeadersGenerator.prototype.persistHeaders = function (key, trackingkey, headers) {
        try {
            localStorage.removeItem(trackingkey);
            localStorage.setItem(trackingkey, key);
            localStorage.setItem(key, JSON.stringify(headers));
        }
        catch (e) {
        }
    };
    TableHeadersGenerator.prototype.makeWords = function (name) {
        return name
            .replace(/\./g, ' ~ ')
            .replace(/([A-Z])/g, ' $1')
            .replace(/-/g, " ")
            .replace(/_/g, " ")
            .replace(/^./, function (str) { return str.toUpperCase(); });
    };
    TableHeadersGenerator = tslib_1.__decorate([
        Injectable()
    ], TableHeadersGenerator);
    return TableHeadersGenerator;
}());
export { TableHeadersGenerator };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtaGVhZGVycy1nZW5lcmF0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZmxleGlibGUtdGFibGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2NvbXBvbmVudHMvdGFibGUtaGVhZGVycy1nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRzs7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBUTNDO0lBR0U7UUFGUSxZQUFPLEdBQUcsRUFBRSxDQUFDO0lBR3JCLENBQUM7SUFFRCxrREFBa0IsR0FBbEIsVUFBbUIsSUFBUSxFQUFFLElBQVksRUFBRSxVQUFrQixFQUFFLGdCQUF5QjtRQUF4RixpQkFrQ0M7UUFoQ0MsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFFLFVBQUMsR0FBRztnQkFDekIsSUFBTSxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUUzRCxJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsSUFBSSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxFQUFFO29CQUNwRyxJQUFNLE1BQU0sR0FBUTt3QkFDbEIsR0FBRyxFQUFFLFNBQVM7d0JBQ2QsS0FBSyxFQUFFLEtBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO3dCQUNoQyxRQUFRLEVBQUUsSUFBSTt3QkFDZCxRQUFRLEVBQUUsSUFBSTt3QkFDZCxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxLQUFJ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VUFBVSxFQUFFO09BQ0EscUJBQXFCLENBMkVqQztJQUFELDRCQUFDO0NBQUEsQUEzRUQsSUEyRUM7U0EzRVkscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogVGhpcyBvYmplY3Qgd2lsbCB0cmF2ZXJzZSB0aHJvdWdoIGEgZ2l2ZW4ganNvbiBvYmplY3QgYW5kIGZpbmRzIGFsbCB0aGUgYXR0cmlidXRlcyBvZiBcclxuICogdGhlIG9iamVjdCBhbmQgaXRzIHJlbGF0ZWQgYXNzb2NpYXRpb25zIHdpdGhpbiB0aGUganNvbi4gVGhlIHJlc3VsdGluZyBzdHJ1Y3R1cmUgd291bGQgYmUgXHJcbiAqIG5hbWUgb2YgYXR0cmlidXRlcyBhbmQgYSBwYXRod2F5IHRvIHJlYWNoIHRoZSBhdHRyaWJ1dGUgZGVlcCBpbiBvYmplY3QgaGVpcmFyY2h5LlxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVmlzdWFsaXphdGlvblBvaW50IHtcclxuICBrZXk6IHN0cmluZyxcclxuICB2YWx1ZTogc3RyaW5nXHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRhYmxlSGVhZGVyc0dlbmVyYXRvciB7XHJcbiAgcHJpdmF0ZSBoZWFkZXJzID0gW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gIH1cclxuXHJcbiAgZ2VuZXJhdGVIZWFkZXJzRm9yKHJvb3Q6IHt9LCBwYXRoOiBzdHJpbmcsIG1heFZpc2libGU6IG51bWJlciwgZmlsdGVyaW5nRW5hYmxlZDogYm9vbGVhbikge1xyXG5cclxuICAgIGlmIChyb290ICE9PSBudWxsKSB7XHJcbiAgICAgIE9iamVjdC5rZXlzKHJvb3QpLm1hcCggKGtleSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlubmVyUGF0aCA9IChwYXRoLmxlbmd0aCA/IChwYXRoICsgXCIuXCIgKyBrZXkpIDoga2V5KTtcclxuICBcclxuICAgICAgICBpZiAodHlwZW9mIHJvb3Rba2V5XSA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2Ygcm9vdFtrZXldID09PSBcIm51bWJlclwiIHx8IHR5cGVvZiByb290W2tleV0gPT09IFwiYm9vbGVhblwiKSB7XHJcbiAgICAgICAgICBjb25zdCBoZWFkZXI6IGFueSA9IHtcclxuICAgICAgICAgICAga2V5OiBpbm5lclBhdGgsXHJcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLm1ha2VXb3Jkcyhpbm5lclBhdGgpLFxyXG4gICAgICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgZHJhZ2FibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHByZXNlbnQ6IChwYXRoLmxlbmd0aCA9PT0gMCAmJiB0aGlzLmhlYWRlcnMubGVuZ3RoIDwgbWF4VmlzaWJsZSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChmaWx0ZXJpbmdFbmFibGVkKSB7XHJcbiAgICAgICAgICAgIGhlYWRlci5maWx0ZXIgPSBcIlwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnB1c2goaGVhZGVyKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJvb3Rba2V5XSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICBjb25zdCBub2RlID0gcm9vdFtrZXldO1xyXG4gICAgICAgICAgaWYgKG5vZGUubGVuZ3RoICYmICEobm9kZVswXSBpbnN0YW5jZW9mIEFycmF5KSAmJiAodHlwZW9mIG5vZGVbMF0gIT09IFwic3RyaW5nXCIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVIZWFkZXJzRm9yKG5vZGVbMF0sIGlubmVyUGF0aCwgbWF4VmlzaWJsZSwgZmlsdGVyaW5nRW5hYmxlZCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmhlYWRlcnMucHVzaCh7XHJcbiAgICAgICAgICAgICAga2V5OiBpbm5lclBhdGgsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRoaXMubWFrZVdvcmRzKGlubmVyUGF0aClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5nZW5lcmF0ZUhlYWRlcnNGb3Iocm9vdFtrZXldLCBpbm5lclBhdGgsIG1heFZpc2libGUsIGZpbHRlcmluZ0VuYWJsZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5oZWFkZXJzO1xyXG4gIH1cclxuXHJcbiAgcmV0cmVpdmVIZWFkZXJzKGtleSwgdHJhY2tpbmdrZXkpIHtcclxuICAgIGxldCByZXN1bHQ6IGFueTtcclxuICAgIHRyeSB7XHJcbiAgICAgIHJlc3VsdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRyYWNraW5na2V5KTtcclxuXHJcbiAgICAgIGlmICghcmVzdWx0IHx8IHJlc3VsdCAhPSBrZXkpIHtcclxuICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7IC8vIHdlIGhhdmUgYSBuZXdlciB2ZXJzaW9uIGFuZCBpdCB3aWxsIG92ZXJyaWRlIHNhdmVkIGRhdGEuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcclxuICAgICAgICByZXN1bHQgPSByZXN1bHQgPyBKU09OLnBhcnNlKHJlc3VsdCkgOiByZXN1bHQ7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwZXJzaXN0SGVhZGVycyhrZXksIHRyYWNraW5na2V5LCBoZWFkZXJzKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0cmFja2luZ2tleSk7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRyYWNraW5na2V5LCBrZXkpO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KGhlYWRlcnMpKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgbWFrZVdvcmRzKG5hbWUpIHtcclxuICAgIHJldHVybiBuYW1lXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXC4vZywnIH4gJylcclxuICAgICAgICAgICAgLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC8tL2csXCIgXCIpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC9fL2csXCIgXCIpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHN0ci50b1VwcGVyQ2FzZSgpKTtcclxuICB9XHJcbn1cclxuIl19