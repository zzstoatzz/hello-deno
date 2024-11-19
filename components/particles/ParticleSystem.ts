import { Particle } from "./Particle.ts";
import type { Vector2D } from "./types.ts";

export class ParticleSystem {
  private particles: Particle[] = [];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private mousePos: Vector2D = { x: 0, y: 0 };
  private isMouseDown = false;

  private settings = {
    particleCount: 1200,
    minRadius: 1,
    maxRadius: 4,
    attractConstant: -900,
    gravity: 0,
    interactionRadius: 100,
    dragConstant: 0.13,
    elasticity: 0.3,
    initialVelocity: 2,
    explosionRadius: 200,
    explosionForce: 25,
    smoothingFactor: 0.2,
    connectionOpacity: 0.3,
    trailOpacity: 0.1,
    trailEnabled: true
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    
    this.initializeParticles();
    this.setupEventListeners();
    this.bindSettingsControls();
  }

  private initializeParticles() {
    // Clear existing particles first
    this.particles = [];
    
    const palette = [
      'rgba(142, 106, 63, 0.6)',
      'rgba(113, 98, 83, 0.6)',
      'rgba(94, 75, 60, 0.6)',
      'rgba(66, 92, 73, 0.6)',
      'rgba(152, 151, 100, 0.6)',
    ];

    for (let i = 0; i < this.settings.particleCount; i++) {
      const radius = this.settings.minRadius + 
        Math.random() * (this.settings.maxRadius - this.settings.minRadius);
      const color = palette[Math.floor(Math.random() * palette.length)];
      
      this.particles.push(new Particle(
        { width: this.canvas.width, height: this.canvas.height },
        radius,
        color,
        this.settings.initialVelocity
      ));
    }
  }

  private setupEventListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    });

    this.canvas.addEventListener('mousedown', () => this.isMouseDown = true);
    this.canvas.addEventListener('mouseup', () => this.isMouseDown = false);
    this.canvas.addEventListener('mouseleave', () => this.isMouseDown = false);
  }

  private drawConnections() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = `rgba(73, 35, 209, ${this.settings.connectionOpacity})`;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].position.x - this.particles[j].position.x;
        const dy = this.particles[i].position.y - this.particles[j].position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.settings.interactionRadius) {
          this.ctx.moveTo(this.particles[i].position.x, this.particles[i].position.y);
          this.ctx.lineTo(this.particles[j].position.x, this.particles[j].position.y);
        }
      }
    }
    
    this.ctx.stroke();
  }

  animate() {
    // Clear canvas with configurable fade effect
    if (this.settings.trailEnabled) {
      this.ctx.fillStyle = `rgba(0, 0, 0, ${1 - this.settings.trailOpacity})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
      // If trails are disabled, clear completely
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      // Update particle physics
      this.particles[i].update(
        { x: this.canvas.width, y: this.canvas.height },
        1/60,
        {
          gravity: this.settings.gravity,
          dragConstant: this.settings.dragConstant,
          elasticity: this.settings.elasticity
        }
      );

      // Handle particle interactions
      for (let j = i + 1; j < this.particles.length; j++) {
        this.particles[i].interactWith(this.particles[j], {
          attractConstant: this.settings.attractConstant,
          interactionRadius: this.settings.interactionRadius,
          smoothingFactor: this.settings.smoothingFactor
        });
      }

      // Handle mouse interaction if mouse is down
      if (this.isMouseDown) {
        this.particles[i].applyMouseForce(this.mousePos, {
          explosionRadius: this.settings.explosionRadius,
          explosionForce: this.settings.explosionForce
        });
      }
    }

    // Draw connections between nearby particles
    this.drawConnections();

    // Draw particles
    this.ctx.globalAlpha = 1.0;
    for (const particle of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(
        particle.position.x,
        particle.position.y,
        particle.radius,
        0,
        Math.PI * 2
      );
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();
    }

    requestAnimationFrame(() => this.animate());
  }

  private bindSettingsControls() {
    type SettingHandlers = {
      [K in keyof typeof this.settings]: {
        id: string;
        handler: (value: typeof this.settings[K]) => void;
      };
    };

    const controls: SettingHandlers = {
      particleCount: { id: 'particleCount', handler: (value: number) => {
        this.settings.particleCount = value;
        this.initializeParticles();
      }},
      attractConstant: { id: 'attractConstant', handler: (value: number) => {
        this.settings.attractConstant = value;
      }},
      interactionRadius: { id: 'interactionRadius', handler: (value: number) => {
        this.settings.interactionRadius = value;
      }},
      connectionOpacity: { id: 'connectionOpacity', handler: (value: number) => {
        this.settings.connectionOpacity = value;
      }},
      gravity: { id: 'gravity', handler: (value: number) => {
        this.settings.gravity = value;
      }},
      dragConstant: { id: 'dragConstant', handler: (value: number) => {
        this.settings.dragConstant = value;
      }},
      elasticity: { id: 'elasticity', handler: (value: number) => {
        this.settings.elasticity = value;
      }},
      initialVelocity: { id: 'initialVelocity', handler: (value: number) => {
        this.settings.initialVelocity = value;
      }},
      trailOpacity: { id: 'trailOpacity', handler: (value: number) => {
        this.settings.trailOpacity = value;
      }},
      trailEnabled: { id: 'trailEnabled', handler: (value: boolean) => {
        this.settings.trailEnabled = value;
      }}
    } as const;

    Object.entries(controls).forEach(([setting, { id, handler }]) => {
      const input = document.getElementById(id) as HTMLInputElement;
      const display = document.getElementById(`${id}Value`);
      
      if (input) {
        if (input.type === 'checkbox') {
          input.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            handler(target.checked);
          });
        } else {
          input.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            const value = parseFloat(target.value);
            if (display) {
              display.textContent = value.toString();
            }
            handler(value);
          });
        }
      }
    });
  }
} 