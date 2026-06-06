import { ComponentProps } from "react";
import { Chip as PaperChip } from "react-native-paper";
import styled from "styled-components/native";
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
} from "styled-system";

interface ChipStyledProps
  extends
    FlexboxProps,
    SpaceProps,
    BorderProps,
    ColorProps,
    LayoutProps,
    PositionProps,
    TypographyProps {
  color?: string;
}

type ChipProps = ComponentProps<typeof PaperChip> & ChipStyledProps;

const ChipWrapper = ({ style, ...props }: ChipProps) => {
  return <PaperChip style={style} {...props} />;
};

export const StyledChip = styled(ChipWrapper).attrs<ChipStyledProps>(
  () => ({}),
)`
  ${flexbox}
  ${space}
  ${border}
  ${color}
  ${layout}
  ${position}
  ${typography}
`;

export function Chip({ children, color, ...props }: ChipProps) {
  return (
    <StyledChip borderRadius={10} {...props} backgroundColor={color}>
      {children}
    </StyledChip>
  );
}
