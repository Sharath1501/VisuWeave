import sys
import os
import uuid
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO

# ✅ Create the client with API key
client = genai.Client(api_key="AIzaSyCwz4MMWJnOqV75oFHMoWaWuLQ5MJ_A1HQ")

def generate_image(prompt):
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp-image-generation",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["Text", "Image"]
            )
        )

        for part in response.candidates[0].content.parts:
            if part.text:
                print("[Text Output] " + part.text, file=sys.stderr)  # Optional logging
            elif part.inline_data:
                image = Image.open(BytesIO(part.inline_data.data))
                os.makedirs("generated_images", exist_ok=True)
                filename = f"generated_images/{uuid.uuid4().hex}.png"
                image.save(filename)
                print(filename)  # ✅ Send to Node
                return

    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)

    print("None")  # Fallback if generation fails

if __name__ == "__main__":
    if len(sys.argv) > 1:
        prompt_text = sys.argv[1]
        generate_image(prompt_text)
    else:
        print("None")
