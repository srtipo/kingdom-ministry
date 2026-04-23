import { SafeAreaView } from 'react-native-safe-area-context';

export const SafeArea = ({ children }: { children: React.ReactNode }) => {
  return <SafeAreaView>{children}</SafeAreaView>;
};
