import { BlockDefinition } from 'noya-state';
import { BoxBlock } from './BoxBlock';
import { renderStack } from './render';
import { isWithinRectRange } from './score';
import { cardSymbol } from './symbols';

export const CardBlock: BlockDefinition = {
  editorVersion: 2,
  symbol: cardSymbol,
  parser: 'regular',
  hashtags: BoxBlock.hashtags,
  infer: ({ frame, blockText, siblingBlocks }) => {
    return Math.max(
      isWithinRectRange({
        rect: frame,
        minWidth: 200,
        minHeight: 250,
        maxWidth: 300,
        maxHeight: 400,
      })
        ? 1
        : 0,
      0.1,
    );
  },
  render: (props) => renderStack({ props, block: CardBlock }),
};
