import { Observable, Subject } from "rxjs";
import { v4 as uuid } from "uuid";
import * as config from "../../globalVars";

//Require approval for buy/sell/sending bitclout
const accessLevel = 3;
const outboundRequests: {
    [index: string]: Subject<any>;
} = {};
const storageGranted = new Subject();
let initialized = false;
let pendingRequests: Subject<any>[] = [];
let identityWindow: Window | null;
let identityWindowSubject: Subject<any> | null;
let iframe: HTMLIFrameElement | null;

let importingIdentities: any[];

const launch = (path?: string, params?: { publicKey?: string; tx?: string }): Observable<any> => {
    let url = config.identityURL;
    if (path) {
        url += path;
    }
    let prepend = true;
    let httpParams = "";

    if (params?.publicKey) {
        httpParams = httpParams.concat(`${prepend ? "?" : "&"}publicKey=${params.publicKey}`);
        prepend = false;
    }
    if (params?.tx) {
        httpParams = httpParams.concat(`${prepend ? "?" : "&"}tx=${params.tx}`);
        prepend = false;
    }
    if (path === "/log-in") {
        httpParams = httpParams.concat(`${prepend ? "?" : "&"}accessLevelRequest=${accessLevel}`);
    }
    url += httpParams;
    // center the window
    const h = 600;
    const w = 600;
    const y = window.outerHeight / 2 + window.screenY - h / 2;
    const x = window.outerWidth / 2 + window.screenX - w / 2;
    identityWindowSubject = new Subject();
    identityWindow = window.open(url, undefined, `toolbar=no, width=${w}, height=${h}, top=${y}, left=${x}`);

    return identityWindowSubject;
};

const sign = (payload: { accessLevel: number; accessLevelHmac: string; encryptedSeedHex: string; transactionHex: string }): Observable<any> => {
    return send("sign", payload);
};

const decrypt = (payload: { accessLevel: number; accessLevelHmac: string; encryptedSeedHex: string; encryptedHexes: string[] }): Observable<any> => {
    return send("decrypt", payload);
};

const jwt = (payload: { accessLevel: number; accessLevelHmac: string; encryptedSeedHex: string }): Observable<any> => {
    return send("jwt", payload);
};

const handleInitialize = (event: MessageEvent) => {
    if (!initialized) {
        initialized = true;
        iframe = document.getElementById("identity") as HTMLIFrameElement;
        for (const request of pendingRequests) {
            postMessage(request);
        }
        pendingRequests = [];
    }

    // acknowledge, provides hostname data
    respond(event.source as Window, event.data.id, {});
};

const handleStorageGranted = () => {
    storageGranted.next(true);
    storageGranted.complete();
};
const handleLogin = (payload: any) => {
    if (identityWindow) {
        identityWindow.close();
        // identityWindow = null
    }

    if (identityWindowSubject) {
        identityWindowSubject.next(payload);
        identityWindowSubject.complete();
        // identityWindowSubject = null
    }
};

const handleImport = (id: string) => {
    identityWindow &&
        respond(identityWindow, id, {
            identities: importingIdentities,
        });
};

const handleInfo = (id: string) => {
    identityWindow && respond(identityWindow, id, {});
};

const handleRequest = (event: MessageEvent) => {
    const {
        data: { id, method, payload },
    } = event;

    if (method === "initialize") {
        handleInitialize(event);
    } else if (method === "storageGranted") {
        handleStorageGranted();
    } else if (method === "login") {
        handleLogin(payload);
    } else if (method === "import") {
        handleImport(id);
    } else if (method === "info") {
        handleInfo(id);
    } else {
        console.error("Unhandled identity request");
        console.error(event);
    }
};

const handleResponse = (event: MessageEvent) => {
    const {
        data: { id, payload },
    } = event;

    const req = outboundRequests[id];
    if (req) {
        req.next(payload);
        req.complete();
        delete outboundRequests[id];
    }
};

const send = (method: string, payload: any) => {
    const req = {
        id: uuid(),
        method,
        payload,
        service: "identity",
    };

    const subject = new Subject();
    postMessage(req);
    outboundRequests[req.id] = subject;

    return subject;
};

const postMessage = (req: any) => {
    if (initialized && iframe) {
        // @ts-ignore: Object is possibly 'null'.
        iframe.contentWindow.postMessage(req, "*");
    } else {
        pendingRequests.push(req);
    }
};

// Respond to a received message
const respond = (window: Window, id: string, payload: any): void => {
    window && window.postMessage({ id, service: "identity", payload }, "*");
};

const identityHandler = (event: MessageEvent) => {
    const { service, method } = event.data;
    if (service !== "identity") {
        return;
    }
    if (method) {
        handleRequest(event);
    } else {
        handleResponse(event);
    }
};

export { identityHandler, launch, jwt, sign };
