interface Props {
    type: string;
    placeholder: string;
    error?: string;
    label: string;
    required?: boolean;
    rest?: any;
    value?: any;
    onChange?: any;
}
const TextInput = ({
    type,
    placeholder,
    error,
    label,
    required,
    rest,
    value,
    onChange,
}: Props) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            <p className="dark:text-black text-black p-2 text-xl">
                {label}
                {required && " *"}
            </p>
            <input
                className="bg-transparent focus:bg-transparent border-2 rounded-lg border-green-900 px-4 py-4 w-full focus:outline-none text-black dark:text-white font-bold text-xl"
                type={type ? type : "text"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...rest}
            />
            <p className="text-red-500">{error}</p>
        </div>
    );
};

export default TextInput;
