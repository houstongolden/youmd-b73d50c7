import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemStrip from "@/components/ProblemStrip";
import HowItWorks from "@/components/HowItWorks";
import WhatsInside from "@/components/WhatsInside";
import OpenSpec from "@/components/OpenSpec";
import Integrations from "@/components/Integrations";
import Pricing from "@/components/Pricing";
import CTAFooter from "@/components/CTAFooter";

const Index = () => (
  <div className="landing-page">
    <Navbar />
    <Hero />
    <ProblemStrip />
    <HowItWorks />
    <WhatsInside />
    <OpenSpec />
    <Integrations />
    <Pricing />
    <CTAFooter />
  </div>
);

export default Index;
