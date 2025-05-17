class PythagorasVisualizer {
  constructor() {
      this.canvas = document.getElementById('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = 800;
      this.canvas.height = 600;
      
      // Ensure all content fits by scaling down if needed
      this.scaleFactor = Math.min(1, 800/this.canvas.width, 600/this.canvas.height);
      
      document.getElementById('play-btn').addEventListener('click', () => {
          this.runPythagorasAnimation();
      });
      
      document.getElementById('reset-btn').addEventListener('click', () => {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      });
  }

  runPythagorasAnimation() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Triangle points (right angle at A) - positioned to fit perfectly
      const A = { x: 150 * this.scaleFactor, y: 400 * this.scaleFactor };
      const B = { x: 150 * this.scaleFactor, y: 200 * this.scaleFactor };
      const C = { x: 500 * this.scaleFactor, y: 400 * this.scaleFactor };
      
      // Side lengths
      const a = C.x - A.x; // horizontal side
      const b = A.y - B.y; // vertical side
      const c = Math.sqrt(a*a + b*b); // hypotenuse

      const duration = 4000; // 4 second animation
      const startTime = performance.now();

      const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          
          // Phase 1: Draw triangle (0-30%)
          if (progress < 0.3) {
              const phaseProgress = progress / 0.3;
              this.drawTriangle(A, B, C, phaseProgress);
          } else {
              this.drawTriangle(A, B, C, 1);
              
              // Phase 2: Draw squares (30-60%)
              if (progress < 0.6) {
                  const phaseProgress = (progress - 0.3) / 0.3;
                  this.drawSquare(A, B, phaseProgress, '#3498db', 'a²');
                  this.drawSquare(A, C, phaseProgress, '#e74c3c', 'b²');
                  this.drawSquare(B, C, phaseProgress, '#2ecc71', 'c²');
              } else {
                  // Phase 3: Show formula (60-100%)
                  const phaseProgress = (progress - 0.6) / 0.4;
                  this.showFormula(phaseProgress, a, b, c);
              }
          }
          
          if (progress < 1) {
              requestAnimationFrame(animate);
          }
      };
      
      requestAnimationFrame(animate);
  }

  drawTriangle(A, B, C, progress) {
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 3 * this.scaleFactor;
      this.ctx.beginPath();
      this.ctx.moveTo(A.x, A.y);
      
      // Animate drawing
      if (progress < 0.33) {
          const p = progress / 0.33;
          this.ctx.lineTo(A.x + (B.x-A.x)*p, A.y + (B.y-A.y)*p);
      } else if (progress < 0.66) {
          this.ctx.lineTo(B.x, B.y);
          const p = (progress - 0.33) / 0.33;
          this.ctx.lineTo(B.x + (C.x-B.x)*p, B.y + (C.y-B.y)*p);
      } else {
          this.ctx.lineTo(B.x, B.y);
          this.ctx.lineTo(C.x, C.y);
          const p = (progress - 0.66) / 0.34;
          this.ctx.lineTo(C.x + (A.x-C.x)*p, C.y + (A.y-C.y)*p);
      }
      
      this.ctx.stroke();
      
      // Right angle indicator
      if (progress > 0.66) {
          const size = 20 * this.scaleFactor;
          this.ctx.strokeStyle = '#e74c3c';
          this.ctx.strokeRect(A.x, A.y - size, size, size);
      }
  }

  drawSquare(p1, p2, progress, color, label) {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const perpX = -dy;
      const perpY = dx;
      
      const square = [
          { x: p1.x, y: p1.y },
          { x: p2.x, y: p2.y },
          { x: p2.x + perpX, y: p2.y + perpY },
          { x: p1.x + perpX, y: p1.y + perpY }
      ];
      
      // Animate drawing
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2 * this.scaleFactor;
      this.ctx.beginPath();
      this.ctx.moveTo(square[0].x, square[0].y);
      
      for (let i = 1; i <= 4 * progress; i++) {
          const idx = Math.min(Math.floor(i), 3);
          this.ctx.lineTo(square[idx].x, square[idx].y);
      }
      
      this.ctx.stroke();
      
      // Label
      if (progress > 0.5) {
          const centerX = (square[0].x + square[2].x) / 2;
          const centerY = (square[0].y + square[2].y) / 2;
          
          this.ctx.fillStyle = color;
          this.ctx.font = `${20 * this.scaleFactor}px Arial`;
          this.ctx.textAlign = 'center';
          this.ctx.fillText(label, centerX, centerY);
      }
  }

  showFormula(progress, a, b, c) {
      const formulaX = 550 * this.scaleFactor;
      const formulaY = 150 * this.scaleFactor;
      const spacing = 35 * this.scaleFactor;
      
      this.ctx.fillStyle = '#000';
      this.ctx.font = `bold ${24 * this.scaleFactor}px Arial`;
      this.ctx.textAlign = 'left';
      
      // Animate text appearance
      if (progress > 0.25) {
          this.ctx.globalAlpha = Math.min((progress - 0.25) / 0.25, 1);
          this.ctx.fillText('Pythagoras Theorem:', formulaX, formulaY);
      }
      if (progress > 0.5) {
          this.ctx.font = `bold ${32 * this.scaleFactor}px Arial`;
          this.ctx.fillStyle = '#3498db';
          this.ctx.fillText('a² + b² = c²', formulaX, formulaY + spacing);
      }
      if (progress > 0.75) {
          this.ctx.font = `${20 * this.scaleFactor}px Arial`;
          this.ctx.fillStyle = '#2c3e50';
          this.ctx.fillText(`Here: ${a.toFixed(0)}² + ${b.toFixed(0)}² = ${c.toFixed(1)}²`, 
                          formulaX, formulaY + spacing*2);
          this.ctx.fillText(`${Math.round(a*a)} + ${Math.round(b*b)} = ${Math.round(c*c)}`, 
                          formulaX, formulaY + spacing*3);
      }
      this.ctx.globalAlpha = 1;
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  new PythagorasVisualizer();
});