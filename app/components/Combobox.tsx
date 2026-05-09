'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Search, ChevronDown, Check } from 'lucide-react'
import { cn } from '../lib/utils'

interface Option {
  id: string | number
  label: string
}

interface ComboboxProps {
  name: string
  options: Option[]
  placeholder?: string
  defaultValue?: string | number
  required?: boolean
  className?: string
}

export default function Combobox({
  name,
  options,
  placeholder = 'Select an option...',
  defaultValue,
  required = false,
  className,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | number | undefined>(defaultValue)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = useMemo(
    () => options.find((opt) => opt.id.toString() === selectedId?.toString()),
    [options, selectedId]
  )

  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (id: string | number) => {
    setSelectedId(id)
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <div className={cn('relative w-full', className)} ref={containerRef}>
      <input type='hidden' name={name} value={selectedId || ''} required={required} />

      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700'
      >
        <span className={cn('truncate', !selectedOption && 'text-zinc-400')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn('h-4 w-4 text-zinc-500 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className='absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-zinc-200 bg-white p-1 shadow-lg animate-in fade-in zoom-in-95 dark:border-zinc-800 dark:bg-zinc-900'>
          <div className='sticky top-0 mb-1 flex items-center border-b border-zinc-100 bg-white px-2 py-1.5 dark:border-zinc-800 dark:bg-zinc-900'>
            <Search className='mr-2 h-4 w-4 text-zinc-400' />
            <input
              autoFocus
              className='w-full bg-transparent text-sm outline-none placeholder:text-zinc-400 dark:text-zinc-100'
              placeholder='Search...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className='space-y-0.5'>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt.id}
                  type='button'
                  onClick={() => handleSelect(opt.id)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800',
                    selectedId?.toString() === opt.id.toString() && 'bg-zinc-50 font-medium text-zinc-900 dark:bg-zinc-800/50 dark:text-zinc-100'
                  )}
                >
                  <span className='truncate'>{opt.label}</span>
                  {selectedId?.toString() === opt.id.toString() && <Check className='h-4 w-4' />}
                </button>
              ))
            ) : (
              <div className='px-2 py-4 text-center text-sm text-zinc-500 dark:text-zinc-400'>
                No options found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
