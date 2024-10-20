/**
 * @typedef {Object} RobotSprites
 * @property {HTMLImageElement} up
 * @property {HTMLImageElement} down
 * @property {HTMLImageElement} left
 * @property {HTMLImageElement} right
 */

import { ROBOT_HEIGHT, ROBOT_WIDTH, TILE_WIDTH } from "../constants";
import { toIso } from "../tile";

export * from "./user.js";

export class Robot {
  /**
   * @param {string} id
   * @param {RobotSprites} sprites
   */
  constructor(id, sprites) {
    this.id = id;
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.speed = 0.03; // Velocidade de movimento (1 pixel por frame)
    this.threshold = 0.1; // Distância mínima para considerar que chegou ao destino
    this.moving = false;

    // Sprites para cada direção
    this.sprites = {
      up: sprites.up,
      down: sprites.down,
      left: sprites.left,
      right: sprites.right,
    };

    this.currentSprite = this.sprites.down; // Começa olhando para baixo
  }

  goto(x, y) {
    this.targetX = x;
    this.targetY = y;

    if (!this.moving) {
      this.moving = true;
      this.updatePosition();
    }
  }

  // Função que detecta a direção e altera o sprite
  updateDirection() {
    const deltaX = this.targetX - this.x;
    const deltaY = this.targetY - this.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        this.currentSprite = this.sprites.right; // Movendo-se para a direita
      } else {
        this.currentSprite = this.sprites.left; // Movendo-se para a esquerda
      }
    } else {
      if (deltaY > 0) {
        this.currentSprite = this.sprites.down; // Movendo-se para baixo
      } else {
        this.currentSprite = this.sprites.up; // Movendo-se para cima
      }
    }
  }

  updatePosition() {
    const distanceX = this.targetX - this.x;
    const distanceY = this.targetY - this.y;

    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    if (distance > this.threshold) {
      // Atualiza a direção antes de mover o robô
      this.updateDirection();

      // Normalizar os vetores de distância para manter a velocidade constante
      const stepX = (distanceX / distance) * this.speed;
      const stepY = (distanceY / distance) * this.speed;

      // Atualizar a posição
      this.x += stepX;
      this.y += stepY;

      // Continuar o movimento no próximo frame
      requestAnimationFrame(() => this.updatePosition());
    } else {
      // Chegou ao destino, ajustar a posição final para evitar "overshooting"
      this.x = this.targetX;
      this.y = this.targetY;
      this.moving = false;
    }
  }

  // Função para desenhar o robô no canvas com base na direção
  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    const { x, y } = toIso(this.x, this.y);
    const offsetX = (TILE_WIDTH - ROBOT_WIDTH) / 2; // Para centralizar horizontalmente
    const offsetY = -ROBOT_HEIGHT / 2; // Para alinhar verticalmente o centro da base

    ctx.drawImage(
      this.currentSprite,
      x + offsetX,
      y + offsetY, // Ajuste vertical
      ROBOT_WIDTH,
      ROBOT_HEIGHT,
    );
  }
}

/**
 *
 * @param {string} id
 * @returns {Robot|undefined}
 */
export function getRobotById(id) {
  return window.robots.find((robot) => robot.id === id);
}
