import logger from "../logger";

export interface Effect {
  update(deltaTime: number): boolean; // Returns false if the effect should be removed
  render(ctx: CanvasRenderingContext2D): void;
}

export interface AnimatedEffect extends Effect {
  x: number;
  y: number;
  opacity: number;
  offsetX: number;
  offsetY: number;
  duration: number;
}

let _instance: EffectManager;

class EffectManager {
  private effects: Effect[] = [];

  constructor() {
    if (_instance) {
      throw new Error("EffectManager is a singleton");
    }
    _instance = this;
  }

  static getInstance() {
    logger.time("EffectManager.getInstance");
    if (!_instance) {
      _instance = new EffectManager();
    }
    logger.timeEnd("EffectManager.getInstance");
    return _instance;
  }

  addEffect(effect: Effect) {
    this.effects.push(effect);
  }

  update(deltaTime: number) {
    this.effects = this.effects.filter(effect => effect.update(deltaTime));
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.effects.length === 0) {
      return;
    }
    
    // ctx.save();
    // ctx.scale(Camera.scale, Camera.scale);
    // ctx.translate(-Camera.cameraX, -Camera.cameraY);

    this.effects.forEach(effect => effect.render(ctx));
    
    // ctx.restore();
  }
}

export default EffectManager.getInstance();
