import { useState } from "react";
import { toast } from "react-toastify";
import { BCache } from "cache-wise";
import TextInput from "../Input";

const FileCaching = () => {
    const [inputData, setInputData] = useState({ key: "", files: [] });
    const [result, setResult] = useState<any>(null);
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!inputData.key || inputData.files.length === 0) {
            toast.error("Please enter key and select the files");
            return;
        }
        const cache = new BCache();
        const result = await cache.saveFiles(inputData.key, inputData.files);
        console.log("Saved Files", result);
    };
    const fetchFiles = async () => {
        if (!inputData.key) {
            toast.error("Please enter the key!");
            return;
        }
        const cache = new BCache();
        const res = await cache.getFiles(inputData.key);
        console.log(res);
        setResult(res);
    };
    // const fetchAllValue = async () => {
    //     const BCache = new BCache();
    //     const res = await BCache.getAllData();
    //     setResult(res);
    // };

    return (
        <div className="mt-4">
            <h1 className="py-2 text-lg font-bold">File Caching Example</h1>
            <hr />
            <br />
            <form onSubmit={handleSubmit}>
                <TextInput
                    placeholder="Key name"
                    label="Key name"
                    type="text"
                    value={inputData.key}
                    onChange={(e: any) =>
                        setInputData((prev) => ({
                            ...prev,
                            key: e.target.value,
                        }))
                    }
                />
                <br />
                <TextInput
                    rest={{ multiple: true }}
                    placeholder="Files"
                    label="Files"
                    type="file"
                    onChange={(e: any) =>
                        setInputData((prev) => ({
                            ...prev,
                            files: e.target.files,
                        }))
                    }
                />
                <div className="flex items-center gap-2">
                    <button
                        className="bg-blue-500 text-white rounded-md px-5 py-2 text-bold"
                        type="submit"
                    >
                        Store Data
                    </button>
                </div>
            </form>
            <button
                onClick={fetchFiles}
                className="bg-purple-500 text-white rounded-md px-5 py-2 text-bold mt-4"
            >
                Fetch Files
            </button>
            {/* 
          

            <button
                onClick={fetchAllValue}
                className="bg-purple-500 text-white rounded-md px-5 py-2 text-bold mt-4"
            >
                Fetch all
            </button> */}
            <div className="bg-slate-200 rounded-md p-4">
                <div>
                    {result && result?.length > 0 && (
                        <div>
                            {result?.map((file: any) => {
                                const url = URL.createObjectURL(file.blob);
                                const contentType = file.blob.type;
                                const name = file.name;
                                console.log(file);

                                if (contentType.startsWith("image/")) {
                                    return (
                                        <div>
                                            <h1>{name}</h1>
                                            <img
                                                className="h-20 w-20 object-cover"
                                                src={url}
                                            />
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div>
                                            <h1>{name}</h1>
                                            <button
                                                onClick={() => {
                                                    console.log(
                                                        "Download file"
                                                    );
                                                }}
                                                className="bg-purple-500 text-white rounded-md px-5 py-2 text-bold mt-2"
                                            >
                                                Download
                                            </button>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileCaching;
