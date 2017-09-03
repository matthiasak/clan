export interface Observable {
    (x?: any): any;
    detach(x?: any): void;
    reattach(x?: any): void;
    map(Function: any): Observable;
    filter(Pred: any): Observable;
    then(Void: any): Observable;
    take(number: any): Observable;
    takeWhile(Pred: any): Observable;
    reduce(Reducer: any, any?: any): Observable;
    maybe(M: any): Observable[];
    stop(): void;
    refresh(): void;
    computed(): Observable;
    debounce(number: any): any;
    from(Function: any): Observable;
    union(...sources: Function[]): Observable;
    attach(component: Object, stateIdentifier: String, extraState: Object): Observable;
    scope(): Observable;
    root(): Observable;
    scoped: boolean;
    parent: Observable;
}
declare const obs: (state?: any) => Observable;
export default obs;
