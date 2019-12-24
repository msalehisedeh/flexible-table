/*
 * This object will traverse through a given json object and finds all the attributes of
 * the object and its related associations within the json. The resulting structure would be
 * name of attributes and a pathway to reach the attribute deep in object heirarchy.
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
let TableHeadersGenerator = class TableHeadersGenerator {
    constructor() {
        this.headers = [];
    }
    generateHeadersFor(root, path, maxVisible, filteringEnabled) {
        if (root !== null) {
            Object.keys(root).map((key) => {
                const innerPath = (path.length ? (path + "." + key) : key);
                if (typeof root[key] === "string" || typeof root[key] === "number" || typeof root[key] === "boolean") {
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
    retreiveHeaders(key, trackingkey) {
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
    persistHeaders(key, trackingkey, headers) {
        try {
            localStorage.removeItem(trackingkey);
            localStorage.setItem(trackingkey, key);
            localStorage.setItem(key, JSON.stringify(headers));
        }
        catch (e) {
        }
    }
    makeWords(name) {
        return name
            .replace(/\./g, ' ~ ')
            .replace(/([A-Z])/g, ' $1')
            .replace(/-/g, " ")
            .replace(/_/g, " ")
            .replace(/^./, (str) => str.toUpperCase());
    }
};
TableHeadersGenerator = tslib_1.__decorate([
    Injectable()
], TableHeadersGenerator);
export { TableHeadersGenerator };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtaGVhZGVycy1nZW5lcmF0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZmxleGlibGUtdGFibGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2NvbXBvbmVudHMvdGFibGUtaGVhZGVycy1nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRzs7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBUTNDLElBQWEscUJBQXFCLEdBQWxDLE1BQWEscUJBQXFCO0lBR2hDO1FBRlEsWUFBTyxHQUFHLEVBQUUsQ0FBQztJQUdyQixDQUFDO0lBRUQsa0JBQWtCLENBQUMsSUFBUSxFQUFFLElBQVksRUFBRSxVQUFrQixFQUFFLGdCQUF5QjtRQUV0RixJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDN0IsTUFBTSxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUUzRCxJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsSUFBSSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxFQUFFO29CQUNwRyxNQUFNLE1BQU0sR0FBUTt3QkFDbEIsR0FBRyxFQUFFLFNBQVM7d0JBQ2QsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO3dCQUNoQyxRQUFRLEVBQUUsSUFBSTt3QkFDZCxRQUFRLEVBQUUsSUFBSTt3QkFDZCxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFB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akMsVUFBVSxFQUFFO0dBQ0EscUJBQXFCLENBMkVqQztTQTNFWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBUaGlzIG9iamVjdCB3aWxsIHRyYXZlcnNlIHRocm91Z2ggYSBnaXZlbiBqc29uIG9iamVjdCBhbmQgZmluZHMgYWxsIHRoZSBhdHRyaWJ1dGVzIG9mIFxyXG4gKiB0aGUgb2JqZWN0IGFuZCBpdHMgcmVsYXRlZCBhc3NvY2lhdGlvbnMgd2l0aGluIHRoZSBqc29uLiBUaGUgcmVzdWx0aW5nIHN0cnVjdHVyZSB3b3VsZCBiZSBcclxuICogbmFtZSBvZiBhdHRyaWJ1dGVzIGFuZCBhIHBhdGh3YXkgdG8gcmVhY2ggdGhlIGF0dHJpYnV0ZSBkZWVwIGluIG9iamVjdCBoZWlyYXJjaHkuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBWaXN1YWxpemF0aW9uUG9pbnQge1xyXG4gIGtleTogc3RyaW5nLFxyXG4gIHZhbHVlOiBzdHJpbmdcclxufVxyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGFibGVIZWFkZXJzR2VuZXJhdG9yIHtcclxuICBwcml2YXRlIGhlYWRlcnMgPSBbXTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgfVxyXG5cclxuICBnZW5lcmF0ZUhlYWRlcnNGb3Iocm9vdDoge30sIHBhdGg6IHN0cmluZywgbWF4VmlzaWJsZTogbnVtYmVyLCBmaWx0ZXJpbmdFbmFibGVkOiBib29sZWFuKSB7XHJcblxyXG4gICAgaWYgKHJvb3QgIT09IG51bGwpIHtcclxuICAgICAgT2JqZWN0LmtleXMocm9vdCkubWFwKCAoa2V5KSA9PiB7XHJcbiAgICAgICAgY29uc3QgaW5uZXJQYXRoID0gKHBhdGgubGVuZ3RoID8gKHBhdGggKyBcIi5cIiArIGtleSkgOiBrZXkpO1xyXG4gIFxyXG4gICAgICAgIGlmICh0eXBlb2Ygcm9vdFtrZXldID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiByb290W2tleV0gPT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIHJvb3Rba2V5XSA9PT0gXCJib29sZWFuXCIpIHtcclxuICAgICAgICAgIGNvbnN0IGhlYWRlcjogYW55ID0ge1xyXG4gICAgICAgICAgICBrZXk6IGlubmVyUGF0aCxcclxuICAgICAgICAgICAgdmFsdWU6IHRoaXMubWFrZVdvcmRzKGlubmVyUGF0aCksXHJcbiAgICAgICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBkcmFnYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgcHJlc2VudDogKHBhdGgubGVuZ3RoID09PSAwICYmIHRoaXMuaGVhZGVycy5sZW5ndGggPCBtYXhWaXNpYmxlKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGZpbHRlcmluZ0VuYWJsZWQpIHtcclxuICAgICAgICAgICAgaGVhZGVyLmZpbHRlciA9IFwiXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmhlYWRlcnMucHVzaChoZWFkZXIpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocm9vdFtrZXldIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgIGNvbnN0IG5vZGUgPSByb290W2tleV07XHJcbiAgICAgICAgICBpZiAobm9kZS5sZW5ndGggJiYgIShub2RlWzBdIGluc3RhbmNlb2YgQXJyYXkpICYmICh0eXBlb2Ygbm9kZVswXSAhPT0gXCJzdHJpbmdcIikpIHtcclxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUhlYWRlcnNGb3Iobm9kZVswXSwgaW5uZXJQYXRoLCBtYXhWaXNpYmxlLCBmaWx0ZXJpbmdFbmFibGVkKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGVhZGVycy5wdXNoKHtcclxuICAgICAgICAgICAgICBrZXk6IGlubmVyUGF0aCxcclxuICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5tYWtlV29yZHMoaW5uZXJQYXRoKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmdlbmVyYXRlSGVhZGVyc0Zvcihyb290W2tleV0sIGlubmVyUGF0aCwgbWF4VmlzaWJsZSwgZmlsdGVyaW5nRW5hYmxlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmhlYWRlcnM7XHJcbiAgfVxyXG5cclxuICByZXRyZWl2ZUhlYWRlcnMoa2V5LCB0cmFja2luZ2tleSkge1xyXG4gICAgbGV0IHJlc3VsdDogYW55O1xyXG4gICAgdHJ5IHtcclxuICAgICAgcmVzdWx0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odHJhY2tpbmdrZXkpO1xyXG5cclxuICAgICAgaWYgKCFyZXN1bHQgfHwgcmVzdWx0ICE9IGtleSkge1xyXG4gICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDsgLy8gd2UgaGF2ZSBhIG5ld2VyIHZlcnNpb24gYW5kIGl0IHdpbGwgb3ZlcnJpZGUgc2F2ZWQgZGF0YS5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXN1bHQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xyXG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdCA/IEpTT04ucGFyc2UocmVzdWx0KSA6IHJlc3VsdDtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHBlcnNpc3RIZWFkZXJzKGtleSwgdHJhY2tpbmdrZXksIGhlYWRlcnMpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRyYWNraW5na2V5KTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odHJhY2tpbmdrZXksIGtleSk7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoaGVhZGVycykpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBtYWtlV29yZHMobmFtZSkge1xyXG4gICAgcmV0dXJuIG5hbWVcclxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcLi9nLCcgfiAnKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgLnJlcGxhY2UoLy0vZyxcIiBcIilcclxuICAgICAgICAgICAgLnJlcGxhY2UoL18vZyxcIiBcIilcclxuICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4gc3RyLnRvVXBwZXJDYXNlKCkpO1xyXG4gIH1cclxufVxyXG4iXX0=