import Sketch from '@repo/noya-file-format';
import { PageLayer } from '@repo/noya-state';

interface Props {
  layer: PageLayer | Sketch.Page;
}

type SketchLayerType = (props: Props) => JSX.Element | null;

export type BaseLayerProps = {
  SketchLayer: SketchLayerType;
};
