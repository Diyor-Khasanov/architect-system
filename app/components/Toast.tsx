'use client'

import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastProps {
  id: string
  type: ToastType
  message: string
  onClose: (id: string) => void
}

export function Toast({ id, type, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, 5000)
    return () => clearTimeout(timer)
  }, [id, onClose])

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
  }

  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-lg animate-in fade-in slide-in-from-right-4 duration-300 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-zinc-950/50"
    >
      {icons[type]}
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="ml-auto rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export interface DialogProps {
  type: 'alert' | 'confirm' | 'prompt'
  title: string
  message: string
  defaultValue?: string
  onConfirm: (value?: string) => void
  onCancel: () => void
}

export function CustomDialog({ type, title, message, defaultValue = '', onConfirm, onCancel }: DialogProps) {
  const [value, setValue] = useState(defaultValue)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  // Simple focus trapping
  useEffect(() => {
    const focusableElements = dialogRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusableElements && focusableElements.length > 0) {
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      const handleTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus()
              e.preventDefault()
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus()
              e.preventDefault()
            }
          }
        }
      }
      window.addEventListener('keydown', handleTab)
      return () => window.removeEventListener('keydown', handleTab)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && type !== 'prompt') {
          onCancel()
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200 dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="p-6">
          <h3 id="dialog-title" className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">{title}</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{message}</p>

          {type === 'prompt' && (
            <input
              autoFocus
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-4 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-700 dark:focus:ring-zinc-700"
              onKeyDown={(e) => {
                if (e.key === 'Enter') onConfirm(value)
              }}
            />
          )}
        </div>
        <div className="flex justify-end gap-3 bg-zinc-50 px-6 py-4 border-t border-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800">
          {(type === 'confirm' || type === 'prompt') && (
            <button
              onClick={onCancel}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-200 transition-colors dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
          )}
          <button
            autoFocus={type !== 'prompt'}
            onClick={() => onConfirm(type === 'prompt' ? value : undefined)}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity dark:bg-zinc-100 dark:text-zinc-900"
          >
            {type === 'confirm' ? 'Confirm' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  )
}
