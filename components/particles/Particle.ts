import { Vector2D, ParticleState } from './types.ts';

export class Particle implements ParticleState {
  position: Vector2D;
  velocity: Vector2D;
  radius: number;
  color: string;
  mass: number;
  originalColor: string;
  clusterMass?: number;

  constructor(
    canvas: { width: number; height: number },
    radius: number,
    color: string,
    initialVelocity: number
  ) {
    // Random position within canvas bounds
    this.position = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    };
    
    // Random initial velocity
    this.velocity = {
      x: (Math.random() - 0.5) * initialVelocity,
      y: (Math.random() - 0.5) * initialVelocity
    };
    
    this.radius = radius;
    this.color = color;
    this.originalColor = color;
    this.mass = Math.PI * radius * radius;
  }

  update(bounds: Vector2D, dt: number, settings: {
    gravity: number;
    dragConstant: number;
    elasticity: number;
  }) {
    // Apply gravity
    this.velocity.y += settings.gravity * dt;

    // Apply drag force
    const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
    if (speed > 0) {
      const dragForce = settings.dragConstant * speed ** 2;
      const dragX = (this.velocity.x / speed) * dragForce;
      const dragY = (this.velocity.y / speed) * dragForce;
      this.velocity.x -= (dragX / this.mass) * dt;
      this.velocity.y -= (dragY / this.mass) * dt;
    }

    // Update position
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;

    // Handle wall collisions with elasticity
    if (this.position.x - this.radius < 0) {
      this.position.x = this.radius;
      this.velocity.x = Math.abs(this.velocity.x) * settings.elasticity;
    } else if (this.position.x + this.radius > bounds.x) {
      this.position.x = bounds.x - this.radius;
      this.velocity.x = -Math.abs(this.velocity.x) * settings.elasticity;
    }

    if (this.position.y - this.radius < 0) {
      this.position.y = this.radius;
      this.velocity.y = Math.abs(this.velocity.y) * settings.elasticity;
    } else if (this.position.y + this.radius > bounds.y) {
      this.position.y = bounds.y - this.radius;
      this.velocity.y = -Math.abs(this.velocity.y) * settings.elasticity;
    }
  }

  interactWith(other: Particle, settings: {
    attractConstant: number;
    interactionRadius: number;
    smoothingFactor: number;
  }) {
    const dx = other.position.x - this.position.x;
    const dy = other.position.y - this.position.y;
    const distSq = dx * dx + dy * dy;
    const INTERACTION_RADIUS_SQ = settings.interactionRadius * settings.interactionRadius;

    if (distSq > 0 && distSq < INTERACTION_RADIUS_SQ) {
      const distance = Math.sqrt(distSq);
      const smoothingDistance = settings.smoothingFactor * settings.interactionRadius;
      const smoothedDistance = Math.max(distance, smoothingDistance);
      
      // Calculate attraction/repulsion force
      const force = settings.attractConstant * (this.mass * other.mass) / (smoothedDistance * smoothedDistance);
      const forceX = force * dx / smoothedDistance;
      const forceY = force * dy / smoothedDistance;

      // Apply forces to both particles
      const dt = 1 / 60; // Assuming 60 FPS
      this.velocity.x += forceX / this.mass * dt;
      this.velocity.y += forceY / this.mass * dt;
      other.velocity.x -= forceX / other.mass * dt;
      other.velocity.y -= forceY / other.mass * dt;
    }
  }

  applyMouseForce(mousePos: Vector2D, settings: {
    explosionRadius: number;
    explosionForce: number;
  }) {
    const dx = this.position.x - mousePos.x;
    const dy = this.position.y - mousePos.y;
    const dist = Math.hypot(dx, dy);
    
    if (dist < settings.explosionRadius) {
      const normalizedDist = dist / settings.explosionRadius;
      const forceFactor = 1 - Math.pow(normalizedDist, 4); // More explosive near the center
      const force = settings.explosionForce * forceFactor;
      
      this.velocity.x += (dx / dist) * force;
      this.velocity.y += (dy / dist) * force;
    }
  }
} 