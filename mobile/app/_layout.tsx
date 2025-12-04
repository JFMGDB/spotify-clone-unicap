import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

/** Root Layout da aplicação */
export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <StatusBar style="light" />
    </>
  );
}

