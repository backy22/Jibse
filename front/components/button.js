const Button = ({onClick, buttonText, type}) => {
    return (
        <button
            onClick={onClick}
            type={type}
            className="text-green-300 border-green-300 rounded-md border-2 p-2"
        >
            {buttonText}
        </button>
    )
}

export default Button