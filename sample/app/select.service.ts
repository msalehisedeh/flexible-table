import { Component } from '@angular/core';
import { PipeServiceComponentInterface } from '@sedeh/into-pipes';


@Component({
    template: ``,
    styles:[``]
})
export class SelectService implements PipeServiceComponentInterface {

    getDataFor(name: string, id: string, data: any) {
        return [
        'EURON',
        'FIREWAX',
        'HOMELUX',
        'MOMENTIA',
        'AQUASSEUR',
        'PROSURE',
        'RETROTEX',
        'OBLIQ',
        'AUSTECH',
        'GONKLE',
        'WAAB',
        'KNOWLYSIS',
        'UNCORP',
        'BALUBA',
        'ANDERSHUN',
        'BIOSPAN'
        ];
    }
}
      