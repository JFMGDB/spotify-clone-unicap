import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { PlayerProvider, usePlayer } from '@/src/contexts/PlayerContext';
import { MiniPlayer } from '@/src/features/player/components/MiniPlayer';
import { colors } from '@/src/shared/theme/colors';
import { useEffect } from 'react';

/** Componente que conecta AuthContext e PlayerContext */
function AuthPlayerConnector({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { stop } = usePlayer();

  useEffect(() => {
    if (!isAuthenticated) {
      stop();
    }
  }, [isAuthenticated, stop]);

  return <>{children}</>;
}

/** Root Layout da aplicação */
export default function RootLayout() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <AuthPlayerConnector>
          <View style={{ flex: 1 }}>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
            <MiniPlayer />
          </View>
          <StatusBar style="light" backgroundColor={colors.background} />
        </AuthPlayerConnector>
      </PlayerProvider>
    </AuthProvider>
  );
}
