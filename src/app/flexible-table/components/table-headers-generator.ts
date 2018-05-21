/*
 * This object will traverse through a given json object and finds all the attributes of 
 * the object and its related associations within the json. The resulting structure would be 
 * name of attributes and a pathway to reach the attribute deep in object heirarchy.
 */

import { Injectable } from '@angular/core';

export interface VisualizationPoint {
  key: string,
  value: string
}

@Injectable()
export class TableHeadersGenerator {
  private headers = [];

  constructor() {
  }

  generateHeadersFor(root: {}, path: string, maxVisible: number, filteringEnabled: boolean) {

    if (root !== null) {
      Object.keys(root).map( (key) => {
        const innerPath = (path.length ? (path + "." + key) : key);
  
        if (typeof root[key] === "string" || typeof root[key] === "number" || typeof root[key] === "boolean") {
          const header: any = {
            key: innerPath,
            value: this.makeWords(innerPath),
            sortable: true,
            dragable: true,
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

  private makeWords(name) {
    return name
            .replace(/\./g,' ~ ')
            .replace(/([A-Z])/g, ' $1')
            .replace(/-/g," ")
            .replace(/_/g," ")
            .replace(/^./, (str) => str.toUpperCase());
  }
}
