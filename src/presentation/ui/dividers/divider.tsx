import { Divider as D } from 'react-native-paper';
import styled from 'styled-components/native';
import {
  border,
  BorderProps,
  borderRadius,
  BorderRadiusProps,
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  height,
  HeightProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  space,
  SpaceProps,
} from 'styled-system';
interface DividerStyledProps
  extends
    FlexboxProps,
    SpaceProps,
    BorderProps,
    ColorProps,
    LayoutProps,
    PositionProps,
    HeightProps,
    BorderRadiusProps {
  children: React.ReactNode;
}

const DividerWapper = styled(D).attrs<DividerStyledProps>(() => ({}))`
  ${flexbox}
  ${space}
  ${border}
  ${color}
  ${layout}
  ${position}
  ${borderRadius}
  ${height}
`;
export function Divider({ ...props }: { [key: string]: any }) {
  return <DividerWapper {...props} />;
}
