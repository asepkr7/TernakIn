import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import ProductSchema from "@/schema/ProductSchema";
import axiosInstance from "@/server/axios";
import { toast } from "sonner";
import { FaPen } from "react-icons/fa";
import Cookies from "js-cookie";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
const EditProductModal = ({ field, onFieldUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCropOpen, setIsCropOpen] = useState(false); // Crop Modal state
  const [user, setUser] = useState([]);
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: field.name || "",
      address: field.address || "",
      city: field.city || "",
      wide: field.wide || 0,
      type: field.type || "",
      stock: field.stock || 0,
      image: null,
      description: field.description || "",
      price: field.price || 0,
    },
    resolver: zodResolver(ProductSchema),
  });

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = useCallback(async () => {
    try {
      const croppedImg = await getCroppedImg(image, croppedAreaPixels);
      setCroppedImage(croppedImg);
      setImage(null);
      setIsCropOpen(false); // Close crop modal
    } catch (error) {
      console.error("Failed to crop image:", error);
    }
  }, [image, croppedAreaPixels]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setIsCropOpen(true); // Open crop modal when image is selected
      };
      reader.readAsDataURL(file);
    }
  };
  const handleUpdateData = async (data) => {
    try {
      const token = Cookies.get("token");
      axiosInstance.defaults.headers.common["Authorization"] = token;

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("type", data.type);
      formData.append("stock", data.stock);
      formData.append("price", data.price);
      formData.append("wide", data.wide);
      formData.append("description", data.description);
      formData.append("sellerId", user.id);

      if (croppedImage) {
        formData.append("image", croppedImage, "cropped-image.jpg");
      }

      const response = await axiosInstance.put(
        `/api/fields/${field.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (onFieldUpdated) {
        onFieldUpdated(response.data.data);
      }

      toast.success("Product updated successfully");
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error(
        "Error updating field:",
        error.response?.data || error.message
      );
      toast.error("Failed to update field");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="icon" variant="ghost">
            <FaPen />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[820px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdateData)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Name */}
              <div className="form-group">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium">Name</label>
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter product name"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              {/* Address */}
              <div className="form-group">
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium">
                        Address
                      </label>
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter address"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              {/* City */}
              <div className="form-group">
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium">City</label>
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter city"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              {/* Wide */}
              <div className="form-group">
                <Controller
                  name="wide"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium">Wide</label>
                      <input
                        {...field}
                        type="number"
                        placeholder="Enter land size"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                      {errors.wide && (
                        <p className="text-red-500 text-sm">
                          {errors.wide.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              {/* Type */}
              <div className="form-group">
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium">Type</label>
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter type"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                      {errors.type && (
                        <p className="text-red-500 text-sm">
                          {errors.type.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              {/* Stock */}
              <div className="form-group">
                <Controller
                  name="stock"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium">Stock</label>
                      <input
                        {...field}
                        type="number"
                        placeholder="Enter stock"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                      {errors.stock && (
                        <p className="text-red-500 text-sm">
                          {errors.stock.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              {/* Price */}
              <div className="form-group">
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium">Price</label>
                      <input
                        {...field}
                        type="number"
                        placeholder="Enter price"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                      {errors.price && (
                        <p className="text-red-500 text-sm">
                          {errors.price.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              {/* Image */}
              <div className="form-group">
                <Controller
                  name="image"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  )}
                />
                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      {...field}
                      placeholder="Enter description"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" className="bg-green-600 hover:bg-green-800">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Crop Modal */}
      <Dialog open={isCropOpen} onOpenChange={setIsCropOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[100vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[300px] bg-gray-100">
            {image && (
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <div className="flex gap-4 mt-4 items-center">
            <label className="text-sm font-medium">Zoom:</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-4 mt-4 items-center">
            <label className="text-sm font-medium">Aspect Ratio:</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(parseFloat(e.target.value))}
              className="border rounded-md px-2 py-1"
            >
              <option value={4 / 3}>4:3</option>
            </select>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCrop}
              className="bg-green-600 hover:bg-green-800"
            >
              Crop & Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditProductModal;
