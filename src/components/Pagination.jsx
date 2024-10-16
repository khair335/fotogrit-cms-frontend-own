import React, { useEffect } from 'react';

import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';

const Pagination = (props) => {
  const {
    currentPage,
    setCurrentPage,
    limitPerPage,
    setLimitPerPage,
    totalPages,
    totalRecords,
    rowPerPage = false,
  } = props;

  // Fungsi untuk mengubah halaman ke halaman sebelumnya
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Fungsi untuk mengubah halaman ke halaman berikutnya
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Fungsi untuk mengubah halaman ke halaman terakhir
  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  // Fungsi untuk mengubah halaman ke halaman pertama
  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  // Fungsi untuk mengubah halaman
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const maxPageLinks = 5;
  const pageLinks = [];

  // Jika total halaman kurang dari 5, tampilkan semua tautan halaman
  if (totalPages <= maxPageLinks) {
    for (let i = 1; i <= totalPages; i++) {
      pageLinks.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-2.5 py-1.5 text-xs rounded-[4px] ${
            currentPage === i
              ? 'bg-black text-white'
              : 'bg-transparent text-black hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }
  } else {
    // Hitung awal dan akhir tautan halaman
    let startPage = Math.max(1, currentPage - Math.floor(maxPageLinks / 2));
    let endPage = Math.min(startPage + maxPageLinks - 1, totalPages);

    // Tambahkan tautan halaman
    for (let i = startPage; i <= endPage; i++) {
      pageLinks.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-2.5 py-1.5 text-xs rounded-[4px] ${
            currentPage === i
              ? 'bg-black text-white'
              : 'bg-transparent text-black hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    // Tambahkan tanda elipsis jika diperlukan
    if (startPage > 1) {
      pageLinks.unshift(<span key="ellipsis-start">...</span>);
    }
    if (endPage < totalPages) {
      pageLinks.push(<span key="ellipsis-end">...</span>);
    }
  }

  const handleLimitPerPage = (e) => {
    setCurrentPage(1);
    setLimitPerPage(e.target.value);
  };

  // Tampilkan informasi total item yang ditampilkan
  const firstItem = (currentPage - 1) * limitPerPage + 1;
  const lastItem = Math.min(currentPage * limitPerPage, totalRecords);
  const totalItemsInfo = `Showing ${firstItem}-${lastItem} of ${totalRecords} entries`;

  return (
    <>
      {totalRecords !== 0 ? (
        <div className="flex items-center justify-center sm:justify-between border-t border-gray-300 py-4">
          <div className="text text-xs text-gray-500 hidden sm:block">
            <p>{totalItemsInfo}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            {rowPerPage && (
              <div className="flex items-center">
                <span className="text-xs text-gray-500">Rows per page: </span>
                <select
                  name="rows"
                  id="rows"
                  className="text-xs p-1 focus:outline-none focus:ring-0 cursor-pointer"
                  value={limitPerPage}
                  onChange={(e) => handleLimitPerPage(e)}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            )}

            {totalPages > 1 ? (
              <div className="pagination flex items-center gap-1">
                <button
                  onClick={handleFirstPage}
                  className="p-1 rounded-sm hover:text-gray-400 hover:bg-gray-50  transition-all duration-300 disabled:opacity-40 disabled:hover:text-black hidden sm:block text-xl"
                  disabled={currentPage <= 1}
                >
                  <MdKeyboardDoubleArrowLeft />
                </button>
                <button
                  onClick={handlePrevPage}
                  className="sm:p-1 rounded-sm hover:text-gray-400 hover:bg-gray-50  transition-all duration-300 disabled:opacity-40 disabled:hover:text-black text-xl"
                  disabled={currentPage <= 1}
                >
                  <MdKeyboardArrowLeft />
                </button>

                <div className="flex sm:gap-1">{pageLinks}</div>

                <button
                  onClick={handleNextPage}
                  className="sm:p-1 rounded-sm hover:text-gray-400 hover:bg-gray-50 transition-all duration-300 disabled:opacity-40 disabled:hover:text-black text-xl"
                  disabled={currentPage >= totalPages}
                >
                  <MdKeyboardArrowRight />
                </button>
                <button
                  onClick={handleLastPage}
                  className="p-1 rounded-sm hover:text-gray-400 hover:bg-gray-50 transition-all duration-300 disabled:opacity-40 disabled:hover:text-black hidden sm:block text-xl"
                  disabled={currentPage >= totalPages}
                >
                  <MdKeyboardDoubleArrowRight />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Pagination;
