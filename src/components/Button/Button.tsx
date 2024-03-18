import React, { memo, HTMLAttributes } from 'react';
import styled from 'styled-components';

import { Text } from '../Text';

type SizeType = 'small' | 'middle' | 'large';
type ColorType = 'blue' | 'red' | 'green' | 'black';

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  $variant?: 'default' | 'outline';
  $size?: SizeType;
  $width?: number;
  $color?: ColorType;
  $disabled?: boolean;
}

const sizeTable = {
  small: '8px 0px',
  middle: '10px 0px',
  large: '12px 0px',
};

const enableTable = {
  blue: '#2196F3',
  red: '#D32F2F',
  green: '#2E7D32',
  black: '#000000',
};

const hoverTable = {
  blue: '#1E88E5',
  red: '#C62828',
  green: '#1B5E20',
  black: '#000000',
};
const disabledTable = {
  font: '#e1e8ef',
  background: '#c6cdd4',
  border: '#c6cdd4',
};

export const Button = memo<ButtonProps>(
  ({ $variant = 'default', $disabled, children, ...props }) => {
    return (
      <BaseButton {...props} $variant={$variant} disabled={$disabled}>
        {typeof children === 'string' ? (
          <Text as="span" $size="middle">
            {children}
          </Text>
        ) : (
          children
        )}
      </BaseButton>
    );
  },
);

Button.displayName = 'Button';

const BaseButton = styled.button<ButtonProps>`
  width: ${({ $width }) => ($width ? `${$width}px` : '100%')};
  padding: ${({ $size }) => sizeTable[$size ?? 'middle']};
  background-color: ${({ $variant, $color }) =>
    $variant === 'default' ? enableTable[$color ?? 'blue'] : '#ffffff'};
  border: 1px solid ${({ $color }) => enableTable[$color ?? 'blue']};
  color: ${({ $variant, $color }) =>
    $variant === 'default' ? '#ffffff' : enableTable[$color ?? 'blue']};
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: ${({ $variant, $color }) =>
      $variant === 'default' ? hoverTable[$color ?? 'blue'] : '#ffffff'};
    border: 1px solid ${({ $color }) => hoverTable[$color ?? 'blue']};
  }

  &:disabled {
    background-color: ${disabledTable.background};
    color: ${disabledTable.font};
    border: 1px solid ${disabledTable.border};
    cursor: not-allowed;
  }
`;
