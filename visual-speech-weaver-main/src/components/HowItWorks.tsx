
import { Mic, Sparkles, ImageIcon, BrainCircuit } from "lucide-react";

const steps = [
  {
    icon: <Mic className="h-10 w-10 text-white" />,
    title: "Speak",
    description: "Share your ideas through voice or text input",
    color: "from-visuweave-purple to-visuweave-light-purple"
  },
  {
    icon: <BrainCircuit className="h-10 w-10 text-white" />,
    title: "Process",
    description: "Our AI analyzes your speech patterns and content",
    color: "from-visuweave-blue to-visuweave-purple"
  },
  {
    icon: <Sparkles className="h-10 w-10 text-white" />,
    title: "Generate",
    description: "Neural networks transform concepts into visuals",
    color: "from-visuweave-blue to-visuweave-light-blue"
  },
  {
    icon: <ImageIcon className="h-10 w-10 text-white" />,
    title: "Visualize",
    description: "See your ideas materialize as dynamic visualizations",
    color: "from-visuweave-light-blue to-visuweave-blue"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4 md:px-6 bg-visuweave-light-gray">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="text-visuweave-purple">VisuWeave</span> Works
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our advanced AI technology seamlessly transforms your speech into captivating visualizations 
            through a sophisticated four-step process
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`bg-gradient-to-r ${step.color} p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">{step.title}</h3>
              <p className="text-gray-600 text-center">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="relative mt-16 max-w-4xl mx-auto h-2">
          <div className="absolute inset-0 bg-gradient-to-r from-visuweave-purple via-visuweave-blue to-visuweave-light-blue rounded-full animate-pulse-slow"></div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
