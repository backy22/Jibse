import Spinner from './spinner';

const Button = ({onClick, buttonText, type, isLoading}) => {
    return (
        <button
            onClick={onClick}
            type={type}
            className="w-40 text-green-300 border-green-300 rounded-md border-2 p-2 relative hover:bg-green-500 hover:text-white"
        >
            {buttonText}
            {isLoading && (
                <span className="absolute block" style={{ top: 0, right: '1rem' }}>
                    <Spinner />
                </span>
                )}
        </button>
    )
}

export default Button