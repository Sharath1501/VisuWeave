
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mic } from "lucide-react";
import { Link } from "react-router-dom";

const Visualize = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-visuweave-light-purple/10 via-white to-visuweave-light-blue/10 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button asChild variant="ghost" className="text-visuweave-purple hover:text-visuweave-dark-purple hover:bg-visuweave-purple/10">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-xl md:text-2xl font-bold text-visuweave-purple">VisuWeave</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 mt-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Start Speaking to Create Visualizations
            </h2>
            <p className="text-gray-600 mb-8">
              This is where you'll interact with VisuWeave. When implemented, this interface will
              transform your speech into dynamic visualizations in real-time.
            </p>
            
            <div className="bg-visuweave-purple/10 p-10 rounded-xl border-2 border-dashed border-visuweave-purple/30 flex flex-col items-center">
              <Button className="bg-visuweave-purple hover:bg-visuweave-dark-purple text-white rounded-full h-16 w-16 p-0">
                <Mic className="h-6 w-6" />
              </Button>
              <p className="mt-4 text-gray-700">Press to start speaking</p>
            </div>
          </div>
          
          <div className="mt-10 p-8 bg-visuweave-light-gray rounded-xl text-center">
            <p className="text-gray-500 italic">
              Your visualizations will appear here as you speak
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualize;
