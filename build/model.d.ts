export interface Model {
    is(type: any, value: any): boolean;
    check(types: object, required: object, data: object): boolean;
    init(types: object): ModelInstance;
    init(types: object, validator: Function): ModelInstance;
    init(types: object, required: object, validator: Function): ModelInstance;
    init(types: object, required: object): ModelInstance;
    ArrayOf(M: Function): ModelInstance;
}
export interface ModelInstance {
    isValid(data: object): boolean;
    whenValid(data: object): Promise<object>;
}
declare const model: Model;
export default model;
