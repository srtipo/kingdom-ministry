import React from "react";
import { Portal as PaperPortal } from "react-native-paper";

export interface PortalProps {
  children: React.ReactNode;
}

export function Portal({ children }: PortalProps) {
  return <PaperPortal>{children}</PaperPortal>;
}
