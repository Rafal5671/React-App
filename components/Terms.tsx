import React from "react";
import { View, ScrollView, StyleSheet, useColorScheme } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { Colors } from "@/constants/Colors";

interface TermsProps {
  onBack: () => void;
}

const Terms: React.FC<TermsProps> = ({ onBack }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={onBack}
        style={[styles.backButton, { tintColor: colors.text }]}
      />
      <Text style={[styles.title, { color: colors.text }]}>Regulamin</Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        1. Postanowienia ogólne
      </Text>
      <Text style={[styles.paragraph, { color: colors.text }]}>
        Niniejszy regulamin określa zasady korzystania ze sklepu internetowego
        + Kom.
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        2. Definicje
      </Text>
      <Text style={[styles.paragraph, { color: colors.text }]}>
        <Text style={styles.bold}>Sprzedawca</Text> - +Kom, z siedzibą w Łodzi,
        {"\n"}
        <Text style={styles.bold}>Klient</Text> - osoba fizyczna, prawna lub
        jednostka organizacyjna nieposiadająca osobowości prawnej, która
        dokonuje zamówienia w Sklepie.{"\n"}
        <Text style={styles.bold}>Sklep</Text> - serwis internetowy, za
        pośrednictwem którego Klient może składać zamówienia.
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        3. Zasady korzystania ze sklepu
      </Text>
      <Text style={[styles.paragraph, { color: colors.text }]}>
        3.1. Klient może korzystać ze Sklepu zgodnie z jego przeznaczeniem.
        {"\n"}
        3.2. Klient zobowiązany jest do korzystania ze Sklepu w sposób zgodny z
        prawem oraz niniejszym regulaminem.
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        4. Składanie zamówień
      </Text>
      <Text style={[styles.paragraph, { color: colors.text }]}>
        4.1. Klient może składać zamówienia 24 godziny na dobę, 7 dni w
        tygodniu.{"\n"}
        4.2. Zamówienia są realizowane w dni robocze.{"\n"}
        4.3. W celu złożenia zamówienia, Klient powinien dodać wybrane produkty
        do koszyka, a następnie wypełnić formularz zamówienia.
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        5. Płatności
      </Text>
      <Text style={[styles.paragraph, { color: colors.text }]}>
        5.1. Klient może dokonać płatności za zamówienie za pomocą dostępnych w
        Sklepie metod płatności.{"\n"}
        5.2. Szczegółowe informacje na temat dostępnych metod płatności znajdują
        się na stronie Sklepu.
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        6. Dostawa
      </Text>
      <Text style={[styles.paragraph, { color: colors.text }]}>
        6.1. Dostawa zamówionych produktów odbywa się na terenie Polski.{"\n"}
        6.2. Koszty dostawy są podane na stronie Sklepu i są zależne od
        wybranej metody dostawy.
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        7. Prawo odstąpienia od umowy
      </Text>
      <Text style={[styles.paragraph, { color: colors.text }]}>
        7.1. Klient ma prawo odstąpić od umowy w terminie 14 dni od dnia
        otrzymania zamówienia.{"\n"}
        7.2. Aby skorzystać z prawa odstąpienia od umowy, Klient powinien
        złożyć oświadczenie o odstąpieniu od umowy w formie pisemnej lub za
        pomocą formularza dostępnego na stronie Sklepu.
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        8. Reklamacje
      </Text>
      <Text style={[styles.paragraph, { color: colors.text }]}>
        8.1. Klient ma prawo do złożenia reklamacji w przypadku stwierdzenia
        wad fizycznych zamówionych produktów.{"\n"}
        8.2. Reklamacje należy składać w formie pisemnej na adres Sprzedawcy
        lub za pomocą formularza dostępnego na stronie Sklepu.
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        9. Postanowienia końcowe
      </Text>
      <Text style={[styles.paragraph, { color: colors.text }]}>
        9.1. W sprawach nieuregulowanych niniejszym regulaminem mają zastosowanie
        przepisy prawa polskiego.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    paddingLeft: 16,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  backButton: {
    alignSelf: "flex-start",
    marginLeft: 8,
  },
});

export default Terms;
