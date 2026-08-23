import { useEffect, useState } from "react";
import {
  Keyboard,
  LayoutChangeEvent,
  Modal as M,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Surface } from "react-native-paper";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  initialWindowMetrics,
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useThemeColor } from "../../hooks/use-theme-color";
import { Divider } from "../dividers/divider";
import { Title } from "../texts/title";

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
  const colors = useThemeColor();
  const [totalHeight, setTotalHeight] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const translateY = useSharedValue(0);
  const getTotalHeight = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setTotalHeight(height);
  };
  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvent, (e) =>
      setKeyboardHeight(e.endCoordinates.height),
    );
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);
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
    <M
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      onDismiss={onClose}
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
    >
      <SafeAreaProvider
        initialMetrics={
          initialWindowMetrics ?? {
            insets: { top: 0, bottom: 0, left: 0, right: 0 },
            frame: { x: 0, y: 0, width: 0, height: 0 },
          }
        }
      >
        <ModalBody
          colors={colors}
          panGesture={panGesture}
          animatedStyle={animatedStyle}
          totalHeight={totalHeight}
          getTotalHeight={getTotalHeight}
          keyboardHeight={keyboardHeight}
          title={title}
          onClose={onClose}
        >
          {children}
        </ModalBody>
      </SafeAreaProvider>
    </M>
  );
}

function ModalBody({
  colors,
  panGesture,
  animatedStyle,
  totalHeight,
  getTotalHeight,
  keyboardHeight,
  title,
  onClose,
  children,
}: {
  colors: ReturnType<typeof useThemeColor>;
  panGesture: ReturnType<typeof Gesture.Pan>;
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
  totalHeight: number;
  getTotalHeight: (e: LayoutChangeEvent) => void;
  keyboardHeight: number;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.backdrop, { backgroundColor: colors.backdrop }]} />
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.modalContent,
            { bottom: Math.max(keyboardHeight, insets.bottom) },
            animatedStyle,
          ]}
        >
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
                  backgroundColor={colors.onSecondaryContainer}
                />
              </View>
              {title && (
                <View style={{ paddingBottom: 5 }}>
                  <Title
                    color={colors.onSecondaryContainer}
                    fontWeight={900}
                    textAlign={"center"}
                    pb={2}
                  >
                    {title}
                  </Title>
                </View>
              )}
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              bounces={false}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </Surface>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
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
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  titleContainer: {
    flex: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
  },
});
