import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { CartaUno } from "@/types/CartaUno";
import { useState } from "react";

interface Props {
  maoJogador: CartaUno[];
  jogar: (index: number) => void;
}

export default function ChooseCard({ maoJogador, jogar }: Props) {
  const [cartaSelecionada, setCartaSelecionada] = useState<string>("");

  const handleValueChange = (itemValue: string) => {
    setCartaSelecionada(itemValue);

    if (itemValue !== "") {
      jogar(Number(itemValue));
      setCartaSelecionada("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Escolha sua carta:
      </Text>

      <Picker
        selectedValue={cartaSelecionada}
        onValueChange={handleValueChange}
        style={styles.picker}
        accessibilityLabel="Lista de cartas na sua mão. Selecione uma para jogar imediatamente."
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
