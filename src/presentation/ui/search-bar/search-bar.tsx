import { Searchbar as SB } from 'react-native-paper';

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
  layout,
  LayoutProps,
  position,
  PositionProps,
  space,
  SpaceProps,
  width,
  WidthProps,
} from 'styled-system';

const StyledSearchBar = styled(SB).attrs<
  BorderProps &
    ColorProps &
    FlexboxProps &
    LayoutProps &
    PositionProps &
    SpaceProps &
    BorderRadiusProps &
    WidthProps
>(() => ({}))`
  ${border}
  ${color}
  ${flexbox}
  ${layout}
  ${position}
  ${space}
  ${borderRadius}
  ${width}
`;
export function SearchBar({ ...props }: { [key: string]: any }) {
  return (
    <StyledSearchBar
      {...props}
      height={40}
      borderRadius={10}
      inputStyle={{
        minHeight: 0,
        paddingBottom: 0,
        paddingTop: 0,
      }}
    />
  );
}
