import type {
  CanvasKit,
  CanvasKitInit,
  Paint,
  PaintStyle,
  Shader,
} from '@repo/canvaskit';
import { getPublicPath } from '@repo/noya-public-path';

declare module '@repo/canvaskit' {
  // Exposed for SVGKit, since we need to introspect the paint in SVGRenderer.
  // We need to implement these in CanvasKit too if we want to use with CanvasKit + SVGRenderer.
  interface Paint {
    style?: PaintStyle;
    _alpha?: number;
    _shader?: Shader;
  }
  interface Paragraph {
    _parts?: {
      text: string;
      style?: TextStyle;
    }[];
  }
}

// Using `var` avoids this being uninitialized, maybe due to circular dependencies
// eslint-disable-next-line no-var
var loadingPromise: ReturnType<typeof CanvasKitInit> | undefined = undefined;

export function loadCanvasKit() {
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise(async (resolve) => {
    const module = await import('@repo/canvaskit');

    const CanvasKit = await module.CanvasKitInit({
      locateFile: (file: string) => getPublicPath() + 'wasm/' + file,
    });

    patchForSVGRenderer(CanvasKit);

    resolve(CanvasKit);
  });

  return loadingPromise;
}

/**
 * Expose properties on Paint for SVGRenderer. These properties don't have getters
 * in CanvasKit, so we need to set them manually.
 */
function patchForSVGRenderer(CanvasKit: CanvasKit) {
  const _setStyle = CanvasKit.Paint.prototype.setStyle;
  const _setShader = CanvasKit.Paint.prototype.setShader;

  CanvasKit.Paint.prototype.setStyle = function (
    this: Paint,
    paintStyle: PaintStyle,
  ) {
    this.style = paintStyle;
    _setStyle.call(this, paintStyle);
  };

  CanvasKit.Paint.prototype.setShader = function (this: Paint, shader: Shader) {
    this._shader = shader;
    _setShader.call(this, shader);
  };
}
