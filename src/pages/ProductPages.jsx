import AddProductModal from "@/actions/AddProductModal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
// import AppSidebar from "@/layout/Dashboard";
import Dashboard from "@/layout/Dashboard";
import { useEffect, useState } from "react";
import { IoTrashBin } from "react-icons/io5";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axiosInstance from "@/server/axios";
import { getImageUrl } from "@/utils/helpers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditProductModal from "@/actions/EditProductModal";
import Swal from "sweetalert2";
const ProductPages = () => {
  const [fields, setFields] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [visiblePages, setVisiblePages] = useState([1, 2, 3]);

  useEffect(() => {
    const token = Cookies.get("token");
    axiosInstance.defaults.headers.common["Authorization"] = token;

    const handleNewField = (newField) => {
      setFields((prevFields) => [newField, ...prevFields]);
    };

    const fetchFieldsData = async () => {
      try {
        const response = await axiosInstance.get(`/api/seller-fields`);
        const fieldsData = response.data.data;
        setFields(fieldsData);
        updateVisiblePages(1);

        // Hitung total revenue
      } catch (error) {
        console.log(error.response.data);
        console.error(`Error fetching User Data: ${error}`);
      }
    };
    fetchFieldsData();
  }, []);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedFields = fields.slice(startIndex, endIndex);
  const totalPages = Math.ceil(fields.length / pageSize);

  const updateVisiblePages = (page) => {
    if (totalPages <= 3) {
      setVisiblePages(Array.from({ length: totalPages }, (_, i) => i + 1));
    } else if (page === 1) {
      setVisiblePages([1, 2, 3]);
    } else if (page === totalPages) {
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
  const handleFieldUpdate = (updatedField) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === updatedField.id ? updatedField : field
      )
    );
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: "Konfirmasi Penghapusan",
      text: "Apakah Anda yakin ingin menghapus produk ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      const token = Cookies.get("token");
      axiosInstance.defaults.headers.common["Authorization"] = token;

      try {
        const response = await axiosInstance.delete(`/api/fields/${id}`);
        setFields((prevFields) =>
          prevFields.filter((field) => field.id !== id)
        );
        Swal.fire("Terhapus!", response.data.message, "success");
      } catch (error) {
        if (error.response && error.response.status === 400) {
          Swal.fire("Gagal!", error.response.data.message, "error");
        } else {
          Swal.fire("Gagal!", "Terjadi kesalahan, silakan coba lagi.", "error");
        }
      }
    }
  };

  return (
    <Dashboard>
      <div className="flex p-2 flex-col gap-8">
        <div className="p-4 bg-white">
          <div className="flex flex-col w-full h-full">
            <h1 className="font-bold">Product</h1>

            <div className="flex justify-end mr-15">
              <AddProductModal
                onProductAdded={(newProduct) =>
                  setFields((prev) => [...prev, newProduct])
                }
              />
            </div>
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name </TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Wide</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedFields.map((field, i) => (
                    <TableRow key={startIndex + i}>
                      <TableCell>{startIndex + i + 1}</TableCell>
                      <TableCell>
                        <Avatar className="size-12">
                          <AvatarImage
                            src={getImageUrl(field.image)}
                            className="rounded-full"
                          ></AvatarImage>
                          <AvatarFallback></AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={"/dashboard-report"}
                          className="hover:underline"
                        >
                          {field.name}
                        </Link>
                      </TableCell>
                      <TableCell>{field.address}</TableCell>
                      <TableCell>{field.wide}</TableCell>
                      <TableCell>{field.type}</TableCell>
                      <TableCell>{field.stock}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(field.price)}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <EditProductModal
                          field={field}
                          onFieldUpdated={handleFieldUpdate}
                        />
                        {field.id && (
                          <Button
                            onClick={() => deleteProduct(field.id)}
                            size="icon"
                            variant="destructive"
                          >
                            <IoTrashBin />
                          </Button>
                        )}
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
      </div>
    </Dashboard>
  );
};

export default ProductPages;
