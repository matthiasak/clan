export declare const cookie: (context: any) => any;
export declare const sendFile: (context: any) => any;
export declare const benchmark: (message: any) => (context: any) => any;
export declare const body: (ctx: any) => any;
export declare const send: (context: any) => any;
export declare const route: (type: any) => (url: any, action: any) => (context: any) => any;
export declare const get: (url: any, action: any) => (context: any) => any;
export declare const put: (url: any, action: any) => (context: any) => any;
export declare const post: (url: any, action: any) => (context: any) => any;
export declare const del: (url: any, action: any) => (context: any) => any;
export declare const patch: (url: any, action: any) => (context: any) => any;
export declare const option: (url: any, action: any) => (context: any) => any;
export declare const serve: (folder?: string, route?: string, cache?: boolean, age?: number) => (context: any) => any;
export declare const server: (pipe: any, port?: number, timeout?: number, keepAlive?: number) => void;
export declare const http: (pipe: any, port?: number, timeout?: number, keepAlive?: number) => void;
