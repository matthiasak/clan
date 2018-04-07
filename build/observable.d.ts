export interface Observable {
    (any?: any, Function?: any): any;
    detach(any?: any): void;
    reattach(any?: any): void;
    map(Function: any): Observable;
    tryMap(Function: any): Observable;
    filter(Pred: any): Observable;
    then(Void: any): Observable;
    take(number: any): Observable;
    takeWhile(Pred: any): Observable;
    reduce(Reducer: any, any?: any): Observable;
    maybe(M: any, number?: any): Observable;
    stop(): void;
    refresh(): Observable;
    computed(): Observable;
    debounce(number: any): any;
    from(Function: any): Observable;
    union(...sources: Function[]): Observable;
    attach(component: Object, stateIdentifier: String, extraState: Object): Observable;
    scope(): Observable;
    root(): Observable;
    scoped: boolean;
    parent: Observable;
    triggerRoot(x?: any): void;
}
declare const obs: (state?: any, handler?: any) => Observable;
export default obs;
