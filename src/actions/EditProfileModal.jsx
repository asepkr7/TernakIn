import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProfileSchema from "@/schema/ProfileSchema";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import Cookies from "js-cookie";
import axiosInstance from "@/server/axios";
import { toast } from "sonner";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";

const EditProfileModal = ({ profile, onProfileUpdated }) => {
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
      image: null,
      address: "",
      city: "",
      postalCode: "",
      gender: "",
      phoneNumber: "",
    },
    resolver: zodResolver(ProfileSchema),
  });

  useEffect(() => {
    if (isOpen && profile) {
      reset({
        address: profile.address || "",
        city: profile.city || "",
        postalCode: profile.postalCode || "",
        gender: profile.gender || "",
        phoneNumber: profile.phoneNumber || "",
      });
      if (profile.image) {
        setImage(profile.image); // URL gambar dari profile
      }
    }
  }, [isOpen, profile, reset]);

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
    } else {
      // Jika tidak ada gambar baru, gunakan gambar lama
      setImage(profile.image || null);
    }
  };

  const handleUpdateData = async (data) => {
    try {
      const token = Cookies.get("token");
      axiosInstance.defaults.headers.common["Authorization"] = token;

      const formData = new FormData();
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("postalCode", data.postalCode);
      formData.append("gender", data.gender);
      formData.append("phoneNumber", data.phoneNumber);

      // Logika untuk gambar
      if (croppedImage) {
        formData.append("image", croppedImage, "cropped-image.jpg");
      } else if (profile.image) {
        formData.append("image", profile.image); // Gunakan gambar lama
      }

      const response = await axiosInstance.put(
        `/api/profiles/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (onProfileUpdated) {
        onProfileUpdated(response.data.data);
      }

      toast.success("Profile updated successfully");
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error(error.response.data);
      toast.error("Failed to update profile");
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
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <DialogDescription>Update your profile details</DialogDescription>

          <form onSubmit={handleSubmit(handleUpdateData)} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {/* Image */}
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium">
                        Profile Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        {...field}
                        onChange={handleImageChange}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                      {errors.image && (
                        <p className="text-red-500 text-sm">
                          {errors.image.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div>
                {/* Address */}
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium">
                        Address
                      </label>
                      <Input {...field} placeholder="Enter your address" />
                      {errors.address && (
                        <p className="text-red-500 text-sm">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div>
                {/* City */}
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium">City</label>
                      <Input {...field} placeholder="Enter your city" />
                      {errors.city && (
                        <p className="text-red-500 text-sm">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div>
                {/* Postal Code */}
                <Controller
                  name="postalCode"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium">
                        Postal Code
                      </label>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter your postal code"
                      />
                      {errors.postalCode && (
                        <p className="text-red-500 text-sm">
                          {errors.postalCode.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div>
                {/* Gender */}
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium">
                        Gender
                      </label>
                      <select
                        {...field}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {errors.gender && (
                        <p className="text-red-500 text-sm">
                          {errors.gender.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div>
                {/* Phone Number */}
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium">
                        Phone Number
                      </label>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter your phone number"
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-sm">
                          {errors.phoneNumber.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
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

export default EditProfileModal;
