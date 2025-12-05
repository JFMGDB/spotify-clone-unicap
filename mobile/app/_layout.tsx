import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { PlayerProvider } from '@/src/contexts/PlayerContext';
import { colors } from '@/src/shared/theme/colors';

/** Root Layout da aplicação */
export default function RootLayout() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
        <StatusBar style="light" backgroundColor={colors.background} />
      </PlayerProvider>
    </AuthProvider>
  );
}
