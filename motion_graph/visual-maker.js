class VisualMaker {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 600;
    this.canvas.height = 400;
    this.appleImg = null;
    
    document.getElementById('play-btn').addEventListener('click', async () => {
      await this.loadAppleImage();
      this.runAppleAnimation();
    });
  }

  async loadAppleImage() {
    this.appleImg = await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn('Could not load apple.jpg - using red circles instead');
        resolve(null);
      };
      img.src = 'images/apple.jpg';
    });
  }

  runAppleAnimation() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw initial state
    this.drawAppleGrid(150, 100, 2, 1); // 2 apples left (1 row)
    this.drawAppleGrid(450, 100, 3, 1); // 3 apples right (1 row)
    this.drawNumber('2', 150, 100);
    this.drawNumber('3', 450, 100);

    // Animation parameters
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Moving phase (0-70% of animation)
      if (progress < 0.7) {
        const offset = progress * 100;
        this.drawAppleGrid(150 + offset, 100 + offset*1.5, 2, 1);
        this.drawAppleGrid(450 - offset, 100 + offset*1.5, 3, 1);
        this.drawNumber('2', 150 + offset, 100 + offset*1.5);
        this.drawNumber('3', 450 - offset, 100 + offset*1.5);
      }
      
      // Merging phase (70-100% of animation)
      if (progress > 0.7) {
        const mergeProgress = (progress - 0.7) / 0.3;
        
        // Draw final 5-apple grid (2 rows: 2 apples top, 3 apples bottom)
        this.drawAppleGrid(300, 200, 5, 2, mergeProgress);
        this.drawNumber('5', 300, 200);
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  drawAppleGrid(centerX, centerY, count, rows, progress = 1) {
    const cols = Math.ceil(count / rows);
    const appleSize = 30;
    const spacing = 40;
    
    // Calculate grid dimensions
    const gridWidth = (cols - 1) * spacing;
    const gridHeight = (rows - 1) * spacing;
    
    // Calculate starting position (top-left of grid)
    const startX = centerX - gridWidth/2;
    const startY = centerY - gridHeight/2;
    
    // Draw apples with animation scaling
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = startX + col * spacing;
      const y = startY + row * spacing;
      
      const scale = 0.3 + (0.7 * progress); // Scale up during appearance
      const size = appleSize * scale;
      
      if (this.appleImg) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.scale(scale, scale);
        this.ctx.drawImage(this.appleImg, -appleSize/2, -appleSize/2, appleSize, appleSize);
        this.ctx.restore();
      } else {
        // Fallback red circle
        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(x, y, size/2, 0, Math.PI*2);
        this.ctx.fill();
      }
    }
  }

  drawNumber(num, x, y) {
    this.ctx.fillStyle = 'black';
    this.ctx.font = 'bold 24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(num, x, y - 40);
  }
}

// Initialize
new VisualMaker();