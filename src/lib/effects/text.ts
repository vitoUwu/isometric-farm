import Camera from "../camera";
import { AnimatedEffect } from "./Manager";

export const fadeOutSlideUp = (effect: AnimatedEffect, deltaTime: number) => {
  effect.duration -= deltaTime;
  effect.opacity -= deltaTime / 1000;
  effect.offsetY -= 0.5;
  return effect.duration > 0;
};

interface TextEffectData {
  x: number;
  y: number;
  duration: number;

  opacity?: number;
  offsetX?: number;
  offsetY?: number;
  text: string;
  fontSize?: number;
  color?: string;
  followCamera?: boolean;
  updateFn?: (effect: AnimatedEffect, deltaTime: number) => boolean;
}

export class TextEffect implements TextEffectData {
  public x: number;
  public y: number;
  public text: string;
  public opacity: number;
  public offsetX: number;
  public offsetY: number;
  public duration: number;
  public fontSize: number;
  public color: string;
  public followCamera?: boolean;
  public updateFn?: (effect: AnimatedEffect, deltaTime: number) => boolean;

  constructor(data: TextEffectData) {
    this.x = data.x;
    this.y = data.y;
    this.text = data.text;
    this.duration = data.duration;
    this.opacity = data.opacity || 1;
    this.offsetX = data.offsetX || 0;
    this.offsetY = data.offsetY || 0;
    this.fontSize = data.fontSize || 20;
    this.color = data.color || "white";
    this.followCamera = data.followCamera || false;
    this.updateFn = data.updateFn;
  }

  update(deltaTime: number): boolean {
    if (this.updateFn) {
      return this.updateFn(this, deltaTime);
    }
    this.duration -= deltaTime;
    this.opacity = this.duration / 1000;
    this.offsetY -= 0.5; // Move up
    return this.duration > 0;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    if (this.followCamera) {
      ctx.scale(Camera.scale, Camera.scale);
      ctx.translate(-Camera.cameraX, -Camera.cameraY);
    }
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.font = `${this.fontSize}px Arial`;
    ctx.fillText(this.text, this.x, this.y + this.offsetY);
    ctx.restore();
  }
}