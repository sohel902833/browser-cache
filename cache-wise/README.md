# browser-cache

A npm package to cache network request , images, files, json etc using browser default cache storage

## Installation

```
$ npm install cache-wise
$ yarn add cache-wise
```

## Features

-   Easy to set up for real, you can make it work in less than 10sec!
-   Super easy to customize
-   Save any kind of files
-   Save JSON
-   Save Api Response

## Demo

[A demo is worth a thousand words](https://fkhadra.github.io/react-toastify/introduction)

# Examples

### Cache Api

```
   import { BCache } from "cache-wise";
   const cachApi = new BCache();
        const data = await cachApi.get(url, {
            invalidAfter: INVALID_AFTER,
    });
```

### Save JSON Data

```
   import { BCache } from "cache-wise";
   const cacheApi = new BCache();
   cacheApi.saveJSON("key", {data:"It's super easy"});
```

### Get JSON DATA

```
   import { BCache } from "cache-wise";
   const cacheApi = new BCache();
   const res = await cacheApi.getJSON(inputData.key);
```

### GET ALL JSON FOR A SINGLE PARENT DB

```
   import { BCache } from "cache-wise";
   const cacheApi = new BCache();
   const res = await cacheApi.getAllJSON();
```

### DELETE JSON

```
   import { BCache } from "cache-wise";
   const cacheApi = new BCache();
   const res = await cacheApi.removeJSON("key");
```

### SAVE FILES

```
   import { BCache } from "cache-wise";
   const cacheApi = new BCache();
   await cache.saveFiles("KEY",FILES);
```

### GET SAVED FILES

```
   import { BCache } from "cache-wise";
   const cacheApi = new BCache();
   await cache.getFiles("KEY");
```
