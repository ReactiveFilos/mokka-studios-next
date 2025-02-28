import React, { createContext, useContext, useState } from "react";

import toast, { Toaster } from "react-hot-toast";

type NextToastProps = {
  message?: any;
  id?: string | undefined;
  ms?: number | null;
};

type ToastContextProps = {
  successToast: ({ message, id }: NextToastProps) => void;
  errorToast: ({ message, id }: NextToastProps) => void;
  loadingToast: ({ message, id, ms }: NextToastProps) => void;
  blankToast: ({ message, id }: NextToastProps) => void;
  dismissToast: ({ id }: NextToastProps) => void;
}

type ToastProviderProps = {
  children: React.ReactNode;
}

const styleToast = {
  background: "white",
  borderRadius: "0.85rem",
  boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.05)",
};

const ToastContext = createContext({} as ToastContextProps) as React.Context<ToastContextProps>;

const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toastIsActive, setToastIsActive] = useState<boolean>(false);

  const dismissToast = () => toastIsActive && toast.dismiss();

  const setToastOptions = (id: string | undefined = undefined) => ({
    id: id,
    onClose: () => setToastIsActive(false),
  });

  const success = ({ message, id }: NextToastProps) => {
    dismissToast();
    setToastIsActive(true);
    toast.success(message, setToastOptions(id));
  };

  const error = ({ message, id }: NextToastProps) => {
    dismissToast();
    setToastIsActive(true);
    toast.error(message, setToastOptions(id));
  };

  const loading = ({ message, id, ms }: NextToastProps) => {
    dismissToast();
    setToastIsActive(true);
    toast.loading(message, setToastOptions(id));
    if (ms) setTimeout(() => toast.dismiss(id), ms);
  };

  const blank = ({ message, id }: NextToastProps) => {
    dismissToast();
    setToastIsActive(true);
    toast(message, setToastOptions(id));
  };

  const dismiss = ({ id }: NextToastProps) => {
    toast.dismiss(id);
  };

  const contextValues: ToastContextProps = {
    successToast: success,
    errorToast: error,
    loadingToast: loading,
    blankToast: blank,
    dismissToast: dismiss,
  };

  return (
    <ToastContext.Provider value={contextValues}>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: styleToast
        }}
      />
      {children}
    </ToastContext.Provider>
  );
};

export const useNextToast = () => useContext(ToastContext);

export default ToastProvider;