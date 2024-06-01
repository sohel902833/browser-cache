import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TextInput from "../Input";
import { BCache } from "cache-wise";
const ApiCacheStorageComponent = () => {
    const [inputData, setInputData] = useState({
        url: "https://jsonplaceholder.typicode.com/todos/1",
    });
    const [result, setResult] = useState(null);

    const makeApiReq = async () => {
        const INVALID_AFTER = 60;
        if (!inputData.url) {
            toast.error("Please enter api url");
            return;
        }
        const { url } = inputData;
        const cachApi = new BCache();
        const data = await cachApi.get(url, {
            invalidAfter: INVALID_AFTER,
        });
        return data;
    };
    useEffect(() => {
        const fetchFirst = async () => {
            const result = await makeApiReq();
            setResult(result);
        };
        fetchFirst();
    }, []);
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const result = await makeApiReq();
        setResult(result);
    };
    return (
        <div>
            <h1 className="py-2 text-lg font-bold">API Caching Example</h1>
            <hr />
            <br />
            <form onSubmit={handleSubmit}>
                <TextInput
                    placeholder="Api url"
                    label="Api url"
                    type="text"
                    value={inputData.url}
                    onChange={(e: any) =>
                        setInputData((prev) => ({
                            ...prev,
                            url: e.target.value,
                        }))
                    }
                />
                <button
                    className="bg-blue-500 text-white rounded-md px-5 py-2 text-bold"
                    type="submit"
                >
                    Fetch
                </button>
            </form>
            <br />
            <br />
            <div className="bg-slate-200 rounded-md p-4">
                <pre>{JSON.stringify(result)}</pre>
            </div>
            <br />
        </div>
    );
};

export default ApiCacheStorageComponent;
