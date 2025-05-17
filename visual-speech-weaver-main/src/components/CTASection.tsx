
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 px-4 md:px-6 bg-gradient-to-br from-visuweave-purple/10 via-visuweave-blue/5 to-visuweave-light-blue/10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to transform your ideas into stunning visuals?
        </h2>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Experience the power of VisuWeave and see your words come to life through
          dynamic, AI-generated visualizations.
        </p>
        <Button asChild className="bg-visuweave-purple hover:bg-visuweave-dark-purple text-white px-10 py-6 rounded-full text-lg">
          <Link to="/visualize">
            Try VisuWeave Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
