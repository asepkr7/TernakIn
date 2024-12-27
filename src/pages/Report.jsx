import Dashboard from "@/layout/Dashboard";
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
import StatusDetail from "@/actions/StatusDetail";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axiosInstance from "@/server/axios";

const Report = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const [pageSize] = useState(5); // Jumlah item per halaman
  const [visiblePages, setVisiblePages] = useState([1, 2, 3]); // Halaman terlihat
  const [profile, setProfile] = useState([]);
  const [user, setUser] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [fields, setFields] = useState([]);
  const [totalWide, setTotalWide] = useState(0);

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    const fetchReportData = async () => {
      axiosInstance.defaults.headers.common["Authorization"] = token;

      try {
        const response = await axiosInstance.get(
          "/api/transactions/with-details"
        );
        const reportsData = response.data.data;

        // Filter laporan dengan status "pending"
        const filtered = reportsData.filter(
          (report) => report.status === "pending"
        );
        setReports(reportsData);
        setFilteredReports(filtered);

        // Hitung total revenue hanya dari transaksi dengan status "pending"
        const total = filtered.reduce((sum, report) => {
          return sum + (parseFloat(report.totalPrice) || 0); // Pastikan totalPrice diakses dengan benar
        }, 0);

        setTotalRevenue(total); // Simpan total revenue ke state
        updateVisiblePages(1); // Inisialisasi pagination
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };

    const fetchFieldsData = async () => {
      try {
        const response = await axiosInstance.get(`/api/seller-fields`);
        const fieldsData = response.data.data;
        setFields(fieldsData);
        updateVisiblePages(1);
        const total = fieldsData.reduce((sum, field) => {
          return sum + (parseFloat(field.wide) || 0); // Pastikan wide adalah angka
        }, 0);
        setTotalWide(total);
      } catch (error) {
        console.log(error.response.data);
        console.error(`Error fetching User Data: ${error}`);
      }
    };

    const fetchProfileData = async () => {
      axiosInstance.defaults.headers.common["Authorization"] = token;

      try {
        const response = await axiosInstance.get(`/api/profiles/${user.id}`);
        setProfile(response.data.data);
        updateVisiblePages(1);
      } catch (error) {
        console.error(`Error fetching User Data: ${error}`);
      }
    };
    fetchProfileData();

    fetchFieldsData();

    fetchReportData();
  }, []);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedReports = filteredReports.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredReports.length / pageSize);

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

  return (
    <Dashboard>
      <div className="bg-slate-200 flex flex-col gap-4 py-8 px-20 h-full">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 w-full bg-white rounded-lg px-8 py-8">
            <h1 className="text-xl font-bold">Sumarry</h1>
            {/* <p>
              L0012 - <span className="font-bold">Product Id</span>
            </p> */}
            <div className="flex justify-between">
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="font-bold">Owner</h2>
                  <p>{user.name}</p>
                </div>
                <div className="flex flex-col">
                  <h2 className="font-bold">Address</h2>
                  <p className="w-3/4">{profile.address}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="font-bold">Total Revenue</h2>
                  <p>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(totalRevenue)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <h2 className="font-bold">Total Wide</h2>
                  <p className="w-3/4">
                    {`${totalWide} m`}
                    <sup>2</sup>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full bg-white rounded-lg px-8 py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Animal Qty</TableHead>
                  <TableHead>Animal Status</TableHead>
                  <TableHead>Animal Type</TableHead>
                  <TableHead className="text-center">
                    Rent Duration (Month)
                  </TableHead>
                  <TableHead>Total Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReports.map((report, i) => (
                  <TableRow key={startIndex + i}>
                    <TableCell>{startIndex + i + 1}</TableCell>
                    <TableCell>{report.buyer.name}</TableCell>
                    <TableCell>{report.qty}</TableCell>
                    <TableCell>
                      <StatusDetail details={report.details} />
                    </TableCell>
                    <TableCell>{report.field.type}</TableCell>
                    <TableCell className="text-center">
                      {report.duration}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(report.totalPrice)}{" "}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

export default Report;
