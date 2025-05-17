import os
import requests
import numpy as np
import nltk
import torch
from PIL import Image
from bs4 import BeautifulSoup
from collections import Counter
from torchvision.models import resnet50, ResNet50_Weights
from torch.nn.functional import cosine_similarity
from torchvision import transforms
from io import BytesIO
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from skimage.metrics import structural_similarity as ssim
from langchain.text_splitter import RecursiveCharacterTextSplitter
from torchvision.datasets import CIFAR10
from torch.utils.data import DataLoader, random_split
from torch.nn import CrossEntropyLoss
from torch.optim import Adam
from sklearn.metrics import precision_score, recall_score, f1_score

# --- Config ---
CHUNK_SIZE_T = 150
CHUNK_OVERLAP = 30
SSIM_THRESHOLD = 0.75
SIMILARITY_THRESHOLD = 0.7
TARGET_SIZE = (224, 224)
OUTPUT_DIR = "extracted_images"
FEATURE_LAYER = 'layer4'
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
CIFAR10_BATCH_SIZE = 32  # Reduced batch size
CIFAR10_LR = 0.001
CIFAR10_EPOCHS = 1
CIFAR10_ROOT = "./data"

# --- Init ---
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('averaged_perceptron_tagger', quiet=True)

# --- Helper Functions ---
def extract_nouns(text, num_keywords=3):
    stop_words = set(stopwords.words('english'))
    words = word_tokenize(text.lower())
    tagged = nltk.pos_tag(words)
    nouns = [word for (word, tag) in tagged if tag.startswith("NN") and word not in stop_words and word.isalnum()]
    return [word for word, _ in Counter(nouns).most_common(num_keywords)]

def get_or_scrape_image(keyword):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    fname = f"{keyword.replace(' ', '_')}.jpg"
    fpath = os.path.join(OUTPUT_DIR, fname)
    if os.path.exists(fpath):
        return fpath
    try:
        url = f"https://www.google.com/search?q={keyword}&tbm=isch"
        headers = {'User-Agent': 'Mozilla/5.0'}
        res = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(res.text, 'html.parser')
        img_url = soup.find_all('img')[1].get('src')
        img_data = requests.get(img_url, timeout=10).content
        img = Image.open(BytesIO(img_data)).convert('RGB').resize(TARGET_SIZE)
        img.save(fpath)
        return fpath
    except:
        return None

def calculate_ssim(img1, img2):
    return ssim(np.array(img1.convert('L')), np.array(img2.convert('L')), data_range=255)

def get_image_features(image, model, transform):
    image_t = transform(image).unsqueeze(0).to(DEVICE)
    features = []

    def hook(module, input, output):
        features.append(output.flatten(start_dim=1).detach().cpu().numpy())

    handle = model._modules.get(FEATURE_LAYER).register_forward_hook(hook)
    model(image_t)
    handle.remove()
    return features[0]

def calculate_cosine_similarity(f1, f2):
    t1 = torch.tensor(f1).float()
    t2 = torch.tensor(f2).float()
    return cosine_similarity(t1, t2).item()

def fuse_chunks(image_paths):
    images = [Image.open(p).resize(TARGET_SIZE).convert('L') for p in image_paths]
    arrays = [np.array(im) for im in images]
    avg_array = np.mean(arrays, axis=0).astype(np.uint8)
    return Image.fromarray(avg_array).convert('RGB')

def print_similarity(title, ssim_score, cosine_score, border=False):
    print(f"[{title}]")
    print(f"  SSIM: {ssim_score:.4f}")
    print(f"  Cosine Similarity: {cosine_score:.4f}")
    print("-" * 40 if not border else "=" * 40)

# --- CIFAR-10 Training and Evaluation ---
def train_and_evaluate_cifar10(model):
    # Load CIFAR-10 dataset with separate transforms
    cifar10_transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])
    dataset = CIFAR10(root=CIFAR10_ROOT, train=True, download=True, transform=cifar10_transform)

    # Verify dataset is not empty
    if len(dataset) == 0:
        print("CIFAR-10 dataset is empty or not correctly loaded.")
        return

    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size
    train_dataset, val_dataset = random_split(dataset, [train_size, val_size])
    train_loader = DataLoader(train_dataset, batch_size=CIFAR10_BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=CIFAR10_BATCH_SIZE, shuffle=False)

    # Define loss and optimizer
    criterion = CrossEntropyLoss()
    optimizer = Adam(model.parameters(), lr=CIFAR10_LR)

    # Training loop
    for epoch in range(CIFAR10_EPOCHS):
        model.train()
        for images, labels in train_loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

    # Validation loop
    model.eval()
    correct = 0
    total = 0
    predicted_labels = []
    actual_labels = []
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            outputs = model(images)
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            predicted_labels.extend(predicted.cpu().numpy())
            actual_labels.extend(labels.cpu().numpy())

    accuracy = correct / total
    precision = precision_score(actual_labels, predicted_labels, average='macro')
    recall = recall_score(actual_labels, predicted_labels, average='macro')
    f1 = f1_score(actual_labels, predicted_labels, average='macro')

    print("\n=== CIFAR-10 Evaluation ===")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1 Score: {f1:.4f}")

# --- Main Processing ---
def main():
    text = """let’s talk about the circulatory system. The heart plays a central role in pumping blood throughout the body. Its basic structure includes the right cardiac muscle, which pushes deoxygenated blood toward the lungs, and the left cardiac muscle, which pumps oxygenated blood to the body. Blood enters through the inferior vena cava, travels to the lungs via the pulmonary artery, and returns through the veins once it’s oxygenated. Finally, the aorta carries this oxygen-rich blood to all parts of the body."""

    splitter = RecursiveCharacterTextSplitter(chunk_size=CHUNK_SIZE_T, chunk_overlap=CHUNK_OVERLAP)
    chunks = splitter.split_text(text.strip())

    print("=== CHUNKS AND EXTRACTED NOUNS ===")
    chunk_keywords = []
    for i, chunk in enumerate(chunks):
        keywords = extract_nouns(chunk)
        chunk_keywords.append(keywords)
        print(f"\nCHUNK {i + 1}: {chunk}")
        print(f"  Extracted Nouns: {keywords}")

    weights = ResNet50_Weights.DEFAULT
    model = resnet50(weights=weights).to(DEVICE)
    model.fc = torch.nn.Linear(model.fc.in_features, 10)
    transform = weights.transforms()

    chunk_images = []
    chunk_representations = []

    print("\n=== PROCESSING INDIVIDUAL CHUNKS ===\n")
    for idx, (chunk, keywords) in enumerate(zip(chunks, chunk_keywords)):
        image_paths = [get_or_scrape_image(k) for k in keywords if k]
        image_paths = [p for p in image_paths if p]

        if len(image_paths) < 1:
            print(f"CHUNK {idx + 1}: Insufficient images to process.")
            continue

        images = [Image.open(p).resize(TARGET_SIZE).convert('RGB') for p in image_paths]
        features = [get_image_features(img, model, transform) for img in images]

        if images:
            chunk_representations.append((images[0], images[-1], features[0], features[-1]))
            chunk_images.append(image_paths)

            if len(images) >= 2:
                print(f"CHUNK {idx + 1} Comparing: {keywords[0]} vs {keywords[-1]}")
                ssim_score = calculate_ssim(images[0], images[-1])
                cosine_score = calculate_cosine_similarity(features[0], features[-1])
                status = "GOOD" if ssim_score >= SSIM_THRESHOLD and cosine_score >= SIMILARITY_THRESHOLD else "BAD"
                print_similarity(f"CHUNK {idx + 1} (Internal)", ssim_score, cosine_score)
                #print(f"  Chunk Comparison Status: {status}")
                print("-" * 40)
            else:
                print_similarity(f"CHUNK {idx + 1} (Single Image)", 1.0, 1.0)
                print(f"  Chunk Comparison Status: GOOD")
                print("-" * 40)

    all_images_flat = [item for sublist in chunk_images for item in sublist]
    fused_img = None
    fused_features = None

    if all_images_flat:
        fused_img = fuse_chunks(all_images_flat)
        fused_features = get_image_features(fused_img, model, transform)
        print_similarity("FUSED CHUNK (Representation)", 1.0, 1.0, border=True)

        print("\n=== EVALUATING CHUNKS AGAINST FUSED REPRESENTATION ===\n")
        for idx, (img_start, img_end, feat_start, feat_end) in enumerate(chunk_representations):
            print(f"CHUNK {idx + 1} Keywords: {chunk_keywords[idx]}")
            ssim_start = calculate_ssim(img_start, fused_img)
            cosine_start = calculate_cosine_similarity(feat_start, fused_features)
            print_similarity(f"CHUNK {idx + 1} (Start vs Fused)", ssim_start, cosine_start)

            ssim_end = calculate_ssim(img_end, fused_img)
            cosine_end = calculate_cosine_similarity(feat_end, fused_features)
            print_similarity(f"CHUNK {idx + 1} (End vs Fused)", ssim_end, cosine_end)

        if chunk_representations:
            avg_ssim_to_fused_start = np.mean([calculate_ssim(rep[0], fused_img) for rep in chunk_representations])
            avg_cosine_to_fused_start = np.mean([calculate_cosine_similarity(rep[2], fused_features) for rep in chunk_representations])
            avg_ssim_to_fused_end = np.mean([calculate_ssim(rep[1], fused_img) for rep in chunk_representations])
            avg_cosine_to_fused_end = np.mean([calculate_cosine_similarity(rep[3], fused_features) for rep in chunk_representations])

            overall_ssim_to_fused = (avg_ssim_to_fused_start + avg_ssim_to_fused_end) / 2
            overall_cosine_to_fused = (avg_cosine_to_fused_start + avg_cosine_to_fused_end) / 2
            fused_status = "GOOD" if overall_ssim_to_fused >= SSIM_THRESHOLD and overall_cosine_to_fused >= SIMILARITY_THRESHOLD else "BAD"
            print("\n=== FUSED CHUNK EVALUATION ===")
            print(f"Average SSIM to Fused: {overall_ssim_to_fused:.4f}")
            print(f"Average Cosine Similarity to Fused: {overall_cosine_to_fused:.4f}")
            #print(f"Fused Chunk Status: {fused_status}")
        else:
            print("\n=== FUSED CHUNK EVALUATION ===")
            print("No chunks were processed to evaluate the fused chunk.")
    else:
        print("\n=== FUSED CHUNK EVALUATION ===")
        print("No images were available to create a fused chunk.")

    # Train and evaluate CIFAR-10
    train_and_evaluate_cifar10(model)

if __name__ == "__main__":
    main()

