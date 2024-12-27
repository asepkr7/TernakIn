import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { NewsLater } from "@/components/NewsLater";
import WhatWeDo from "@/components/WhatWeDo";

const LandingPage = () => {
  return (
    <div>
      <Hero />
      <WhatWeDo />
      <NewsLater />
      <Footer />
    </div>
  );
};

export default LandingPage;
