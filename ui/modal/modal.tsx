import { useEffect } from "react";
import { Modal as M, StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";
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
  const translateY = useSharedValue(0);
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100) {
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
              <View
                style={[
                  styles.titleContainer,
                  { backgroundColor: theme.colors.secondaryContainer },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    height: 15,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Divider
                    height={3}
                    borderRadius={10}
                    width={40}
                    backgroundColor={theme.colors.onSecondaryContainer}
                  />
                </View>
                <View>
                  <Text
                    color={theme.colors.onSecondaryContainer}
                    fontWeight={900}
                  >
                    {title}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: theme.colors.surface,
                  height: "100%",
                }}
              >
                {children}
              </View>
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
    height: 40,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
  },
});
