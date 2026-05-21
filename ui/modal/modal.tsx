import { useEffect, useState } from "react";
import { LayoutChangeEvent, Modal as M, StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Surface, useTheme } from "react-native-paper";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Divider } from "../dividers/divider";
import { Text } from "../texts/text";

export function Modal({
  children,
  onClose,
  isVisible,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  isVisible: boolean;
  title?: string;
}) {
  const theme = useTheme();
  const [totalHeight, setTotalHeight] = useState(0);
  const translateY = useSharedValue(0);
  const getTotalHeight = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setTotalHeight(height);
  };
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > totalHeight / 3) {
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0);
      }
    });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  useEffect(() => {
    translateY.value = 0;
  }, [isVisible, translateY]);
  return (
    <View>
      <M
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
        onDismiss={onClose}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.modalContent, animatedStyle]}>
              <Surface
                style={{
                  paddingInline: 12,
                  paddingBottom: 12,
                  borderRadius: 8,
                  elevation: 2,
                }}
                onLayout={getTotalHeight}
              >
                <View style={styles.titleContainer}>
                  <View
                    style={{
                      flexDirection: "row",
                      height: 15,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingBlock: 12,
                    }}
                  >
                    <Divider
                      height={3}
                      borderRadius={10}
                      width={40}
                      backgroundColor={theme.colors.onSecondaryContainer}
                    />
                  </View>
                  {title && (
                    <View style={{ paddingBottom: 5 }}>
                      <Text
                        color={theme.colors.onSecondaryContainer}
                        fontWeight={900}
                      >
                        {title}
                      </Text>
                    </View>
                  )}
                </View>
                <View>{children}</View>
              </Surface>
            </Animated.View>
          </GestureDetector>
        </GestureHandlerRootView>
      </M>
    </View>
  );
}
const styles = StyleSheet.create({
  modalContent: {
    width: "100%",
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: "absolute",
    bottom: 0,
  },
  titleContainer: {
    flex: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
  },
});
