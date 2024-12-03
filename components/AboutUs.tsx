import React from "react";
import { View, ScrollView, StyleSheet, useColorScheme } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { Colors } from "@/constants/Colors";

interface AboutUsProps {
  onBack: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onBack }) => {
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
      <Text style={[styles.title, { color: colors.text }]}>O nas</Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Kim jesteśmy?
      </Text>
      <Text style={[styles.paragraph, { color: colors.text }]}>
        Witamy w +Kom - Twoim zaufanym sklepie z elektroniką użytkową! Jesteśmy
        firmą, która od lat specjalizuje się w dostarczaniu nowoczesnych i
        niezawodnych urządzeń elektronicznych dla naszych klientów.
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Nasza misja
      </Text>
      <Text style={[styles.paragraph, { color: colors.text }]}>
        Naszym celem jest uczynienie nowoczesnej technologii dostępną dla
        każdego. Wierzymy, że elektronika może poprawić jakość życia i pomagać
        w codziennych wyzwaniach. Dlatego oferujemy szeroką gamę produktów od
        renomowanych producentów w konkurencyjnych cenach.
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Co oferujemy?
      </Text>
      <Text style={[styles.paragraph, { color: colors.text }]}>
        W naszym asortymencie znajdziesz:
      </Text>
      <Text style={[styles.listItem, { color: colors.text }]}>
        - Smartfony i tablety
      </Text>
      <Text style={[styles.listItem, { color: colors.text }]}>
        - Laptopy i akcesoria komputerowe
      </Text>
      <Text style={[styles.listItem, { color: colors.text }]}>
        - Telewizory i sprzęt audio
      </Text>
      <Text style={[styles.listItem, { color: colors.text }]}>
        - Sprzęt gamingowy
      </Text>
      <Text style={[styles.listItem, { color: colors.text }]}>
        - Inteligentne urządzenia domowe
      </Text>
      <Text style={[styles.listItem, { color: colors.text }]}>
        - Akcesoria elektroniczne i wiele więcej!
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Dlaczego warto nas wybrać?
      </Text>
      <Text style={[styles.paragraph, { color: colors.text }]}>
        - Gwarantujemy wysoką jakość produktów i obsługi klienta.
        {"\n"}- Nasz zespół zawsze służy pomocą i doradztwem przy wyborze
        produktów.
        {"\n"}- Oferujemy szybkie i niezawodne dostawy na terenie całego kraju.
        {"\n"}- Regularnie organizujemy promocje i zniżki, by zapewnić
        atrakcyjne ceny.
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Skontaktuj się z nami!
      </Text>
      <Text style={[styles.paragraph, { color: colors.text }]}>
        Jeśli masz pytania lub potrzebujesz pomocy, skontaktuj się z nami:
      </Text>
      <Text style={[styles.contactInfo, { color: colors.text }]}>
        E-mail: support@pluskom.pl
      </Text>
      <Text style={[styles.contactInfo, { color: colors.text }]}>
        Telefon: +48 123 456 789
      </Text>
      <Text style={[styles.contactInfo, { color: colors.text }]}>
        Adres: ul. Technologiczna 10, 90-001 Łódź
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
  listItem: {
    fontSize: 14,
    paddingHorizontal: 16,
    marginBottom: 5,
  },
  contactInfo: {
    fontSize: 14,
    paddingHorizontal: 16,
    marginTop: 5,
  },
  backButton: {
    alignSelf: "flex-start",
    marginLeft: 8,
  },
});

export default AboutUs;
