
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <CTASection />
      
      <footer className="py-8 px-4 text-center text-gray-600 border-t border-gray-200">
        <p>© {new Date().getFullYear()} VisuWeave. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
