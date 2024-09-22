import { Canvas, CanvasKit } from '@repo/canvaskit';
import { ApplicationState } from '@repo/noya-state';

export interface Context {
  state: ApplicationState;
  CanvasKit: CanvasKit;
  canvas: Canvas;
  canvasSize: {
    width: number;
    height: number;
  };
  theme: {
    textColor: string;
    backgroundColor: string;
  };
}
