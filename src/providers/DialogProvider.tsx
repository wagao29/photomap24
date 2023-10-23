import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  children: ReactNode;
};

type ContextType = {
  openDialog: (Dialog: ReactNode) => void;
  closeDialog: () => void;
};

const DialogContext = createContext<ContextType>({} as ContextType);

export function useDialogContext() {
  return useContext(DialogContext);
}

export const DialogProvider = ({ children }: Props) => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [DialogNode, setDialogNode] = useState<ReactNode>();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(`#dialog`);
    setElement(el);
  }, []);

  const openDialog = useCallback((Dialog: ReactNode) => {
    setDialogNode(Dialog);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogNode(null);
  }, []);

  useEffect(() => {
    setShowDialog(true);
  }, []);

  if (!showDialog || !element) {
    return null;
  }

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      {createPortal(DialogNode, element)}
    </DialogContext.Provider>
  );
};
