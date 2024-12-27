import Dashboard from "@/layout/Dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axiosInstance from "@/server/axios";
import { getImageUrl } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import EditProfileModal from "@/actions/EditProfileModal";

const DashboardPage = () => {
  const [profile, setProfile] = useState([]);
  const [fields, setFields] = useState([]);
  const [user, setUser] = useState([]);
  const [totalStock, setTotalStock] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // Jumlah item per halaman
  const [visiblePages, setVisiblePages] = useState([1, 2, 3]);

  const updateProfileData = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");

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

    const fetchFieldsData = async () => {
      axiosInstance.defaults.headers.common["Authorization"] = token;

      try {
        const response = await axiosInstance.get(`/api/seller-fields`);
        const fieldsData = response.data.data;

        setFields(fieldsData);

        const total = fieldsData.reduce((sum, field) => {
          return sum + (field.stock || 0); // Pastikan stok adalah angka
        }, 0);
        setTotalStock(total);
      } catch (error) {
        console.error(`Error fetching User Data: ${error}`);
      }
    };

    fetchProfileData();
    fetchFieldsData();
  }, [user]);

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

  if (fields.length === 0) {
    return (
      <Dashboard>
        <div className="flex px-6 py-6 gap-6 h-full bg-gray-100">
          <div className="relative py-12 flex flex-col gap-4 items-center bg-white w-1/2 h-fit shadow rounded-lg border border-gray-200">
            <Button
              className="absolute top-6 right-6"
              variant="icon"
              outline={"ghost"}
            >
              <EditProfileModal
                profile={profile}
                onProfileUpdated={updateProfileData}
              />
            </Button>
            <Avatar className="size-32">
              <AvatarImage
                src={getImageUrl(profile.image)}
                className="rounded-full"
              ></AvatarImage>
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <h1 className="text-center text-lg font-bold">{user.name}</h1>
            <div className="flex flex-col gap-4 w-full px-20">
              <div className="">
                <Label htmlFor="email">Email</Label>
                <Input
                  disabled
                  id="email"
                  type="email"
                  className="bg-slate-200"
                  value={user.email}
                />
              </div>
              <div className="">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  disabled
                  id="phoneNumber"
                  value={profile.phoneNumber}
                  type="text"
                  className="bg-slate-200"
                />
              </div>
              <div className="">
                <Label htmlFor="phoneNumber">Address</Label>
                <Input
                  disabled
                  id="phoneNumber"
                  value={profile.address}
                  type="text"
                  className="bg-slate-200"
                />
              </div>
              <div className="">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  disabled
                  id="postalCode"
                  value={profile.postalCode}
                  type="text"
                  className="bg-slate-200 w-fit"
                />
              </div>
              <div className="">
                <Label htmlFor="postalCode">City</Label>
                <Input
                  disabled
                  id="postalCode"
                  value={profile.city}
                  type="text"
                  className="bg-slate-200 w-fit"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-8 w-full flex-col">
            <div className="flex gap-2 justify-around">
              <div className="p-4 bg-white shadow rounded-lg border border-gray-200">
                <div className="flex flex-col items-center gap-2 w-52 h-20 ">
                  <p className="text-4xl">{fields.length}</p>
                  <h1 className="text-center font-bold">All Product</h1>
                </div>
              </div>
              <div className="p-4 bg-white shadow rounded-lg border border-gray-200">
                <div className="flex flex-col items-center gap-2 w-52 h-20 ">
                  <p className="text-4xl">
                    <span className="text-3xl">{totalStock}</span>
                  </p>
                  <h1 className="text-center font-bold">
                    Total Stocks Available
                  </h1>
                </div>
              </div>
              {/* <div className="p-4 bg-white shadow rounded-lg border border-gray-200">
                <div className="flex flex-col items-center gap-2 w-52 h-20 ">
                  <p className="text-4xl">4</p>
                  <h1 className="text-center font-bold">All Product</h1>
                </div>
              </div> */}
            </div>
            <div className=" bg-white shadow rounded-lg border border-gray-200">
              <div className="flex flex-col w-full h-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Types</TableHead>
                      <TableHead>Stocks</TableHead>
                      <TableHead>Prices</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
                <div className="flex justify-center p-6">
                  <p>No Field datas yet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dashboard>
    );
  }
  return (
    <Dashboard>
      <div className="flex px-6 py-6 gap-6 h-full bg-gray-100">
        <div className="relative py-12 flex flex-col gap-4 items-center bg-white w-1/2 h-fit shadow rounded-lg border border-gray-200">
          <Button
            className="absolute top-6 right-6"
            variant="icon"
            outline={"ghost"}
          >
            <EditProfileModal
              profile={profile}
              onProfileUpdated={updateProfileData}
            />
          </Button>
          <Avatar className="size-32">
            <AvatarImage
              src={getImageUrl(profile.image)}
              className="rounded-full"
            ></AvatarImage>
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <h1 className="text-center text-lg font-bold">{user.name}</h1>
          <div className="flex flex-col gap-4 w-full px-20">
            <div className="">
              <Label htmlFor="email">Email</Label>
              <Input
                disabled
                id="email"
                type="email"
                className="bg-slate-200"
                value={user.email}
              />
            </div>
            <div className="">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                disabled
                id="phoneNumber"
                value={profile.phoneNumber}
                type="text"
                className="bg-slate-200"
              />
            </div>
            <div className="">
              <Label htmlFor="phoneNumber">Address</Label>
              <Input
                disabled
                id="phoneNumber"
                value={profile.address}
                type="text"
                className="bg-slate-200"
              />
            </div>
            <div className="">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                disabled
                id="postalCode"
                value={profile.postalCode}
                type="text"
                className="bg-slate-200 w-fit"
              />
            </div>
            <div className="">
              <Label htmlFor="postalCode">City</Label>
              <Input
                disabled
                id="postalCode"
                value={profile.city}
                type="text"
                className="bg-slate-200 w-fit"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-8 w-full flex-col">
          <div className="flex gap-2 justify-around">
            <div className="p-4 bg-white shadow rounded-lg border border-gray-200">
              <div className="flex flex-col items-center gap-2 w-52 h-20 ">
                <p className="text-4xl">{fields.length}</p>
                <h1 className="text-center font-bold">All Product</h1>
              </div>
            </div>
            <div className="p-4 bg-white shadow rounded-lg border border-gray-200">
              <div className="flex flex-col items-center gap-2 w-52 h-20 ">
                <p className="text-4xl">
                  <span className="text-3xl">{totalStock}</span>
                </p>
                <h1 className="text-center font-bold">
                  Total Stocks Available
                </h1>
              </div>
            </div>
            {/* <div className="p-4 bg-white shadow rounded-lg border border-gray-200">
              <div className="flex flex-col items-center gap-2 w-52 h-20 ">
                <p className="text-4xl">4</p>
                <h1 className="text-center font-bold">All Product</h1>
              </div>
            </div> */}
          </div>
          <div className=" bg-white shadow rounded-lg border border-gray-200">
            <div className="flex flex-col w-full h-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Types</TableHead>
                    <TableHead>Stocks</TableHead>
                    <TableHead>Prices</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedFields.map((field, i) => (
                    <TableRow key={startIndex + i}>
                      <TableCell>{startIndex + i + 1}</TableCell>
                      <TableCell>
                        <Avatar className="size-12">
                          <AvatarImage src={getImageUrl(field.image)} />
                          <AvatarFallback />
                        </Avatar>
                      </TableCell>
                      <TableCell>{field.name}</TableCell>
                      <TableCell>{field.address}</TableCell>
                      <TableCell>{field.type}</TableCell>
                      <TableCell>{field.stock}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(field.price)}
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

export default DashboardPage;
