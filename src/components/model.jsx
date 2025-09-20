import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 hover:bg-gray-700 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-400" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;