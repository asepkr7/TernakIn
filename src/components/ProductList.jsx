import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { Link } from "react-router-dom";
// import WishlistButton from "./WishlistButton";
import { axiosInstance } from "@/server/axios";
import Cookies from "js-cookie";
import { getImageUrl } from "@/utils/helpers";
import { FaFilter } from "react-icons/fa";
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [filters, setFilters] = useState({
    order: "",
    minPrice: "",
    maxPrice: "",
    minField: "",
    maxField: "",
    location: "",
  });
  const [visibleCount, setVisibleCount] = useState(9);
  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");
      axiosInstance.defaults.headers.common["Authorization"] = token;

      try {
        const response = await axiosInstance.get("/api/fields");
        console.log(response.data.data);
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
        setVisibleProducts(response.data.data.slice(0, visibleCount));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = () => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
    setVisibleProducts(filtered.slice(0, visibleCount));
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === "") {
      setFilteredProducts(products);
      setVisibleProducts(products.slice(0, visibleCount));
    }
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // Perbarui state filter
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Terapkan filter setiap kali ada perubahan pada filters atau products
  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const applyFilters = () => {
    let filtered = [...products];

    // Filter berdasarkan Order
    // if (filters.order === "Terlaris") {
    //   filtered = filtered.sort((a, b) => b.sales - a.sales); // Contoh field 'sales'
    // } else if (filters.order === "Terbaru") {
    //   filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date)); // Contoh field 'date'
    // }

    // Filter berdasarkan Harga
    if (filters.minPrice) {
      filtered = filtered.filter(
        (product) => product.price >= Number(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(
        (product) => product.price <= Number(filters.maxPrice)
      );
    }

    // Filter berdasarkan Field
    if (filters.minField) {
      filtered = filtered.filter(
        (product) => product.wide >= Number(filters.minField)
      );
    }
    if (filters.maxField) {
      filtered = filtered.filter(
        (product) => product.wide <= Number(filters.maxField)
      );
    }

    // Filter berdasarkan Lokasi
    if (filters.location) {
      filtered = filtered.filter((product) =>
        product.city.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Update hasil filter
    setFilteredProducts(filtered);
    setVisibleProducts(filtered.slice(0, visibleCount));
  };

  const loadMoreProducts = () => {
    const newCount = Math.min(
      visibleCount + visibleCount,
      filteredProducts.length
    );
    setVisibleCount(newCount);
    setVisibleProducts(filteredProducts.slice(0, newCount));
  };

  return (
    <>
      <div className="flex gap-8 mx-20 my-12">
        <div className="flex w-full gap-12">
          <input
            type="text"
            placeholder="Search according to place"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className="w-full px-4 py-2  border border-gray-300 rounded-md focus:ring-1 focus:ring-green-200 focus:outline-none"
          />
          <Button onClick={handleSearch} className="w-40 bg-green-600">
            Search
          </Button>
        </div>
      </div>
      <div className="flex justify-start gap-12 ">
        <div className="flex flex-col ">
          <div className=" flex flex-col gap-8 w-full">
            <h1 className="ml-12  text-lg font-semibold flex items-center gap-2">
              <FaFilter />
              FILTER
            </h1>
            <div className="border bg-white rounded-lg shadow-lg ml-10 px-5 py-6">
              <Accordion
                type="multiple"
                defaultValue={["item-1", "item-2", "item-3", "item-4"]}
                className="w-full flex flex-col gap-4"
              >
                {/* <AccordionItem value="item-1">
                  <AccordionTrigger className=" mb-3">Populer</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-2">
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-200 focus:outline-none">
                      <option value="" disabled selected>
                        Select Order
                      </option>
                      <option value="Terlaris">Terlaris</option>
                      <option value="Terbaru">Terbaru</option>
                    </select>
                  </AccordionContent>
                </AccordionItem> */}
                <AccordionItem value="item-2">
                  <AccordionTrigger className=" mb-3">Price</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-2">
                    <input
                      placeholder="Lowest Price"
                      className="w-full px-4 py-2  border border-gray-300 rounded-md focus:ring-1 focus:ring-green-200 focus:outline-none"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={(e) => {
                        handleFilterChange(e);
                        applyFilters();
                      }}
                    />
                    <input
                      placeholder="Highest Price"
                      className="w-full px-4 py-2  border border-gray-300 rounded-md focus:ring-1 focus:ring-green-200 focus:outline-none"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={(e) => {
                        handleFilterChange(e);
                        applyFilters();
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className=" mb-3">Field</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-2">
                    <input
                      placeholder="Narrowest"
                      className="w-full px-4 py-2  border border-gray-300 rounded-md focus:ring-1 focus:ring-green-200 focus:outline-none"
                      name="minField"
                      value={filters.minField}
                      onChange={(e) => {
                        handleFilterChange(e);
                        applyFilters();
                      }}
                    />
                    <input
                      placeholder="Widest"
                      className="w-full px-4 py-2  border border-gray-300 rounded-md focus:ring-1 focus:ring-green-200 focus:outline-none"
                      name="maxField"
                      value={filters.maxField}
                      onChange={(e) => {
                        handleFilterChange(e);
                        applyFilters();
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className=" mb-3">
                    Locations
                  </AccordionTrigger>
                  <AccordionContent>
                    <select
                      name="location"
                      value={filters.location}
                      onChange={(e) => {
                        handleFilterChange(e);
                        applyFilters();
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-200 focus:outline-none"
                    >
                      <option value="" disabled selected>
                        Select Location
                      </option>
                      {products.map((product) => (
                        <option key={product.id} value={product.city}>
                          {product.city}
                        </option>
                      ))}
                    </select>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 w-fit">
          <div className="flex  py-4 justify-between w-fit"></div>
          {visibleProducts.length === 0 ? (
            // Menampilkan pesan jika tidak ada hasil
            <div className="text-center text-gray-500 text-lg">
              Result Not Found
            </div>
          ) : (
            // Menampilkan daftar produk jika ada hasil
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 p-2">
              {visibleProducts.map((product) => (
                <div
                  key={product.id}
                  className="group border bg-white rounded-lg shadow-lg relative hover:bg-[#eee] transition-shadow"
                >
                  <Link
                    to={`/product-detail/${product.id}`}
                    className="relative"
                  >
                    {/* <WishlistButton products={product} /> */}
                    <Card className="w-[280px] min-h-[350px] flex flex-col justify-between hover:cursor-pointer">
                      <div className="card-image ">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="w-full h-full  object-cover rounded-lg"
                        />
                      </div>
                      <CardHeader className="card-header">
                        <CardDescription>
                          <h4 className="text-md font-bold">{product.name}</h4>
                          <div className="font-bold text-lg text-green-500">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(product.price)}
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="card-content">
                        <p className="text-gray-600">{product.city}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {visibleProducts.length < filteredProducts.length && (
        <div className="flex justify-center mb-5 mt-10">
          <button
            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-400 transition"
            onClick={loadMoreProducts}
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
};

export default ProductList;
