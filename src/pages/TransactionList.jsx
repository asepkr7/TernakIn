import TransactionDetail from "@/actions/TransactionDetail";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import Dashboard from "@/layout/Dashboard";
import axiosInstance from "@/server/axios";
import { getImageUrl } from "@/utils/helpers";
import { formatPrice } from "@/utils/priceFormatter";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]); // Data transaksi
  const [seller, setSeller] = useState({}); // Data seller
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const [pageSize] = useState(3); // Jumlah item per halaman
  const [visiblePages, setVisiblePages] = useState([1, 2, 3]); // Halaman yang terlihat
  const [token] = useState(Cookies.get("token"));

  useEffect(() => {
    const fetchTransactionData = async () => {
      axiosInstance.defaults.headers.common["Authorization"] = token;

      try {
        const response = await axiosInstance.get(`/api/transactions`);
        const transactionsData = response.data.data;
        setTransactions(transactionsData);

        const sellerIds = [
          ...new Set(transactionsData.map((item) => item.field.sellerId)),
        ];

        const sellerResponse = await Promise.all(
          sellerIds.map((sellerId) =>
            axiosInstance.get(`/api/admin/users/${sellerId}`)
          )
        );

        const sellersData = {};
        sellerResponse.forEach((res) => {
          sellersData[res.data.data.id] = res.data.data;
        });

        setSeller(sellersData);
      } catch (error) {
        console.error(`Error fetching User Data: ${error}`);
      }
    };

    fetchTransactionData();
  }, [token]);

  // Hitung data yang akan ditampilkan di halaman saat ini
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);
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

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      updateVisiblePages(page);
    }
  };

  if (!transactions.length) {
    return (
      <Dashboard>
        <div className="flex p-2 flex-col gap-8 bg-slate-200 py-8 px-14 h-full">
          <div className="flex bg-white px-6 py-4 rounded-lg justify-between">
            <h1 className="font-bold text-2xl">Transaction List</h1>
          </div>
          <div className="p-4 bg-white">
            <div className="flex justify-center items-center w-full h-full">
              <div>No Transaction Yet</div>
            </div>
          </div>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="flex p-2 flex-col gap-8 bg-slate-200 py-8 px-14 h-full">
        <div className="flex bg-white px-6 py-4 rounded-lg justify-between">
          <h1 className="font-bold text-2xl">Transaction List</h1>
        </div>
        <div className="p-4 bg-white">
          <div className="flex flex-col w-full h-full">
            <div>
              {paginatedTransactions.map((transaction, i) => (
                <div className="flex flex-col gap-4" key={startIndex + i}>
                  <div className="flex flex-col gap-6 bg-white px-6 py-6 rounded-lg">
                    <div className="flex align-middle justify-between">
                      <h1 className="text-xl font-bold mb-4">Detail Product</h1>
                      <h1 className="text-lg font-bold mb-4">
                        {seller[transaction.field.sellerId]
                          ? seller[transaction.field.sellerId].name
                          : "Loading..."}
                      </h1>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div className="flex gap-4 items-center">
                        <Avatar className="size-24">
                          <AvatarImage
                            src={getImageUrl(transaction.field.image)}
                            className="rounded-full"
                          ></AvatarImage>
                          <AvatarFallback></AvatarFallback>
                        </Avatar>
                        <div className="flex justify-between w-full">
                          <div>
                            <h1 className="text-lg font-bold">
                              {transaction.field.name}
                            </h1>
                            <p>Animal Qty: {transaction.qty}</p>
                            <p>Rent Duration (month): {transaction.duration}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="text-lg font-semibold">
                              Rp. {formatPrice(Number(transaction.totalPrice))}
                            </p>
                            <span
                              className={`px-3 py-1 mt-2 rounded-full text-white text-sm font-semibold ${
                                transaction.status === "pending"
                                  ? "bg-yellow-500"
                                  : transaction.status === "cancelled"
                                  ? "bg-red-500"
                                  : "bg-green-500"
                              }`}
                            >
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <TransactionDetail
                        paymentMethod={transaction.paymentMethod}
                        totalPrice={transaction.totalPrice}
                        qty={transaction.qty}
                        transactionDate={transaction.date}
                        fieldName={transaction.field.name}
                        duration={transaction.duration}
                        type={transaction.field.type}
                        city={transaction.field.city}
                        address={transaction.field.address}
                      />
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
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

export default TransactionList;
