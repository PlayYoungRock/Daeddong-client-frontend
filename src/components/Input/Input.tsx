import React, { HTMLAttributes, memo } from 'react';
import styled from 'styled-components';

type SizeType = 'small' | 'middle' | 'large';

interface InputProps extends HTMLAttributes<HTMLInputElement> {
  $size?: SizeType;
}

const sizeTable = {
  small: { font: 12, lineHeight: 14 },
  middle: { font: 14, lineHeight: 16 },
  large: { font: 16, lineHeight: 18 },
};

export const Input = memo<InputProps>(({ ...props }) => {
  return <BaseInput {...props} />;
});

Input.displayName = 'Input';

const BaseInput = styled.input<InputProps>`
  width: 100%;
  font-size: ${({ $size }) => `${sizeTable[$size ?? 'middle'].font}px`};
  line-height: ${({ $size }) => `${sizeTable[$size ?? 'middle'].lineHeight}px`};
  outline: none;
  border: 1px solid #000;
  border-radius: 5px;
  padding: 8px 4px;
`;
