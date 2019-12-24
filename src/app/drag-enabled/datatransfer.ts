/*
 * The main purpose for this object is to fix the short coming of drag event dataTransfer object.
 * It accepts only String values. However, if there is a need to pass an object, this singletoncan 
 * come to the resecue. 
 */
import { Injectable, Inject  } from '@angular/core';

@Injectable()
export class DataTransfer {
    
    private data: any = {};

    constructor() {}

    setData(name: string, value: any){
        this.data[name] = value;
    }

    getData(name: string) {
        return this.data[name];
    }
            
}