import { View, Text, StyleSheet } from 'react-native';

/** Tela inicial temporária (será substituída por Splash/Auth no Épico 2) */
export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello Spotify Clone</Text>
      <Text style={styles.subtitle}>App configurado com sucesso!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191414',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#B3B3B3',
  },
});

