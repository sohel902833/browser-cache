import ApiCacheStorageComponent from "./components/cache-storage/ApiCacheStorageComponent";
import FileCaching from "./components/cache-storage/FileCaching";
import RawDataCaching from "./components/cache-storage/RawCaching";

const App = () => {
    return (
        <div className="p-4">
            <ApiCacheStorageComponent />
            <RawDataCaching />
            <FileCaching />
        </div>
    );
};

export default App;
