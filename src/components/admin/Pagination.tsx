"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  itemsPerPage = 10,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-200">
      <p className="text-[13px] text-slate-500 font-bold">
        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
      </p>
      <div className="flex gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-4 py-2 bg-white rounded-lg text-[13px] font-medium text-primary border border-primary/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/5 transition-colors"
        >
          Previous
        </button>
        <div className="flex gap-1">
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            // Only show first, last, and pages around current
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors ${
                    currentPage === page
                      ? "bg-primary text-white"
                      : "bg-white text-primary border border-primary/10 hover:bg-primary/5"
                  }`}
                >
                  {page}
                </button>
              );
            }
            if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <span key={page} className="w-9 h-9 flex items-center justify-center text-slate-400 font-bold">
                  ...
                </span>
              );
            }
            return null;
          })}
        </div>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-4 py-2 bg-white rounded-lg text-[13px] font-medium text-primary border border-primary/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/5 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
