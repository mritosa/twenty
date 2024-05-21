import { useState } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import { v4 as uuidV4 } from 'uuid';

import { AppTooltip } from './AppTooltip';

const StyledOverflowingText = styled.div<{ cursorPointer: boolean }>`
  cursor: ${({ cursorPointer }) => (cursorPointer ? 'pointer' : 'inherit')};
  font-family: inherit;
  font-size: inherit;

  font-weight: inherit;
  max-width: 100%;
  overflow: hidden;
  text-decoration: inherit;

  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const OverflowingTextWithTooltip = ({
  text,
  className,
  mutliline,
}: {
  text: string | null | undefined;
  className?: string;
  mutliline?: boolean;
}) => {
  const textElementId = `title-id-${uuidV4()}`;
  const [textElement, setTextElement] = useState<HTMLDivElement | null>(null);

  const isTitleOverflowing =
    (text?.length ?? 0) > 0 &&
    !!textElement &&
    (textElement.scrollHeight > textElement.clientHeight ||
      textElement.scrollWidth > textElement.clientWidth);

  const handleTooltipClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <>
      <StyledOverflowingText
        data-testid="tooltip"
        className={className}
        ref={setTextElement}
        id={textElementId}
        cursorPointer={isTitleOverflowing}
      >
        {text}
      </StyledOverflowingText>
      {isTitleOverflowing &&
        createPortal(
          <div onClick={handleTooltipClick}>
            <AppTooltip
              anchorSelect={`#${textElementId}`}
              content={mutliline ? undefined : text ?? ''}
              delayHide={0}
              offset={5}
              noArrow
              place="bottom"
              positionStrategy="absolute"
            >
              {mutliline ? <pre>{text}</pre> : ''}
            </AppTooltip>
          </div>,
          document.body,
        )}
    </>
  );
};
