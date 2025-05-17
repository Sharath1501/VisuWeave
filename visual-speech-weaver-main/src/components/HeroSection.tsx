
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative py-20 px-4 md:px-6 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-visuweave-light-purple/20 via-visuweave-light-blue/10 to-transparent -z-10" />
      
      {/* Content container */}
      <div className="max-w-5xl mx-auto text-center">
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            <span className="text-visuweave-purple">VisuWeave</span> –{" "}
            <span className="bg-gradient-to-r from-visuweave-purple to-visuweave-blue bg-clip-text text-transparent">
              Transforming Speech into Dynamic Visualizations
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Experience the power of AI-driven visualization as your words come to life. 
            VisuWeave turns spoken ideas into stunning visual representations in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild className="bg-visuweave-purple hover:bg-visuweave-dark-purple text-white px-8 py-6 rounded-full text-lg">
              <Link to="/visualize">
                Try VisuWeave
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" className="border-visuweave-purple text-visuweave-purple hover:bg-visuweave-purple/10 px-8 py-6 rounded-full text-lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
