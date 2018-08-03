import { Component } from '@angular/core';
import { PipeServiceComponent } from 'into-pipes';


@Component({})
export class SelectService implements PipeServiceComponent {

    getDataFor(name, id, data) {
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
      