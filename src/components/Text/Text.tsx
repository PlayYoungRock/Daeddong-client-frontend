import React from 'react';
import styled, { css } from 'styled-components';

type SizeType = 'small' | 'middle' | 'large';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement | HTMLSpanElement> {
  $fontSize?: number;
  $lineHeight?: number;
  $size?: SizeType;
  $bold?: boolean;
  $center?: boolean;
}

const sizeTable = {
  small: { font: 12, lineHeight: 14 },
  middle: { font: 14, lineHeight: 16 },
  large: { font: 16, lineHeight: 18 },
};

export const Text = styled.p<TextProps>`
  font-weight: ${({ $bold }) => ($bold ? 900 : 400)};
  font-size: ${({ $fontSize, $size }) => `${$fontSize ?? sizeTable[$size ?? 'small'].font}px`};
  line-height: ${({ $lineHeight, $size }) =>
    `${$lineHeight ?? sizeTable[$size ?? 'small'].lineHeight}px`};

  ${({ $center }) =>
    $center &&
    css`
      text-align: center;
    `}
`;
