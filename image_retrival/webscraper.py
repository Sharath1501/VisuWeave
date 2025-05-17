import sys
import requests
from bs4 import BeautifulSoup
import os
from PIL import Image
from io import BytesIO

def scrape_image_from_web(keyword, output_dir="downloaded_images"):
    os.makedirs(output_dir, exist_ok=True)
    search_url = f"https://www.google.com/search?q={keyword}&tbm=isch"

    try:
        response = requests.get(search_url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        img_tags = soup.find_all('img')

        if not img_tags or len(img_tags) < 2:
            print("No suitable images found.")
            return None

        img_url = img_tags[1].get('src') or img_tags[1].get('data-src')

        if not img_url:
            print("Could not find a valid image URL.")
            return None

        try:
            img_response = requests.get(img_url, stream=True, timeout=10)
            img_response.raise_for_status()
            image = Image.open(BytesIO(img_response.content))

            filename = f"{keyword.replace(' ', '_')}.jpg"
            filepath = os.path.join(output_dir, filename)
            image.save(filepath, "JPEG")
            print(filepath)  # This is what your Node.js script will read as output
            return filepath

        except Exception as e:
            print(f"Image download/processing error: {e}")
            return None

    except Exception as e:
        print(f"Search request error: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("No keyword provided.")
        sys.exit(1)

    keyword = sys.argv[1]
    image_path = scrape_image_from_web(keyword)
    if not image_path:
        print("Failed to retrieve image.")
        sys.exit(1)
