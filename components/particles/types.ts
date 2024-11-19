export interface Vector2D {
  x: number;
  y: number;
}

export interface ParticleSettings {
  minRadius: number;
  maxRadius: number;
  count: { min: number; max: number; step: number };
  explosionRadius: { min: number; max: number; step: number };
  explosionForce: { min: number; max: number; step: number };
  attractConstant: { min: number; max: number; step: number };
  gravity: { min: number; max: number; step: number };
  interactionRadius: { min: number; max: number; step: number };
  dragConstant: { min: number; max: number; step: number };
  elasticity: { min: number; max: number; step: number };
  initialVelocity: { min: number; max: number; step: number };
  connectionOpacity: { min: number; max: number; step: number };
  maxHeatFactor: { min: number; max: number; step: number };
  minClusterOpacity: { min: number; max: number; step: number };
  opacityReductionFactor: { min: number; max: number; step: number };
  smoothingFactor: { min: number; max: number; step: number };
}

export interface ParticleState {
  position: Vector2D;
  velocity: Vector2D;
  radius: number;
  color: string;
  mass: number;
  originalColor: string;
  clusterMass?: number;
}

export type ColorPalette = string[];
export type PaletteMap = Record<string, ColorPalette>; 