import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import { fileSave } from 'browser-fs-access';
import JSZip from 'jszip';
import {
  useDispatch,
  useGetWorkspaceStateSnapshot,
  useSelector,
} from '@repo/noya-app-state-context';
import { Button, Divider, withSeparatorElements } from '@repo/noya-designsystem';
import Sketch from '@repo/noya-file-format';
import { generateImage, ImageEncoding } from '@repo/noya-generate-image';
import { Size } from '@repo/noya-geometry';
import {
  ArrayController,
  ExportFormatsRow,
  InspectorPrimitives,
  usePreviewLayer,
} from '@repo/noya-inspector';
import { LayerPreview as RCKLayerPreview, useCanvasKit } from '@repo/noya-renderer';
import { PageLayer, Selectors } from '@repo/noya-state';
import { CanvasPreviewItem } from '@repo/noya-theme-editor';
import {
  FileType,
  getFileExtensionForType,
  getFileTypeForExtension,
} from '@repo/noya-utils';
import React, { memo, useCallback } from 'react';
import { useTheme } from 'styled-components';

export const ExportPreviewRow = memo(function ExportPreviewRow({
  layer,
  page,
}: {
  layer: PageLayer;
  page: Sketch.Page;
}) {
  const preview = usePreviewLayer({ layer, page });

  return (
    <AspectRatio.Root
      ratio={Math.max(1, layer.frame.width / layer.frame.height)}
    >
      <CanvasPreviewItem
        renderContent={useCallback(
          (size) => (
            <RCKLayerPreview
              layer={preview.layer}
              layerFrame={preview.frame}
              backgroundColor={preview.backgroundColor}
              previewSize={size}
              showCheckeredBackground
            />
          ),
          [preview.backgroundColor, preview.frame, preview.layer],
        )}
      />
    </AspectRatio.Root>
  );
});

async function saveFile(name: string, type: FileType, data: ArrayBuffer) {
  const file = new File([data], name, {
    type,
  });

  await fileSave(
    file,
    { fileName: file.name, extensions: [`.${getFileExtensionForType(type)}`] },
    undefined,
    false,
  );
}

function getExportSize(exportFormat: Sketch.ExportFormat, size: Size) {
  const { scale, absoluteSize, visibleScaleType } = exportFormat;

  switch (visibleScaleType) {
    case Sketch.VisibleScaleType.Width:
      return { width: absoluteSize, height: size.height };
    case Sketch.VisibleScaleType.Scale:
      return {
        width: size.width * scale,
        height: size.height * scale,
      };
    case Sketch.VisibleScaleType.Height:
      return { width: size.width, height: absoluteSize };
  }
}

export default memo(function ExportInspector() {
  const title = 'Exports';
  const dispatch = useDispatch();
  const theme = useTheme();
  const CanvasKit = useCanvasKit();
  const getWorkspaceStateSnapshot = useGetWorkspaceStateSnapshot();

  const page = useSelector(Selectors.getCurrentPage);
  const selectedLayer = useSelector(Selectors.getSelectedLayers)[0];
  const preview = usePreviewLayer({ layer: selectedLayer, page });

  const exportFormats = selectedLayer.exportOptions.exportFormats;

  const renderImageForExportFormat = useCallback(
    async (exportFormat: Sketch.ExportFormat) => {
      const size = {
        width: selectedLayer.frame.width,
        height: selectedLayer.frame.height,
      };

      const exportSize = getExportSize(exportFormat, size);

      return generateImage(
        CanvasKit,
        exportSize,
        theme,
        getWorkspaceStateSnapshot(),
        exportFormat.fileFormat.toString() as ImageEncoding,
        () => (
          <RCKLayerPreview
            layer={preview.layer}
            layerFrame={preview.frame}
            backgroundColor={preview.backgroundColor}
            previewSize={exportSize}
          />
        ),
      );
    },
    [
      selectedLayer.frame.width,
      selectedLayer.frame.height,
      CanvasKit,
      theme,
      getWorkspaceStateSnapshot,
      preview.layer,
      preview.frame,
      preview.backgroundColor,
    ],
  );

  const getExportFileName = useCallback(
    (exportFormat: Sketch.ExportFormat) => {
      const { name, namingScheme, fileFormat } = exportFormat;

      if (namingScheme === Sketch.ExportFormatNamingScheme.Suffix)
        return `${selectedLayer.name}${name}.${fileFormat}`;

      return `${name}${selectedLayer.name}.${fileFormat}`;
    },
    [selectedLayer],
  );

  const handleExport = useCallback(async () => {
    if (exportFormats.length === 1) {
      const exportFormat = exportFormats[0];

      if (
        exportFormat.fileFormat !== Sketch.ExportFileFormat.JPG &&
        exportFormat.fileFormat !== Sketch.ExportFileFormat.PNG &&
        exportFormat.fileFormat !== Sketch.ExportFileFormat.SVG &&
        exportFormat.fileFormat !== Sketch.ExportFileFormat.WEBP
      )
        return;

      const data = await renderImageForExportFormat(exportFormat);

      if (!data) return;

      const fileName = getExportFileName(exportFormat);

      saveFile(
        fileName,
        getFileTypeForExtension(exportFormat.fileFormat),
        data,
      );
    } else {
      const zip = new JSZip();

      const files = exportFormats.map(async (exportFormat) => {
        const data = await renderImageForExportFormat(exportFormat);

        if (!data) return;

        zip.file(getExportFileName(exportFormat), data, {
          base64: true,
        });
      });

      Promise.allSettled(files).then(async () => {
        const data = await zip.generateAsync({
          type: 'arraybuffer',
          mimeType: 'application/zip',
        });

        saveFile(`${selectedLayer.name}.zip`, 'application/zip', data);
      });
    }
  }, [
    selectedLayer,
    exportFormats,
    getExportFileName,
    renderImageForExportFormat,
  ]);

  const elements = [
    <ArrayController<Sketch.ExportFormat>
      sortable
      title={title}
      id={title}
      key={title}
      items={exportFormats}
      onClickPlus={useCallback(() => {
        dispatch('addExportFormat');
      }, [dispatch])}
      onMoveItem={useCallback(
        (sourceIndex, destinationIndex) => {
          dispatch('moveExportFormat', sourceIndex, destinationIndex);
        },
        [dispatch],
      )}
      renderItem={useCallback(
        ({ item, index }) => (
          <ExportFormatsRow
            id={`exportFormat-${index}}`}
            last={index === exportFormats.length - 1}
            exportFormat={item}
            onChangeScale={(value) => {
              dispatch('setExportScale', index, value);
            }}
            onChangeName={(value) => {
              dispatch('setExportName', index, value);
            }}
            onChangeFileFormat={(value) => {
              dispatch('setExportFileFormat', index, value);
            }}
            onChangeNamingScheme={(value) => {
              dispatch('setExportNamingScheme', index, value);
            }}
            onDelete={() => dispatch('deleteExportFormat', index)}
          />
        ),
        [exportFormats.length, dispatch],
      )}
    />,
    exportFormats.length > 0 && selectedLayer && (
      <>
        <InspectorPrimitives.Section>
          <ExportPreviewRow layer={selectedLayer} page={page} />
          <InspectorPrimitives.VerticalSeparator />
          <Button id="export-selected" onClick={handleExport}>
            Export Selected...
          </Button>
        </InspectorPrimitives.Section>
      </>
    ),
  ];

  return <>{withSeparatorElements(elements, <Divider />)}</>;
});
