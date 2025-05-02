import { View, Text, StyleSheet } from "react-native";
import { CartaUno } from "@/types/CartaUno";

interface Props {
  historico: CartaUno[];
}

export default function HistoricoMesa({ historico }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Histórico da mesa:</Text>
      {historico.length === 0 ? (
        <Text style={styles.vazio}>Nenhuma carta jogada ainda.</Text>
      ) : (
        historico
          .slice()
          .reverse()
          .map((carta, index) => (
            <Text key={index} style={styles.item}>
              {carta.acaoEspecial ?? carta.numero} ({carta.cor})
            </Text>
          ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    fontSize: 16,
  },
  vazio: {
    fontStyle: "italic",
    color: "#999",
  },
});
