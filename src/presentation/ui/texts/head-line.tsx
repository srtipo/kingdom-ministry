import { Text } from 'react-native-paper';
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
  type?: keyof typeof headLine;
}

const headLine = {
  large: 'headlineLarge',
  medium: 'headlineMedium',
  small: 'headlineSmall',
} as const;

export const HeadLineWrapper = ({
  children,
  type = 'medium',
  style,
}: {
  children: React.ReactNode;
  type?: keyof typeof headLine;
  style?: any;
}) => {
  return (
    <Text variant={headLine[type]} style={style}>
      {children}
    </Text>
  );
};
export const HeadLine = styled(HeadLineWrapper).attrs<HeadLineStyledProps>(() => ({}))`
  ${flexbox}
  ${space}
  ${border}
  ${color}
  ${layout}
  ${position}
  ${typography}
`;
