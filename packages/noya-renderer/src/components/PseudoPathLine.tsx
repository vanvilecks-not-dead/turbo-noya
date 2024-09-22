import Sketch from '@repo/noya-file-format';
import { useStroke } from '@repo/noya-react-canvaskit';
import { Primitives } from '@repo/noya-state';
import React from 'react';
import { useTheme } from 'styled-components';
import { Path } from '../ComponentsContext';
import { useCanvasKit } from '../hooks/useCanvasKit';

interface EditablePathPointProps {
  frame: Sketch.Rect;
  points: Sketch.CurvePoint[];
}

export default function PseudoPathLine({
  points,
  frame,
}: EditablePathPointProps) {
  const CanvasKit = useCanvasKit();
  const { primary } = useTheme().colors;
  const stroke = useStroke({ color: primary });

  const pseudoPath = Primitives.path(CanvasKit, points, frame, false);

  return <Path path={pseudoPath} paint={stroke} />;
}
