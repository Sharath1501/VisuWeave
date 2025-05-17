from manim import *
import os
import sys

class GenerateManimImage(Scene):
    def construct(self):
        math_object = self.create_math_object()
        self.add(math_object)
        self.wait(1)

    def create_math_object(self):
        """
        Create a mathematical shape or notation based on input text.
        """
        if "circle" in self.prompt.lower():
            return Circle(radius=2, color=BLUE)
        elif "square" in self.prompt.lower():
            return Square(side_length=2, color=GREEN)
        elif "triangle" in self.prompt.lower():
            return Triangle().scale(2).set_color(RED)
        elif "pi" in self.prompt.lower():
            return MathTex(r"\pi").scale(3)
        elif "integral" in self.prompt.lower():
            return MathTex(r"\int_a^b f(x) \,dx").scale(2)
        else:
            return Text("Invalid Input").scale(2)

    def __init__(self, prompt):
        super().__init__()
        self.prompt = prompt

def generate_manim_image(prompt, output_dir="manim_images"):
    """
    Generates an image using Manim and saves it as a PNG file.
    """
    os.makedirs(output_dir, exist_ok=True)
    filename = f"{prompt.replace(' ', '_')}.png"
    filepath = os.path.join(output_dir, filename)

    try:
        command = f"manim -pql -o {filename} -r 500,500 manim_generator.py GenerateManimImage"
        os.system(command)
        saved_path = os.path.join("media", "images", "manim_generator", filename)
        
        if os.path.exists(saved_path):
            os.rename(saved_path, filepath)
            print(filepath)  # Important: Print path for Node.js
            return filepath
        else:
            print("None")  # Indicate failure for Node.js
            return None
    except Exception as e:
        print(f"❌ Manim generation failed: {e}")
        print("None")  # Let Node.js know if it fails
        return None

# If run from Node.js, accept shape/notation name as a command-line argument
if __name__ == "__main__":
    if len(sys.argv) > 1:
        prompt = sys.argv[1]
        generate_manim_image(prompt)
