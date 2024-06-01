class BlobApi {
    async aggregateFiles(files: File[]) {
        const metadata = [];
        const blobs = [];

        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            metadata.push({
                name: file.name,
                type: file.type,
                size: arrayBuffer.byteLength,
            });
            blobs.push(new Blob([arrayBuffer]));
        }

        const metadataBlob = new Blob([JSON.stringify(metadata)], {
            type: "application/json",
        });
        const metadataSize = metadataBlob.size;

        const combinedBlobParts = [
            new Uint32Array([metadataSize]),
            metadataBlob,
            ...blobs,
        ];
        return new Blob(combinedBlobParts);
    }
    async parseAggregatedBlob(blob: Blob) {
        const arrayBuffer = await blob.arrayBuffer();
        const dataView = new DataView(arrayBuffer);
        let offset = 0;

        // Read metadata size
        const metadataSize = dataView.getUint32(offset, true);
        offset += 4;

        // Read metadata
        const metadataArrayBuffer = arrayBuffer.slice(
            offset,
            offset + metadataSize
        );
        const metadataText = new TextDecoder().decode(metadataArrayBuffer);
        const metadata = JSON.parse(metadataText);
        offset += metadataSize;

        // Read files
        const files = metadata.map((fileMeta: any) => {
            const fileBlob = new Blob(
                [arrayBuffer.slice(offset, offset + fileMeta.size)],
                { type: fileMeta.type }
            );
            offset += fileMeta.size;
            return {
                name: fileMeta.name,
                blob: fileBlob,
            };
        });

        return files;
    }
}

export default BlobApi;
