import { Effect } from "./Manager";

export class AudioEffect implements Effect {
  private audio: HTMLAudioElement;

  constructor(audioSrc: string) {
    this.audio = new Audio(audioSrc);
    this.audio.play();
  }

  update(deltaTime: number): boolean {
    return !this.audio.ended;
  }

  render(ctx: CanvasRenderingContext2D): void {
    // No visual rendering needed for audio
  }
}