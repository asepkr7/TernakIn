import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export const Hero = () => {
  return (
    <div className="">
      <div className="md:flex md:gap-0 gap-10 w-full md:h-screen">
        <div className="flex-1 h-full w-full">
          <div className="md:w-[500px] mx-auto pt-20 px-4">
            <div className="text-sm font-light">
              Cutting-edge solutions for efficient livestock management
            </div>
            <div className="text-6xl font-light mt-3">
              Simplifying Livestock Boarding
            </div>
            <div className="flex gap-5 mt-10">
              <div className="border border-black w-[100px] h-0 mt-2"></div>
              <div className="flex-1 text-justify font-light">
                Safely and conveniently board your livestock with trusted land
                providers. Our innovative approach helps you optimize livestock
                management, maintain productivity, and achieve the best results.
              </div>
            </div>
            <div className="mt-[20px] flex flex-row gap-3">
              <Link to={"/register"}>
                <Button className="w-[150px] bg-green-600">Join Us</Button>
              </Link>
              <Button className="w-[150px]" variant="outline">
                Detail Information
              </Button>
            </div>
          </div>
        </div>
        <div className="md:h-full h-[500px] mt-10 md:mt-0 flex-1 w-full bg-cover bg-bottom bg-[url('https://images.unsplash.com/photo-1569239591652-6cc3025b07fa?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] relative overflow-hidden">
          <div className="absolute text-white bottom-3 left-3">
            <div className="text-6xl block"> &ldquo;</div>
            <div className="text-lg mt-[-20px] w-[500px] font-bold">
              Together, we create sustainable farming through more efficient
              collaboration.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
