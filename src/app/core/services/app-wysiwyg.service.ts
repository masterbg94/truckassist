import { Subject } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WysiwygService {
    public updateField = new Subject<void>();
    constructor() {}
}

