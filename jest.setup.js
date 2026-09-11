jest.mock("react-native-keyboard-controller", () => ({
  useKeyboardHandler: (handler) => {
    const h = handler;
    h.onMove?.({ height: 300, progress: 1, target: 0, type: "", appearance: "" });
    h.onEnd?.({ height: 300, progress: 1, target: 0, type: "", appearance: "" });
  },
  KeyboardProvider: ({ children }: { children: React.ReactNode }) => children,
  KeyboardEvents: { addListener: () => ({ remove: () => {} }) },
}));

jest.mock("react-native-gesture-handler", () => {
  const View = require("react-native").View;
  return {
    GestureHandlerRootView: View,
    GestureDetector: ({ children }: { children: React.ReactNode }) => children,
    Gesture: {
      Pan: () => ({
        onUpdate: () => ({ onEnd: () => ({}) }),
        onEnd: () => ({ onUpdate: () => ({}) }),
      }),
    },
  };
});
