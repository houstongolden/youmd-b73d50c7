import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProfilesShowcase from "@/components/ProfilesShowcase";
import ProblemStrip from "@/components/ProblemStrip";
import HowItWorks from "@/components/HowItWorks";
import WhatsInside from "@/components/WhatsInside";
import PortraitSection from "@/components/PortraitSection";
import OpenSpec from "@/components/OpenSpec";
import Integrations from "@/components/Integrations";
import Pricing from "@/components/Pricing";
import CTAFooter from "@/components/CTAFooter";

const Index = () => (
  <div>
    <Navbar />
    <Hero />
    <ProfilesShowcase />
    <ProblemStrip />
    <HowItWorks />
    <WhatsInside />
    <PortraitSection />
    <OpenSpec />
    <Integrations />
    <Pricing />
    <CTAFooter />
  </div>
);

export default Index;
