/*
 * This object will traverse through a given json object and finds all the attributes of 
 * the object and its related associations within the json. The resulting structure would be 
 * name of attributes and a pathway to reach the attribute deep in object heirarchy.
 */

import { Injectable } from '@angular/core';
import { FlexibleTableHeader } from '../interfaces/flexible-table.interface';

export interface VisualizationPoint {
  key: string,
  value: string
}

@Injectable()
export class TableHeadersGenerator {
  private headers: any[] = [];

  constructor() {
  }

  generateHeadersFor(root: any, path: string, maxVisible: number, filteringEnabled: boolean) {

    if (root !== null) {
      Object.keys(root).map( (key) => {
        const innerPath = (path.length ? (path + "." + key) : key);
  
        if (typeof root[key] === "string" || typeof root[key] === "number" || typeof root[key] === "boolean") {
          const header: FlexibleTableHeader = {
            key: innerPath,
            value: this.makeWords(innerPath),
            sortable: true,
            dragable: true,
            disabled: false,
            active: true,
            present: (path.length === 0 && this.headers.length < maxVisible)
          }
          if (filteringEnabled) {
            header.filter = "";
          }
          this.headers.push(header);
        } else if (root[key] instanceof Array) {
          const node = root[key];
          if (node.length && !(node[0] instanceof Array) && (typeof node[0] !== "string")) {
            this.generateHeadersFor(node[0], innerPath, maxVisible, filteringEnabled);
          } else {
            this.headers.push({
              key: innerPath,
              value: this.makeWords(innerPath)
            })
          }
        } else {
          this.generateHeadersFor(root[key], innerPath, maxVisible, filteringEnabled);
        }
      });
    }
    return this.headers;
  }

  retreiveHeaders(key: any, trackingkey: any) {
    let result: any;
    try {
      result = localStorage.getItem(trackingkey);

      if (!result || result != key) {
        result = undefined; // we have a newer version and it will override saved data.
      } else {
        result = localStorage.getItem(key);
        result = result ? JSON.parse(result) : result;
      }
    } catch (e) {
    }
    return result;
  }

  persistHeaders(key: any, trackingkey: any, headers: any) {
    try {
      localStorage.removeItem(trackingkey);
      localStorage.setItem(trackingkey, key);
      localStorage.setItem(key, JSON.stringify(headers));
    } catch (e) {
    }
  }

  private makeWords(name: any) {
    return name
            .replace(/\./g,' ~ ')
            .replace(/([A-Z])/g, ' $1')
            .replace(/-/g," ")
            .replace(/_/g," ")
            .replace(/^./, (str: string) => str.toUpperCase());
  }
}
