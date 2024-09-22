import type { CanvasKit } from '@repo/canvaskit';
import { SupportedCanvasUploadType } from '@repo/noya-designsystem';
import { Size } from '@repo/noya-geometry';
import { TypedFile } from '@repo/noya-react-utils';
import { InsertedImage } from '@repo/noya-state';
import { getFileExtensionForType } from '@repo/noya-utils';

export async function importImageFile(
  file: TypedFile<SupportedCanvasUploadType>,
  calculateSize: (bytes: ArrayBuffer) => Size | null,
): Promise<InsertedImage | void> {
  if (file.type === 'image/svg+xml') {
    const svgString = await file.text();

    return {
      name: file.name.replace(/\.svg$/, ''),
      extension: 'svg',
      svgString,
    };
  } else {
    const data = await file.arrayBuffer();
    const size = calculateSize(data);

    if (!size) return;

    if (file.type === '') return;

    const extension = getFileExtensionForType(file.type);

    return {
      name: file.name.replace(new RegExp(`\\.${extension}$`), ''),
      extension,
      size,
      data,
    };
  }
}

export async function importImageFileWithCanvasKit(
  CanvasKit: CanvasKit,
  file: TypedFile<SupportedCanvasUploadType>,
): Promise<InsertedImage | void> {
  return importImageFile(file, (bytes) => {
    const image = CanvasKit.MakeImageFromEncoded(bytes);

    if (!image) return null;

    return { image, width: image.width(), height: image.height() };
  });
}
