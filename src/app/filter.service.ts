import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Observable }    from 'rxjs/Rx';
import * as _ from 'lodash';

@Injectable()
export class FilterService {
    constructor() {}

    filter(object: any, filter_tree: any, tag="data"){
        let filtered = _.filter(object, (v: any) => {
            let obj = {};
            obj[tag] = v;
            return this._filter(obj, filter_tree);
        });

        return filtered;
    }

    _filter(object: any, filter_tree: any){
        // do not use console, it will cause lag if object is massive
        let left: any;
        let right: any;
        switch(filter_tree.type){
            case 'BinaryExpression':
                left = this._filter(object, filter_tree.left);
                right = this._filter(object, filter_tree.right);
                if( typeof left == 'string' &&
                    typeof right == 'string' &&
                    filter_tree.operator == '=='){
                    try {
                        return left.match(right);
                    } catch (err) {
                        return undefined;
                    }
                } else {
                    return eval(left + filter_tree.operator + right);
                }
            case 'Compound':
                // console.error("Unknown", filter_tree)
                return undefined;
            case 'Identifier':
                return object[filter_tree.name];
            case 'MemberExpression':
                left = this._filter(object, filter_tree.object);
                if(left == undefined){
                    return undefined;
                } else {
                    return left[filter_tree.property.name];
                }
            case 'Literal':
                return filter_tree.value;
            case 'ThisExpression':
                return undefined;
            case 'CallExpression':
                // console.error("Unknown", filter_tree)
                return undefined;
            case 'UnaryExpression':
                left = this._filter(object, filter_tree.argument);
                return eval(filter_tree.operator + left);
            case 'LogicalExpression':
                left = this._filter(object, filter_tree.left);
                right = this._filter(object, filter_tree.right);
                return eval(left + filter_tree.operator + right);
            case 'ConditionalExpression':
                left = this._filter(object, filter_tree.test);
                if(left){
                    return filter_tree.consequent.value;
                } else {
                    return filter_tree.alternate.value;
                }
            case 'ArrayExpression':
                // console.error("Unknown", filter_tree)
                return undefined;
        }
    }
}
