import { useState } from "react";
import { toast } from "react-toastify";
import { BCache } from "cache-wise";
import TextInput from "../Input";

const RawDataCaching = () => {
    const [inputData, setInputData] = useState({ key: "", value: "" });
    const [result, setResult] = useState(null);
    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!inputData.key || !inputData.value) {
            toast.error("Please enter key and values");
            return;
        }
        const cacheApi = new BCache();
        cacheApi.saveJSON(inputData.key, inputData);
    };

    const fetchValue = async () => {
        if (!inputData.key) {
            toast.error("Please enter the key!");
            return;
        }
        const cacheApi = new BCache();
        const res = await cacheApi.getJSON(inputData.key);
        setResult(res);
    };
    const fetchAllValue = async () => {
        const cacheApi = new BCache();
        const res: any = await cacheApi.getAllJSON();
        setResult(res);
    };

    return (
        <div>
            <h1 className="py-2 text-lg font-bold">Raw Data Caching Example</h1>
            <hr />
            <br />
            <form onSubmit={handleSubmit}>
                <TextInput
                    error=""
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
                    placeholder="Value"
                    label="Value"
                    type="text"
                    value={inputData.value}
                    onChange={(e: any) =>
                        setInputData((prev) => ({
                            ...prev,
                            value: e.target.value,
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
                onClick={fetchValue}
                className="bg-purple-500 text-white rounded-md px-5 py-2 text-bold mt-4"
            >
                Get Data
            </button>

            <button
                onClick={fetchAllValue}
                className="bg-purple-500 text-white rounded-md px-5 py-2 text-bold mt-4"
            >
                Fetch all
            </button>
            <div className="bg-slate-200 rounded-md p-4">
                <pre>{JSON.stringify(result)}</pre>
            </div>
        </div>
    );
};

export default RawDataCaching;
