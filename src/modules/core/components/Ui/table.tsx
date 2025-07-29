import type React from "react"
import { useState, useMemo, useEffect, useCallback } from "react"
import { ChevronUp, ChevronDown, Search, Loader2, FileX } from "lucide-react"

import { title } from "@/modules/core/design-system/primitives";

// Types
export interface Column<T> {
  key: keyof T
  header: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
  width?: string
  align?: "left" | "center" | "right"
}

export interface PaginationCallbackParams {
  page: number
  pageSize: number
  searchTerm?: string
  sortConfig?: {
    key: string
    direction: "asc" | "desc"
  }
}

export interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  sortable?: boolean
  pagination?: boolean
  pageSize?: number
  className?: string
  striped?: boolean
  hoverable?: boolean
  bordered?: boolean
  loading?: boolean
  onPageChange?: (params: PaginationCallbackParams) => void | Promise<void>
  totalItems?: number // For server-side pagination
  emptyMessage?: string
  loadingMessage?: string
}

// Loading skeleton component
const TableSkeleton = ({ columns, rows = 5 }: { columns: number; rows?: number }) => (
  <div className="animate-pulse">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="border-b border-gray-100 dark:border-gray-700">
        <div className="flex">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="flex-1 px-4 py-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

// Empty state component
const EmptyState = ({ message = "No data available", searchTerm }: { message?: string; searchTerm?: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <FileX className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
    <h3 className={title({ size: 'sm', class: "mb-2" })}>
      {searchTerm ? "No results found" : "No Data Available"}
    </h3>
    <p className="text-gray-500 dark:text-gray-400 max-w-sm">
      {searchTerm ? `No results match "${searchTerm}". Try adjusting your search terms.` : message}
    </p>
  </div>
)

// Base table components with dark theme support
export const TableContainer = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-sm transition-colors duration-200 ${className}`}
  >
    {children}
  </div>
)

export const TableWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">{children}</table>
  </div>
)

export const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">{children}</thead>
)

export const TableBody = ({
  children,
  striped = false,
  loading = false,
  isEmpty = false,
  emptyMessage,
  searchTerm,
  columnsCount,
}: {
  children: React.ReactNode
  striped?: boolean
  loading?: boolean
  isEmpty?: boolean
  emptyMessage?: string
  searchTerm?: string
  columnsCount: number
}) => (
  <tbody className={`transition-all duration-300 ${striped ? "[&>tr:nth-child(even)]:bg-gray-50 dark:[&>tr:nth-child(even)]:bg-white/5" : ""}`}>
    {loading ? (
      <tr>
        <td colSpan={columnsCount} className="p-0">
          <TableSkeleton columns={columnsCount} />
        </td>
      </tr>
    ) : isEmpty ? (
      <tr>
        <td colSpan={columnsCount} className="p-0">
          <EmptyState message={emptyMessage} searchTerm={searchTerm} />
        </td>
      </tr>
    ) : (
      children
    )}
  </tbody>
)

export const TableRow = ({
  children,
  hoverable = true,
  onClick,
  className = "",
}: {
  children: React.ReactNode
  hoverable?: boolean
  onClick?: () => void
  className?: string
}) => (
  <tr
    className={`
      border-b border-gray-100 last:border-b-0 dark:border-gray-700
      transition-all duration-200 ease-in-out
      ${hoverable ? "hover:bg-gray-50 dark:hover:bg-white/10" : ""}
      ${onClick ? "cursor-pointer" : ""}
      ${className}
    `}
    onClick={onClick}
  >
    {children}
  </tr>
)

export const TableCell = ({
  children,
  align = "left",
  className = "",
  width,
}: {
  children: React.ReactNode
  align?: "left" | "center" | "right"
  className?: string
  width?: string
}) => (
  <td
    className={`
      px-4 py-3 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200
      ${align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"}
      ${className}
    `}
    style={width ? { width } : undefined}
  >
    <div className="transition-all duration-200 ease-in-out">{children}</div>
  </td>
)

export const TableHeaderCell = ({
  children,
  sortable = false,
  sortDirection,
  onSort,
  align = "left",
  className = "",
  width,
}: {
  children: React.ReactNode
  sortable?: boolean
  sortDirection?: "asc" | "desc" | null
  onSort?: () => void
  align?: "left" | "center" | "right"
  className?: string
  width?: string
}) => (
  <th
    className={`
      px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider
      transition-all duration-200 ease-in-out
      ${align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"}
      ${sortable ? "cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" : ""}
      ${className}
    `}
    style={width ? { width } : undefined}
    onClick={sortable ? onSort : undefined}
  >
    <div
      className={`flex items-center gap-1 transition-all duration-200 ${
        align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"
      }`}
    >
      {children}
      {sortable && (
        <div className="flex flex-col transition-all duration-200">
          <ChevronUp
            className={`w-3 h-3 transition-all duration-200 ${
              sortDirection === "asc" ? "text-blue-600 dark:text-blue-400 scale-110" : "text-gray-300 dark:text-gray-600"
            }`}
          />
          <ChevronDown
            className={`w-3 h-3 -mt-1 transition-all duration-200 ${
              sortDirection === "desc" ? "text-blue-600 dark:text-blue-400 scale-110" : "text-gray-300 dark:text-gray-600"
            }`}
          />
        </div>
      )}
    </div>
  </th>
)

export const TableSearch = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  loading = false,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  loading?: boolean
}) => (
  <div className={`relative mb-4 ${className}`}>
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 transition-colors duration-200" />
    {loading && (
      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 animate-spin" />
    )}
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-transparent 
                 outline-none text-sm transition-all duration-200
                 placeholder:text-gray-400 dark:placeholder:text-gray-500"
    />
  </div>
)

export const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
  className = "",
  loading = false,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize: number
  totalItems: number
  className?: string
  loading?: boolean
}) => {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700
                     bg-gray-50 dark:bg-gray-800/60 transition-colors duration-200 ${className}`}
    >
      <div className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </div>
        ) : (
          `Showing ${startItem} to ${endItem} of ${totalItems} results`
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300
                     hover:bg-gray-100 dark:hover:bg-gray-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
        >
          Previous
        </button>

        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => (typeof page === "number" ? onPageChange(page) : undefined)}
            disabled={typeof page !== "number" || loading}
            className={`px-3 py-1 text-sm border rounded-md transition-all duration-200 ${
              page === currentPage
                ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                : typeof page === "number"
                  ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  : "border-transparent text-gray-400 dark:text-gray-500 cursor-default"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300
                     hover:bg-gray-100 dark:hover:bg-gray-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  searchable = false,
  sortable = true,
  pagination = false,
  pageSize = 10,
  className = "",
  striped = false,
  hoverable = true,
  bordered = false,
  loading = false,
  onPageChange,
  totalItems,
  emptyMessage = "No data available",
  loadingMessage = "Loading...",
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null
    direction: "asc" | "desc"
  }>({ key: null, direction: "asc" })
  const [currentPage, setCurrentPage] = useState(1)
  const [isPageChanging, setIsPageChanging] = useState(false)

  const isServerSidePagination = Boolean(onPageChange && totalItems !== undefined)

  const filteredData = useMemo(() => {
    if (isServerSidePagination) return data
    if (!searchable || !searchTerm) return data

    return data.filter((item) =>
      columns.some((column) => {
        const value = item[column.key]
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      }),
    )
  }, [data, searchTerm, columns, searchable, isServerSidePagination])

  const sortedData = useMemo(() => {
    if (isServerSidePagination) return filteredData
    if (!sortable || !sortConfig.key) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key!]
      const bValue = b[sortConfig.key!]

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }, [filteredData, sortConfig, sortable, isServerSidePagination])

  const paginatedData = useMemo(() => {
    if (isServerSidePagination) return sortedData
    if (!pagination) return sortedData

    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize, pagination, isServerSidePagination])

  const finalTotalItems = isServerSidePagination ? totalItems! : sortedData.length
  const totalPages = Math.ceil(finalTotalItems / pageSize)

  const handlePageChange = useCallback(
    async (page: number) => {
      if (page === currentPage) return

      setIsPageChanging(true)
      setCurrentPage(page)

      if (onPageChange) {
        try {
          await onPageChange({
            page,
            pageSize,
            searchTerm: searchable ? searchTerm : undefined,
            sortConfig: sortConfig.key
              ? {
                  key: String(sortConfig.key),
                  direction: sortConfig.direction,
                }
              : undefined,
          })
        } catch (error) {
          console.error("Page change callback failed:", error)
        }
      }

      // Add a small delay for smooth animation
      setTimeout(() => setIsPageChanging(false), 300)
    },
    [currentPage, onPageChange, pageSize, searchTerm, searchable, sortConfig],
  )

  const handleSort = useCallback(
    (key: keyof T) => {
      if (!sortable) return

      const newSortConfig = {
        key,
        direction: (sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc") as "asc" | "desc",
      }

      setSortConfig(newSortConfig)

      if (currentPage !== 1) {
        handlePageChange(1)
      } else if (onPageChange) {
        onPageChange({
          page: 1,
          pageSize,
          searchTerm: searchable ? searchTerm : undefined,
          sortConfig: {
            key: String(key),
            direction: newSortConfig.direction,
          },
        })
      }
    },
    [sortable, sortConfig, currentPage, handlePageChange, onPageChange, pageSize, searchTerm, searchable],
  )

  useEffect(() => {
    if (!searchable) return

    const timeoutId = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1)
      }

      if (onPageChange) {
        onPageChange({
          page: 1,
          pageSize,
          searchTerm,
          sortConfig: sortConfig.key
            ? {
                key: String(sortConfig.key),
                direction: sortConfig.direction,
              }
            : undefined,
        })
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, searchable, onPageChange, pageSize, sortConfig])

  const displayData = paginatedData
  const isEmpty = displayData.length === 0 && !loading
  const showPagination = pagination && totalPages > 1

  return (
    <div className={`transition-all duration-300 ${className}`}>
      {searchable && (
        <TableSearch value={searchTerm} onChange={setSearchTerm} placeholder="Search table..." loading={loading} />
      )}

      <TableContainer className={bordered ? "border-2" : ""}>
        <TableWrapper>
          <TableHeader>
            <TableRow hoverable={false}>
              {columns.map((column) => (
                <TableHeaderCell
                  key={String(column.key)}
                  sortable={sortable && column.sortable !== false}
                  sortDirection={sortConfig.key === column.key ? sortConfig.direction : null}
                  onSort={() => handleSort(column.key)}
                  align={column.align}
                  width={column.width}
                >
                  {column.header}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody
            striped={striped}
            loading={loading || isPageChanging}
            isEmpty={isEmpty}
            emptyMessage={emptyMessage}
            searchTerm={searchTerm}
            columnsCount={columns.length}
          >
            {displayData.map((row, index) => (
              <TableRow key={`${currentPage}-${index}`} hoverable={hoverable} className="animate-fadeIn">
                {columns.map((column) => (
                  <TableCell key={String(column.key)} align={column.align} width={column.width}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </TableWrapper>

        {showPagination && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            totalItems={finalTotalItems}
            loading={loading || isPageChanging}
          />
        )}
      </TableContainer>
    </div>
  )
}