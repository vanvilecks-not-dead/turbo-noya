import { getPublicPath } from '@repo/noya-public-path';
import { PathKitInit } from '@repo/pathkit';
import { createJSPath } from './JSPath';
import { SVGKit } from './SVGKit';

let loadingPromise: Promise<typeof SVGKit> | undefined = undefined;

export function loadSVGKit() {
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise(async (resolve) => {
    const PathKit = await PathKitInit({
      locateFile: (file: string) => getPublicPath() + 'wasm/' + file,
    });

    (SVGKit as any).Path = createJSPath(PathKit);

    resolve(SVGKit);
  });

  return loadingPromise;
}
