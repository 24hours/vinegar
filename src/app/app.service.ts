import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class AppState {
    private _state: Map<string, Subject<any>> = new Map<string, Subject<any>>();

    constructor() { }

    notifyDataChanged(event: any, value: any) {
        let subscribers = this._state.get(event);
        if(subscribers !== undefined){
            subscribers.next(value);
        }
    }

    subscribe(event: string, callback: Function) {
        let subscribers = this._state.get(event);
        if(subscribers === undefined){
            subscribers = new Subject<any>();
            this._state.set(event, subscribers);
        }

        return (subscribers.asObservable()).subscribe((value: any) => {
            callback.call(null, value);
        });
    }
}
