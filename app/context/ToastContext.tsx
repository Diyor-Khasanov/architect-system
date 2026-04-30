'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Toast, CustomDialog, ToastType, ToastProps, DialogProps } from '../components/Toast'

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
  alert: (message: string, title?: string) => Promise<void>
  confirm: (message: string, title?: string) => Promise<boolean>
  prompt: (message: string, defaultValue?: string, title?: string) => Promise<string | null>
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Omit<ToastProps, 'onClose'>[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dialog, setDialog] = useState<(DialogProps & { resolve: (val: any) => void }) | null>(null)

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, type, message }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const alert = useCallback((message: string, title = 'Notification') => {
    return new Promise<void>((resolve) => {
      setDialog({
        type: 'alert',
        title,
        message,
        onConfirm: () => {
          setDialog(null)
          resolve()
        },
        onCancel: () => {
          setDialog(null)
          resolve()
        },
        resolve,
      })
    })
  }, [])

  const confirm = useCallback((message: string, title = 'Confirmation') => {
    return new Promise<boolean>((resolve) => {
      setDialog({
        type: 'confirm',
        title,
        message,
        onConfirm: () => {
          setDialog(null)
          resolve(true)
        },
        onCancel: () => {
          setDialog(null)
          resolve(false)
        },
        resolve,
      })
    })
  }, [])

  const prompt = useCallback((message: string, defaultValue = '', title = 'Input Required') => {
    return new Promise<string | null>((resolve) => {
      setDialog({
        type: 'prompt',
        title,
        message,
        defaultValue,
        onConfirm: (value) => {
          setDialog(null)
          resolve(value ?? null)
        },
        onCancel: () => {
          setDialog(null)
          resolve(null)
        },
        resolve,
      })
    })
  }, [])

  return (
    <ToastContext.Provider value={{ toast: showToast, alert, confirm, prompt }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[110] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast {...t} onClose={removeToast} />
          </div>
        ))}
      </div>

      {/* Dialog Overlay */}
      {dialog && <CustomDialog {...dialog} />}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
