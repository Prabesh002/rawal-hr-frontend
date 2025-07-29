import type React from "react"

import { useState, useRef, useEffect, type KeyboardEvent } from "react"
import { ChevronDown, X, Search } from "lucide-react"

interface SelectItem {
  [key: string]: any
}

interface CustomSelectProps<T extends SelectItem> {
  items: T[]
  valueKey: keyof T
  labelKey: keyof T
  placeholder?: string
  searchable?: boolean
  multiSelect?: boolean
  disabled?: boolean
  className?: string
  value?: T | T[] | null
  onChange?: (value: T | T[] | null) => void
  onSearch?: (query: string) => void
  maxHeight?: string
  searchPlaceholder?: string
  noResultsText?: string
  clearable?: boolean
}

export default function CustomSelect<T extends SelectItem>({
  items,
  valueKey,
  labelKey,
  placeholder = "Select an option...",
  searchable = false,
  multiSelect = false,
  disabled = false,
  className = "",
  value = null,
  onChange,
  onSearch,
  maxHeight = "max-h-60",
  searchPlaceholder = "Search...",
  noResultsText = "No results found",
  clearable = true,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [filteredItems, setFilteredItems] = useState<T[]>(items)

  const selectRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items)
      return
    }

    const filtered = items.filter((item) => String(item[labelKey]).toLowerCase().includes(searchQuery.toLowerCase()))
    setFilteredItems(filtered)
    setHighlightedIndex(-1)

    if (onSearch) {
      onSearch(searchQuery)
    }
  }, [searchQuery, items, labelKey, onSearch])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery("")
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, searchable])

  const handleToggle = () => {
    if (disabled) return
    setIsOpen(!isOpen)
    if (!isOpen) {
      setSearchQuery("")
      setHighlightedIndex(-1)
    }
  }

  const handleSelect = (item: T) => {
    if (multiSelect) {
      const currentValue = Array.isArray(value) ? value : []
      const isSelected = currentValue.some((v) => v[valueKey] === item[valueKey])

      let newValue: T[]
      if (isSelected) {
        newValue = currentValue.filter((v) => v[valueKey] !== item[valueKey])
      } else {
        newValue = [...currentValue, item]
      }

      onChange?.(newValue.length > 0 ? newValue : null)
    } else {
      onChange?.(item)
      setIsOpen(false)
      setSearchQuery("")
    }
    setHighlightedIndex(-1)
  }

  const handleRemove = (item: T, e: React.MouseEvent) => {
    e.stopPropagation()
    if (multiSelect && Array.isArray(value)) {
      const newValue = value.filter((v) => v[valueKey] !== item[valueKey])
      onChange?.(newValue.length > 0 ? newValue : null)
    } else {
      onChange?.(null)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(null)
    setSearchQuery("")
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (disabled) return

    switch (e.key) {
      case "Enter":
        e.preventDefault()
        if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
          handleSelect(filteredItems[highlightedIndex])
        } else if (!isOpen) {
          setIsOpen(true)
        }
        break
      case "Escape":
        setIsOpen(false)
        setSearchQuery("")
        setHighlightedIndex(-1)
        break
      case "ArrowDown":
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          setHighlightedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0))
        }
        break
      case "ArrowUp":
        e.preventDefault()
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1))
        }
        break
      case "Tab":
        if (isOpen) {
          setIsOpen(false)
          setSearchQuery("")
          setHighlightedIndex(-1)
        }
        break
    }
  }

  const isSelected = (item: T): boolean => {
    if (multiSelect && Array.isArray(value)) {
      return value.some((v) => v[valueKey] === item[valueKey])
    }
    return value && value[valueKey] === item[valueKey]
  }

  const getDisplayValue = (): string => {
    if (!value) return placeholder

    if (multiSelect && Array.isArray(value)) {
      if (value.length === 0) return placeholder
      if (value.length === 1) return String(value[0][labelKey])
      return `${value.length} items selected`
    }

    return String(value[labelKey])
  }

  const hasValue = multiSelect ? Array.isArray(value) && value.length > 0 : value !== null

  return (
    <div
      ref={selectRef}
      className={`relative w-full ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
    >
      {/* Main Select Button */}
      <div
        onClick={handleToggle}
        className={`
          relative w-full min-h-[2.5rem] px-3 py-2 text-left
          bg-white dark:bg-[#171717] 
          border border-gray-300 dark:border-gray-600
          rounded-md shadow-sm cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          dark:focus:ring-blue-400 dark:focus:border-blue-400
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800" : "hover:border-gray-400 dark:hover:border-gray-500"}
          ${isOpen ? "ring-2 ring-blue-500 border-blue-500 dark:ring-blue-400 dark:border-blue-400" : ""}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 flex items-center gap-1 flex-wrap">
            {multiSelect && Array.isArray(value) && value.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {value.map((item, index) => (
                  <span
                    key={`${item[valueKey]}-${index}`}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium
                             bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200
                             rounded-md"
                  >
                    {String(item[labelKey])}
                    <button
                      onClick={(e) => handleRemove(item, e)}
                      className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                      type="button"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <span
                className={`block truncate ${!hasValue ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-gray-100"}`}
              >
                {getDisplayValue()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {clearable && hasValue && !disabled && (
              <button
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                type="button"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#171717] border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
          {searchable && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-600">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-sm
                           bg-white dark:bg-[#171717] 
                           border border-gray-300 dark:border-gray-600
                           rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           dark:focus:ring-blue-400 dark:focus:border-blue-400
                           text-gray-900 dark:text-gray-100
                           placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
          )}

          <div ref={optionsRef} className={`py-1 overflow-auto ${maxHeight}`}>
            {filteredItems.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">{noResultsText}</div>
            ) : (
              filteredItems.map((item, index) => (
                <div
                  key={`${item[valueKey]}-${index}`}
                  onClick={() => handleSelect(item)}
                  className={`
                    px-3 py-2 text-sm cursor-pointer flex items-center justify-between
                    ${highlightedIndex === index ? "bg-blue-100 dark:bg-blue-900" : "hover:bg-gray-100 dark:hover:bg-gray-800"}
                    ${isSelected(item) ? "bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-gray-100"}
                  `}
                >
                  <span className="truncate">{String(item[labelKey])}</span>
                  {isSelected(item) && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
