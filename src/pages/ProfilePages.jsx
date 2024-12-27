import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/server/axios";
import { Input } from "@/components/ui/input";
import Dashboard from "@/layout/Dashboard";
import { Label } from "@/components/ui/label";
import { getImageUrl } from "@/utils/helpers";
import EditProfileModal from "@/actions/EditProfileModal";
import Cookies from "js-cookie";

const ProfilePages = () => {
  const [user, setUser] = useState([]);
  const [profile, SetProfile] = useState([]);

  const updateProfileData = (updatedProfile) => {
    SetProfile(updatedProfile);
  };
  useEffect(() => {
    // Ambil data user dari cookies
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
        SetProfile(response.data.data);
      } catch (error) {
        console.error(`Error fetching User Data: ${error}`);
      }
    };
    fetchProfileData();
  }, [user]);
  return (
    <Dashboard>
      <div className="flex flex-col h-screen bg-gray-100">
        <main className="flex flex-1 flex-col items-center p-4 w-full">
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
        </main>
      </div>
    </Dashboard>
  );
};

export default ProfilePages;
