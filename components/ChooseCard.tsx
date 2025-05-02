import { View, Text, StyleSheet, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { CartaUno } from "@/types/CartaUno";
import { useState } from "react";

interface Props {
  maoJogador: CartaUno[];
  jogar: (index: number) => void;
}

export default function ChooseCard({ maoJogador, jogar }: Props) {
  const [cartaSelecionada, setCartaSelecionada] = useState<string>("");

  const handleJogar = () => {
    jogar(Number(cartaSelecionada));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha sua carta:</Text>

      <Picker
        selectedValue={cartaSelecionada}
        onValueChange={(itemValue) => {
          setCartaSelecionada(itemValue);
        }}
        style={styles.picker}
      >
        <Picker.Item label="Selecione uma carta..." value="" />
        {maoJogador.map((carta, index) => (
          <Picker.Item
            key={index}
            label={`${carta.acaoEspecial ?? carta.numero} (${carta.cor})`}
            value={index.toString()}
          />
        ))}
      </Picker>

      <Button
        title="Jogar carta"
        onPress={handleJogar}
        disabled={cartaSelecionada === ""}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  picker: {
    width: 300,
    height: 50,
    marginBottom: 20,
  },
});
