import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  children: ReactNode;
};

type ContextType = {
  openModal: (Modal: ReactNode) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ContextType>({} as ContextType);

export function useModalContext() {
  return useContext(ModalContext);
}

export const ModalProvider = ({ children }: Props) => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [ModalNode, setModalNode] = useState<ReactNode>();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(`#modal`);
    setElement(el);
  }, []);

  const openModal = useCallback((Modal: ReactNode) => {
    setModalNode(Modal);
  }, []);

  const closeModal = useCallback(() => {
    setModalNode(null);
  }, []);

  useEffect(() => {
    setShowModal(true);
  }, []);

  if (!showModal || !element) {
    return null;
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {createPortal(ModalNode, element)}
    </ModalContext.Provider>
  );
};
