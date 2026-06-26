import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useState,
} from "react";
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from "react-native";

interface ScrollMaskProps {
  children: ReactNode;
  left?: boolean;
  right?: boolean;
  bottom?: boolean;
  top?: boolean;
  edgeWidth?: number;
  edgeHeight?: number;
}

export function ScrollMask({
  children,
  left = false,
  right = false,
  bottom = false,
  top = false,
  edgeWidth = 20,
  edgeHeight = 8,
}: ScrollMaskProps) {
  const { background } = useThemeColor();
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
  const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 });

  const onContainerLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setContainerSize({ width, height });
  }, []);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { x, y } = e.nativeEvent.contentOffset;
      setScrollOffset({ x, y });
    },
    [],
  );

  const child = Children.only(children);
  const enhancedChild = isValidElement(child)
    ? cloneElement(
        child as React.ReactElement<{
          onContentSizeChange?: (w: number, h: number) => void;
          onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
          scrollEventThrottle?: number;
        }>,
        {
          scrollEventThrottle: 16,
          onContentSizeChange: (w: number, h: number) => {
            setContentSize({ width: w, height: h });
            (child.props as any).onContentSizeChange?.(w, h);
          },
          onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
            handleScroll(e);
            (child.props as any).onScroll?.(e);
          },
        },
      )
    : child;

  const tolerance = 2;
  const showLeft = left && scrollOffset.x > tolerance;
  const showRight =
    right &&
    containerSize.width > 0 &&
    contentSize.width > 0 &&
    scrollOffset.x + containerSize.width < contentSize.width - tolerance;
  const showTop = top && scrollOffset.y > tolerance;
  const showBottom =
    bottom &&
    containerSize.height > 0 &&
    contentSize.height > 0 &&
    scrollOffset.y + containerSize.height < contentSize.height - tolerance;

  return (
    <View
      style={{ flex: 1, position: "relative", overflow: "hidden" }}
      onLayout={onContainerLayout}
    >
      {enhancedChild}
      {showLeft && (
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[background, "transparent"]}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: edgeWidth,
          }}
          pointerEvents="none"
        />
      )}
      {showRight && (
        <LinearGradient
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          colors={[background, "transparent"]}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: edgeWidth,
          }}
          pointerEvents="none"
        />
      )}
      {showBottom && (
        <LinearGradient
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          colors={[background, "transparent"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: edgeHeight,
          }}
          pointerEvents="none"
        />
      )}
      {showTop && (
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={[background, "transparent"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: edgeHeight,
          }}
          pointerEvents="none"
        />
      )}
    </View>
  );
}
