import { Text as T } from 'react-native-paper';
import styled from 'styled-components/native';
import {
  border,
  BorderProps,
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from 'styled-system';

interface HeadLineStyledProps
  extends
    FlexboxProps,
    SpaceProps,
    BorderProps,
    ColorProps,
    LayoutProps,
    PositionProps,
    TypographyProps {
  children: React.ReactNode;
  type?: keyof typeof text;
}

const text = {
  large: 'bodyLarge',
  medium: 'bodyMedium',
  small: 'bodySmall',
} as const;

const TextWrapper = ({
  children,
  type = 'medium',
  style,
}: {
  children: React.ReactNode;
  type?: keyof typeof text;
  style?: any;
}) => {
  return (
    <T variant={text[type]} style={style}>
      {children}
    </T>
  );
};
export const Text = styled(TextWrapper).attrs<HeadLineStyledProps>(() => ({}))`
  ${flexbox}
  ${space}
  ${border}
  ${color}
  ${layout}
  ${position}
  ${typography}
`;
