import { useApplicationState } from '@repo/noya-app-state-context';
import Sketch from '@repo/noya-file-format';
import { generateImageFromPDF } from '@repo/noya-pdf';
import { useIsMounted, useMutableState } from '@repo/noya-react-utils';
import {
  createContext,
  memo,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';

type ImageCache = Record<string, ArrayBuffer>;
type ImageCacheContextValue = [
  ImageCache,
  (key: string, value: ArrayBuffer) => void,
];

// We decode images using a global mutable cache to share images between
// renderer instances.
//
// TODO: Remove unused images so we don't run out of memory
const globalImageCache: ImageCache = {};

const ImageCacheContext = createContext<ImageCacheContextValue | undefined>(
  undefined,
);

interface Props {
  children?: ReactNode;
}

export const ImageCacheProvider = memo(function ImageCacheProvider({
  children,
}: Props) {
  const [imageCache, updateImageCache] = useMutableState(globalImageCache);

  const isMounted = useIsMounted();

  const addImageToCache = useCallback(
    (key: string, value: ArrayBuffer) => {
      if (!isMounted.current) return;

      updateImageCache((imageCache) => {
        imageCache[key] = value;
      });
    },
    [isMounted, updateImageCache],
  );

  const contextValue = useMemo(
    (): ImageCacheContextValue => [imageCache, addImageToCache],
    [addImageToCache, imageCache],
  );

  return (
    <ImageCacheContext.Provider value={contextValue}>
      {children}
    </ImageCacheContext.Provider>
  );
});

function useImageCache(): ImageCacheContextValue {
  const value = useContext(ImageCacheContext);

  if (!value) {
    throw new Error('Missing ImageCacheProvider');
  }

  return value;
}

export function useSketchImage(image?: Sketch.FileRef | Sketch.DataRef) {
  const [state] = useApplicationState();
  const [imageCache, addImageToCache] = useImageCache();

  const imageData = image
    ? imageCache[image._ref] || state.sketch.images[image._ref]
    : undefined;

  const ref = image?._ref;

  useEffect(() => {
    if (!ref || !ref.endsWith('.pdf') || !imageData || ref in imageCache)
      return;

    generateImageFromPDF(new Uint8Array(imageData))
      .then((blob) => blob.arrayBuffer())
      .then((arrayBuffer) => {
        addImageToCache(ref, arrayBuffer);
      });
  }, [addImageToCache, imageCache, imageData, ref]);

  return imageData;
}
