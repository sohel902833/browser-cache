import BlobApi from "./blob-api";
import { ICacheGetApiRequestOptions, IJSONOptions } from "./type";
export class BCache {
    RESPONSE_VALIDITY = 60; //seconds
    RAW_DATA_KEY = "CUSTOM_DATA";
    FILE_CACHE_KEY = "FILE_CACHED_KEY";
    private fileConversion: BlobApi;
    constructor() {
        this.fileConversion = new BlobApi();
    }

    async get(api_url: string, options: ICacheGetApiRequestOptions) {
        const invalidAfter = options.invalidAfter;
        const reqHeaders = options.headers;
        const url = api_url;
        const expiary = invalidAfter ? invalidAfter : this.RESPONSE_VALIDITY;

        const cache = await caches.open(url);
        const cachedResponse = await cache.match(url);

        let finalResponse;
        let needToFetchFromOrigin = true;

        if (cachedResponse) {
            if (this.isResponseValid(cachedResponse)) {
                const clonedCachedResponse = cachedResponse.clone();
                const body = await clonedCachedResponse.json();
                needToFetchFromOrigin = false;
                console.log("Used cached response");
                finalResponse = body;
            } else {
                cache.delete(url);
            }
        }

        if (needToFetchFromOrigin) {
            const response = await fetch(url, {
                headers: reqHeaders,
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch data from ${url}`);
            }

            finalResponse = await this.addCachEntry(
                cache,
                response,
                expiary,
                url
            );
            console.log("Fetched from origin");
        }

        return finalResponse;
    }

    private addCachEntry = async (
        cache: Cache,
        response: Response,
        expiary: number,
        url: string
    ) => {
        const responseToCache = response.clone();
        const newData = await response.json();
        const body = responseToCache.body;

        const newHeaders = new Headers(responseToCache.headers);
        newHeaders.set("X_API_EXPIARY", this.getApiExpiary(expiary).toString());

        const newResponse = new Response(body, {
            status: responseToCache.status,
            statusText: responseToCache.statusText,
            headers: newHeaders,
        });
        await cache.put(url, newResponse);
        return newData;
    };
    private isResponseValid = (res: Response) => {
        const expiry = Number(res.headers.get("X_API_EXPIARY"));
        const currentTime = new Date().getTime();
        if (currentTime > expiry) {
            return false;
        }
        return true;
    };
    private getApiExpiary = (exp: number) => {
        return new Date().getTime() + exp * 1000;
    };
    saveJSON = async (key: string, data: any, options?: IJSONOptions) => {
        const cache = await caches.open(options?.CACHE_DB || this.RAW_DATA_KEY);
        const newResponse = new Response(JSON.stringify(data), {
            status: 200,
            statusText: "ok",
        });
        await cache.put(key, newResponse);
        console.log("New JSON Stored");
        return data;
    };

    getJSON = async (key: string, options?: IJSONOptions) => {
        const cache = await caches.open(options?.CACHE_DB || this.RAW_DATA_KEY);
        const data = await cache.match(key);
        const body = await data?.json();
        return body;
    };
    removeJSON = async (key: string, options?: IJSONOptions) => {
        const cache = await caches.open(options?.CACHE_DB || this.RAW_DATA_KEY);
        const res = await cache.delete(key);
        return res;
    };
    getAllJSON = async (dbName?: string) => {
        const cache = await caches.open(dbName || this.RAW_DATA_KEY);
        const requests = await cache.keys();
        const responses = await Promise.all(
            requests.map((request) => cache.match(request))
        );
        const finalResponse = await Promise.all(
            responses.map((data) => data?.json())
        );
        return finalResponse;
    };
    saveFiles = async (keyName: string, files: File[]) => {
        try {
            const cache = await caches.open(this.FILE_CACHE_KEY);

            //check input files
            // if (!Array.isArray(files)) {
            //     throw new Error(
            //         "Multiple files required or array instead of single"
            //     );
            // }
            const aggregatedBlob = await this.fileConversion.aggregateFiles(
                files
            );

            console.log("AGGREgetted files", aggregatedBlob);

            const fileResponse = new Response(aggregatedBlob);
            const requestUrl = `${keyName}`;
            const fileRequest = new Request(requestUrl);
            // Store the Request-Response pair in Cache Storage
            await cache.put(fileRequest, fileResponse);
            console.log(`File has been cached successfully.`);
            return files;
        } catch (error) {
            console.error("Error caching the file:", error);
        }
    };
    getFiles = async (key: string) => {
        try {
            const cache = await caches.open(this.FILE_CACHE_KEY);
            const response = await cache.match(key);

            if (response) {
                const fileBlob = await response.blob();
                console.log("File blob", fileBlob);
                const files = await this.fileConversion.parseAggregatedBlob(
                    fileBlob
                );

                return files;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    };
}
