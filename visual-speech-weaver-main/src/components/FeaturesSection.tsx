
import { Zap, Clock, Palette, Sparkles, BarChart, Users } from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Real-time Visualization",
    description: "See your words transform into visuals instantly as you speak, providing immediate feedback and inspiration.",
    gradient: "from-visuweave-purple to-visuweave-light-purple"
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "AI-Powered Generation",
    description: "Advanced neural networks understand context and nuance to create relevant, creative visualizations.",
    gradient: "from-visuweave-blue to-visuweave-purple"
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Instant Results",
    description: "No waiting for processing - get immediate visual representations as you communicate your ideas.",
    gradient: "from-visuweave-light-blue to-visuweave-blue"
  },
  {
    icon: <Palette className="h-8 w-8" />,
    title: "Creative Control",
    description: "Adjust and refine the generated visualizations to match your exact vision and requirements.",
    gradient: "from-visuweave-purple to-visuweave-blue"
  },
  {
    icon: <BarChart className="h-8 w-8" />,
    title: "Data Visualization",
    description: "Transform complex data descriptions into clear, insightful charts and graphics through natural language.",
    gradient: "from-visuweave-blue to-visuweave-light-blue"
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Collaborative Creation",
    description: "Work together with team members to build visualizations through combined speech input and feedback.",
    gradient: "from-visuweave-light-purple to-visuweave-purple"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful <span className="text-visuweave-purple">Features</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            VisuWeave combines cutting-edge AI with intuitive design to transform how you visualize ideas
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
