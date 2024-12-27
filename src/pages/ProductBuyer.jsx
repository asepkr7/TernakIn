import StatusDetail from "@/actions/StatusDetail";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Dashboard from "@/layout/Dashboard";
import axiosInstance from "@/server/axios";
import { Separator } from "@/components/ui/separator";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";

const ProductBuyer = () => {
  const [transactions, setTransactions] = useState([]); // Semua data
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const [pageSize] = useState(5); // Jumlah item per halaman
  const [visiblePages, setVisiblePages] = useState([1, 2, 3]); // Halaman yang terlihat
  const [token] = useState(Cookies.get("token"));

  useEffect(() => {
    const fetchProfileData = async () => {
      axiosInstance.defaults.headers.common["Authorization"] = token;

      try {
        const response = await axiosInstance.get(
          `/api/transactions/with-details`
        );
        setTransactions(
          response.data.data.filter(
            (transaction) => transaction.status === "pending"
          )
        );
      } catch (error) {
        console.error(`Error fetching User Data: ${error}`);
      }
    };

    fetchProfileData();
  }, [token]);

  // Hitung data yang akan ditampilkan di halaman saat ini
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  // Hitung total halaman
  const totalPages = Math.ceil(transactions.length / pageSize);

  const updateVisiblePages = (page) => {
    if (totalPages <= 3) {
      setVisiblePages(Array.from({ length: totalPages }, (_, i) => i + 1));
    } else if (page <= 1) {
      setVisiblePages([1, 2, 3]);
    } else if (page >= totalPages - 1) {
      setVisiblePages([totalPages - 2, totalPages - 1, totalPages]);
    } else {
      setVisiblePages([page - 1, page, page + 1]);
    }
  };

  // Fungsi untuk berpindah halaman
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      updateVisiblePages(page);
    }
  };

  return (
    <Dashboard>
      <div className="bg-slate-200 flex flex-col gap-4 py-8 px-20 h-full">
        <div className="flex flex-col gap-4">
          <div className="flex bg-white px-6 py-4 rounded-lg justify-between">
            <h1 className="font-bold text-2xl">Transaction List</h1>
          </div>
          <div className="flex flex-col gap-4 w-full bg-white rounded-lg px-8 py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Field Name</TableHead>
                  <TableHead>Rent Duration (Month)</TableHead>
                  <TableHead>Animal Qty</TableHead>
                  <TableHead>Animal Status</TableHead>
                  <TableHead>Animal Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.map((transaction, i) => (
                  <TableRow key={startIndex + i}>
                    <TableCell>{startIndex + i + 1}</TableCell>
                    <TableCell>{transaction.field.name}</TableCell>
                    <TableCell>{transaction.duration}</TableCell>
                    <TableCell>{transaction.qty}</TableCell>
                    <TableCell>
                      <StatusDetail details={transaction.details} />
                    </TableCell>
                    <TableCell>{transaction.field.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Separator />
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                </PaginationItem>
                {visiblePages[0] > 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                {visiblePages.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {visiblePages[visiblePages.length - 1] < totalPages && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default ProductBuyer;
