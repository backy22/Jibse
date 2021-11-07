import ReactModal from 'react-modal'

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '60vw'
    },
    overlay: {
        background: 'rgba(24,24,24,0.7)'
    }
};

const Modal = ({ isOpen, setIsOpen, afterOpenModal, label, children }) => {
    function closeModal() {
        setIsOpen(false)
    }

    return (
        <ReactModal 
            isOpen={isOpen}
            onRequestClose={closeModal}
            onAfterOpen={afterOpenModal}
            style={customStyles}
            contentLabel={label}
            ariaHideApp={false}>
                {children}
        </ReactModal>
    )
}

export default Modal