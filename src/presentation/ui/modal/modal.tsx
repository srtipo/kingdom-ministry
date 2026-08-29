import { useEffect, useState } from "react";
import {
  BackHandler,
  Keyboard,
  LayoutChangeEvent,
  Platform,
  Pressable,
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
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "../../hooks/use-theme-color";
import { Portal } from "../portal/portal";
import { Divider } from "../dividers/divider";
import { Title } from "../texts/title";

const HIDDEN_OFFSET = 2000;
const ENTRY_DURATION = 220;
const EXIT_DURATION = 180;
const BACKDROP_ENTRY_DURATION = 200;
const BACKDROP_EXIT_DURATION = 160;

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
  const [mounted, setMounted] = useState(isVisible);
  if (!mounted) return null;
  return (
    <ModalContent
      isVisible={isVisible}
      onClose={onClose}
      title={title}
      onUnmount={() => setMounted(false)}
    >
      {children}
    </ModalContent>
  );
}

function ModalContent({
  children,
  onClose,
  isVisible,
  title,
  onUnmount,
}: {
  children: React.ReactNode;
  onClose: () => void;
  isVisible: boolean;
  title?: string;
  onUnmount: () => void;
}) {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const [totalHeight, setTotalHeight] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const translateY = useSharedValue(isVisible ? 0 : HIDDEN_OFFSET);
  const backdropOpacity = useSharedValue(isVisible ? 1 : 0);

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

  useEffect(() => {
    if (isVisible) {
      translateY.value = withTiming(0, {
        duration: ENTRY_DURATION,
        easing: Easing.out(Easing.cubic),
      });
      backdropOpacity.value = withTiming(1, {
        duration: BACKDROP_ENTRY_DURATION,
      });
    } else {
      translateY.value = withTiming(
        HIDDEN_OFFSET,
        {
          duration: EXIT_DURATION,
          easing: Easing.in(Easing.cubic),
        },
        (finished) => {
          if (finished) {
            runOnJS(onUnmount)();
          }
        },
      );
      backdropOpacity.value = withTiming(0, {
        duration: BACKDROP_EXIT_DURATION,
      });
    }
  }, [isVisible, onUnmount, translateY, backdropOpacity]);

  useEffect(() => {
    if (!isVisible) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [isVisible, onClose]);

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

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <Portal>
      <GestureHandlerRootView style={styles.root} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.backdrop,
            { backgroundColor: colors.backdrop },
            animatedBackdropStyle,
          ]}
          pointerEvents={isVisible ? "auto" : "none"}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            accessibilityLabel="Close modal"
            accessibilityRole="button"
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.modalContent,
            { bottom: Math.max(keyboardHeight, insets.bottom) },
            animatedSheetStyle,
          ]}
          pointerEvents="box-none"
        >
          <GestureDetector gesture={panGesture}>
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
          </GestureDetector>
        </Animated.View>
      </GestureHandlerRootView>
    </Portal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
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
