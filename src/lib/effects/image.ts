import { Effect } from "./Manager";

export class ImageEffect implements Effect {
  constructor(
    private x: number,
    private y: number,
    private image: HTMLImageElement,
    private opacity: number = 1,
    private rotation: number = 0,
    private duration: number = 1000
  ) { }

  update(deltaTime: number): boolean {
    this.duration -= deltaTime;
    this.opacity = this.duration / 1000;
    this.rotation += 0.01; // Rotate
    return this.duration > 0;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
    ctx.restore();
  }
}