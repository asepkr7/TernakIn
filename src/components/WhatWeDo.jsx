// import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function WhatWeDo() {
  return (
    <div className="w-full">
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="px-4 pt-20 md:px-6 lg:px-8 font-light">
          <div className=" max-w-[1200px] mx-auto px-2">
            <div className="md:flex justify-between">
              <div className="">
                <p className="text-gray-600 mb-2 text-lg">Building Trust,</p>
                <p className="text-gray-600 mb-12 text-lg pl-8">
                  Caring for Tomorrow.
                </p>
              </div>
              <div className="">
                <p className="text-gray-600 max-w-3xl mb-16 text-justify">
                  At TernakIn, we understand the importance of safe,
                  comfortable, and reliable livestock boarding. We connect
                  livestock owners with trusted land providers, ensuring your
                  animals receive the best care possible. Through innovative,
                  collaborative, and eco-friendly approaches, we help shape a
                  better future for livestock farming.
                </p>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl mb-4">
              <span className="text-gray-400">Rooted in </span>
              <span className="font-semibold">Partnership</span>
              <span className="text-gray-400">,</span>
            </h1>
            <h1 className="text-5xl md:text-6xl lg:text-7xl mb-4">
              <span className="font-semibold">Growing for the</span>
            </h1>
            <h1 className="text-5xl md:text-6xl lg:text-7xl mb-16">
              <span className="font-semibold">
                Sustainable Livestock Management
              </span>
            </h1>

            {/* Navigation */}
            <div className="flex justify-between items-center border-t border-gray-200 py-4 mb-20">
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About Us
              </Link>
              <span className="text-green-600">ternakIn</span>
              <span className="text-gray-600">©2024</span>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="px-4 pb-20 md:px-6 lg:px-8">
          <div className="max-w-[1200px] mx-auto px-2">
            <div className="md:flex justify-between items-center mb-12 space-y-5 md:space-y-0">
              <h2 className="text-4xl md:text-5xl font-medium">What we do</h2>
              <p className="text-gray-600 max-w-[400px] text-sm">
                We offer a range of services to support livestock owners in
                managing and caring for their animals efficiently.
              </p>
              <Button
                variant="default"
                className="bg-green-800 hover:bg-green-900 text-white rounded-full px-6"
              >
                All Services
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="relative overflow-hidden group">
                <img
                  src="https://plus.unsplash.com/premium_photo-1661875142268-447550093ab9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGZhcm1lciUyMHdpdGglMjBjb3d8ZW58MHx8MHx8fDA%3D"
                  alt=""
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-end">
                  <h3 className="text-white text-2xl font-medium mb-4">
                    Trusted Boarding
                  </h3>
                  <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Safely board your livestock with experienced land providers
                    who ensure top-notch care.
                  </p>
                </div>
              </Card>

              <Card className="relative overflow-hidden group">
                <img
                  src="https://plus.unsplash.com/premium_photo-1661882127210-23ffbc72083f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAxfHxmYXJtZXIlMjB3aXRoJTIwY293fGVufDB8fDB8fHww"
                  alt=""
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-end">
                  <h3 className="text-white text-2xl font-medium">
                    Health Monitoring
                  </h3>
                  <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Regular health monitoring services to keep your livestock in
                    optimal condition.
                  </p>
                </div>
              </Card>

              <Card className="relative overflow-hidden group">
                <img
                  src="https://plus.unsplash.com/premium_photo-1682126876290-f37d05d60c47?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODV8fGZhcm1lciUyMHdpdGglMjBjb3d8ZW58MHx8MHx8fDA%3D"
                  alt=""
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-end">
                  <h3 className="text-white text-2xl font-medium">
                    Resource Management
                  </h3>
                  <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Efficient management of feed, water, and livestock needs on
                    trusted land.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
