import { Component, OnInit, OnDestroy, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-space-background',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #canvas class="space-canvas"></canvas>`,
  styles: [`
    .space-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    }
  `],
})
export class SpaceBackgroundComponent implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private themeService = inject(ThemeService);
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animationId = 0;
  private stars: Star[] = [];
  private shootingStars: ShootingStar[] = [];
  private planets: Planet[] = [];
  private rockets: Rocket[] = [];
  private nebulae: Nebula[] = [];

  ngOnInit() {
    this.canvas = this.el.nativeElement.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.resize();
    this.initStars();
    this.initPlanets();
    this.initNebulae();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initStars() {
    this.stars = [];
    const count = Math.min(200, Math.floor((this.canvas.width * this.canvas.height) / 5000));
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        color: this.getStarColor(),
      });
    }
  }

  getStarColor(): string {
    const colors = [
      '255, 255, 255',
      '200, 220, 255',
      '255, 220, 180',
      '180, 200, 255',
      '255, 200, 200',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  initPlanets() {
    this.planets = [];
    for (let i = 0; i < 3; i++) {
      this.planets.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 20 + 10,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.1,
        color1: this.getRandomPlanetColor(),
        color2: this.getRandomPlanetColor(),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        hasRing: Math.random() > 0.6,
      });
    }
  }

  getRandomPlanetColor(): string {
    const colors = ['#6B8DD6', '#E8A87C', '#A8E6CF', '#D35400', '#8E44AD', '#3498DB'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  initNebulae() {
    this.nebulae = [];
    for (let i = 0; i < 2; i++) {
      this.nebulae.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 300 + 200,
        color: i === 0 ? 'rgba(138, 43, 226, 0.03)' : 'rgba(65, 105, 225, 0.03)',
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  spawnShootingStar() {
    if (this.shootingStars.length < 3 && Math.random() < 0.005) {
      this.shootingStars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height * 0.5,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 4,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        opacity: 1,
        trail: [],
      });
    }
  }

  spawnRocket() {
    if (this.rockets.length < 2 && Math.random() < 0.001) {
      this.rockets.push({
        x: -50,
        y: Math.random() * this.canvas.height * 0.8,
        speed: Math.random() * 1.5 + 0.8,
        angle: -0.2 + Math.random() * 0.4,
        size: Math.random() * 8 + 6,
        flame: 0,
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const isDark = this.themeService.theme() === 'dark';

    if (isDark) {
      this.drawNebulae();
      this.drawStars();
      this.spawnShootingStar();
      this.drawShootingStars();
      this.spawnRocket();
      this.drawRockets();
      this.drawPlanets();
    } else {
      this.drawLightModeStars();
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  drawStars() {
    for (const star of this.stars) {
      star.opacity += star.twinkleSpeed;
      if (star.opacity > 1 || star.opacity < 0.2) {
        star.twinkleSpeed *= -1;
      }

      star.y += star.speed;
      if (star.y > this.canvas.height) {
        star.y = 0;
        star.x = Math.random() * this.canvas.width;
      }

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${star.color}, ${star.opacity})`;
      this.ctx.fill();

      // Glow effect for larger stars
      if (star.size > 1.5) {
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${star.color}, ${star.opacity * 0.1})`;
        this.ctx.fill();
      }
    }
  }

  drawLightModeStars() {
    for (const star of this.stars) {
      star.opacity += star.twinkleSpeed * 0.3;
      if (star.opacity > 0.4 || star.opacity < 0.1) {
        star.twinkleSpeed *= -1;
      }

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(100, 116, 139, ${star.opacity})`;
      this.ctx.fill();
    }
  }

  drawShootingStars() {
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const ss = this.shootingStars[i];

      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.opacity -= 0.015;

      ss.trail.push({ x: ss.x, y: ss.y, opacity: ss.opacity });
      if (ss.trail.length > 20) ss.trail.shift();

      // Draw trail
      for (let j = 0; j < ss.trail.length; j++) {
        const t = ss.trail[j];
        const alpha = (j / ss.trail.length) * ss.opacity * 0.5;
        this.ctx.beginPath();
        this.ctx.arc(t.x, t.y, 1.5 * (j / ss.trail.length), 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.ctx.fill();
      }

      // Draw head
      this.ctx.beginPath();
      this.ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${ss.opacity})`;
      this.ctx.fill();

      // Glow
      const gradient = this.ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 8);
      gradient.addColorStop(0, `rgba(200, 220, 255, ${ss.opacity * 0.5})`);
      gradient.addColorStop(1, 'transparent');
      this.ctx.beginPath();
      this.ctx.arc(ss.x, ss.y, 8, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();

      if (ss.opacity <= 0 || ss.x > this.canvas.width + 100 || ss.y > this.canvas.height + 100) {
        this.shootingStars.splice(i, 1);
      }
    }
  }

  drawPlanets() {
    for (const planet of this.planets) {
      planet.x += planet.speedX;
      planet.y += planet.speedY;
      planet.rotation += planet.rotationSpeed;

      // Wrap around
      if (planet.x > this.canvas.width + 50) planet.x = -50;
      if (planet.x < -50) planet.x = this.canvas.width + 50;
      if (planet.y > this.canvas.height + 50) planet.y = -50;
      if (planet.y < -50) planet.y = this.canvas.height + 50;

      this.ctx.save();
      this.ctx.translate(planet.x, planet.y);
      this.ctx.rotate(planet.rotation);

      // Planet body
      const gradient = this.ctx.createRadialGradient(
        -planet.size * 0.3, -planet.size * 0.3, 0,
        0, 0, planet.size
      );
      gradient.addColorStop(0, planet.color1);
      gradient.addColorStop(1, planet.color2);
      this.ctx.beginPath();
      this.ctx.arc(0, 0, planet.size, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();

      // Shadow
      const shadowGradient = this.ctx.createRadialGradient(
        planet.size * 0.5, planet.size * 0.5, 0,
        0, 0, planet.size
      );
      shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
      shadowGradient.addColorStop(1, 'transparent');
      this.ctx.beginPath();
      this.ctx.arc(0, 0, planet.size, 0, Math.PI * 2);
      this.ctx.fillStyle = shadowGradient;
      this.ctx.fill();

      // Ring
      if (planet.hasRing) {
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, planet.size * 1.8, planet.size * 0.4, 0, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(255, 255, 255, 0.2)`;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }

      this.ctx.restore();

      // Glow
      const glowGradient = this.ctx.createRadialGradient(
        planet.x, planet.y, planet.size,
        planet.x, planet.y, planet.size * 2
      );
      glowGradient.addColorStop(0, `rgba(255, 255, 255, 0.05)`);
      glowGradient.addColorStop(1, 'transparent');
      this.ctx.beginPath();
      this.ctx.arc(planet.x, planet.y, planet.size * 2, 0, Math.PI * 2);
      this.ctx.fillStyle = glowGradient;
      this.ctx.fill();
    }
  }

  drawRockets() {
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const rocket = this.rockets[i];

      rocket.x += Math.cos(rocket.angle) * rocket.speed * 3;
      rocket.y += Math.sin(rocket.angle) * rocket.speed;
      rocket.flame += 0.3;

      this.ctx.save();
      this.ctx.translate(rocket.x, rocket.y);
      this.ctx.rotate(rocket.angle);

      // Flame
      const flameLength = Math.sin(rocket.flame) * rocket.size * 0.8 + rocket.size * 0.5;
      const flameGradient = this.ctx.createLinearGradient(-rocket.size, 0, -rocket.size - flameLength, 0);
      flameGradient.addColorStop(0, 'rgba(255, 200, 50, 0.9)');
      flameGradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.7)');
      flameGradient.addColorStop(1, 'transparent');
      this.ctx.beginPath();
      this.ctx.moveTo(-rocket.size * 0.3, -rocket.size * 0.2);
      this.ctx.lineTo(-rocket.size - flameLength, 0);
      this.ctx.lineTo(-rocket.size * 0.3, rocket.size * 0.2);
      this.ctx.closePath();
      this.ctx.fillStyle = flameGradient;
      this.ctx.fill();

      // Rocket body
      this.ctx.beginPath();
      this.ctx.moveTo(rocket.size, 0);
      this.ctx.lineTo(-rocket.size * 0.5, -rocket.size * 0.3);
      this.ctx.lineTo(-rocket.size * 0.5, rocket.size * 0.3);
      this.ctx.closePath();
      this.ctx.fillStyle = '#E2E8F0';
      this.ctx.fill();

      // Window
      this.ctx.beginPath();
      this.ctx.arc(rocket.size * 0.2, 0, rocket.size * 0.15, 0, Math.PI * 2);
      this.ctx.fillStyle = '#60A5FA';
      this.ctx.fill();

      // Fins
      this.ctx.beginPath();
      this.ctx.moveTo(-rocket.size * 0.3, -rocket.size * 0.3);
      this.ctx.lineTo(-rocket.size * 0.6, -rocket.size * 0.5);
      this.ctx.lineTo(-rocket.size * 0.5, -rocket.size * 0.3);
      this.ctx.closePath();
      this.ctx.fillStyle = '#EF4444';
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(-rocket.size * 0.3, rocket.size * 0.3);
      this.ctx.lineTo(-rocket.size * 0.6, rocket.size * 0.5);
      this.ctx.lineTo(-rocket.size * 0.5, rocket.size * 0.3);
      this.ctx.closePath();
      this.ctx.fillStyle = '#EF4444';
      this.ctx.fill();

      this.ctx.restore();

      if (rocket.x > this.canvas.width + 100) {
        this.rockets.splice(i, 1);
      }
    }
  }

  drawNebulae() {
    for (const nebula of this.nebulae) {
      nebula.pulse += 0.005;
      const scale = 1 + Math.sin(nebula.pulse) * 0.1;
      const alpha = 0.3 + Math.sin(nebula.pulse) * 0.1;

      const gradient = this.ctx.createRadialGradient(
        nebula.x, nebula.y, 0,
        nebula.x, nebula.y, nebula.size * scale
      );
      gradient.addColorStop(0, `rgba(138, 43, 226, ${0.04 * alpha})`);
      gradient.addColorStop(0.5, `rgba(99, 102, 241, ${0.02 * alpha})`);
      gradient.addColorStop(1, 'transparent');

      this.ctx.beginPath();
      this.ctx.arc(nebula.x, nebula.y, nebula.size * scale, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    }
  }
}

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkleSpeed: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  trail: { x: number; y: number; opacity: number }[];
}

interface Planet {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color1: string;
  color2: string;
  rotation: number;
  rotationSpeed: number;
  hasRing: boolean;
}

interface Rocket {
  x: number;
  y: number;
  speed: number;
  angle: number;
  size: number;
  flame: number;
}

interface Nebula {
  x: number;
  y: number;
  size: number;
  color: string;
  pulse: number;
}
