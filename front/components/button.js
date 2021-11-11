import Spinner from './spinner';

const Button = ({onClick, buttonText, type, isLoading, disabled}) => {
    const hoverAction = disabled ? '' : 'hover:bg-green-500 hover:text-white'
    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={`w-full text-green-300 border-green-300 rounded-md border-2 p-2 relative ${hoverAction} disabled:opacity-50`}
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