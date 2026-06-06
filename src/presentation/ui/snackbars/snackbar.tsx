import { createContext, ReactNode, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { Snackbar } from "react-native-paper";
import { Icon } from "../icons/icon";

const green = "#b6eacd";
const red = "#fee3e1";
const borderGreen = "#03aa55";
const borderRed = "#fc3635";

export function SnackBarProvider({ children }: { children: ReactNode }) {
  const [color, setColor] = useState<string>(green);
  const [borderColor, setBorderColor] = useState<string>(borderGreen);
  const [icon, setIcon] = useState<string>("check");
  const [message, setMessage] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const success = (message: string) => {
    setColor(green);
    setBorderColor(borderGreen);
    setMessage(message);
    setVisible(true);
    setIcon("check");
  };
  const error = (message: string) => {
    setColor(red);
    setIcon("close");
    setBorderColor(borderRed);
    setMessage(message);
    setVisible(true);
  };
  const showSnackbar = useMemo(() => ({ success, error }), []);

  return (
    <SnackBarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        visible={visible}
        duration={3000}
        elevation={5}
        onDismiss={() => setVisible(false)}
        wrapperStyle={{ top: 50, zIndex: 1000 }}
        theme={{
          colors: {
            inverseOnSurface: "black",
            inversePrimary: "black",
          },
        }}
        style={{
          backgroundColor: color,
          borderRadius: 10,
          borderColor: borderColor,
          borderWidth: 1,
          borderBottomWidth: 2,
          height: 52,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: borderColor,
              borderRadius: 20,
              padding: 2,
            }}
          >
            <Icon size={17} type={icon} color={"white"} />
          </View>
          <Text style={{ marginLeft: 10, color: "#333333" }}>{message}</Text>
        </View>
      </Snackbar>
    </SnackBarContext.Provider>
  );
}

export const SnackBarContext = createContext({
  showSnackbar: {
    success: (message: string) => {},
    error: (message: string) => {},
  },
});
