import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { VictoryChart, VictoryBar, VictoryTheme, VictoryAxis } from "victory-native";

export default function Grafico() {
  // Dados de exemplo: número de tarefas concluídas de segunda a domingo
  const weeklyData = [
    { x: "Seg", y: 4 },
    { x: "Ter", y: 9 },
    { x: "Qua", y: 2 },
    { x: "Qui", y: 6 },
    { x: "Sex", y: 8 },
    { x: "Sáb", y: 3 },
    { x: "Dom", y: 1 },
  ];

  return (
    <View style={styles.Container}>
      <View style={styles.Corpo}>
        <Text style={styles.Titulo}>Tarefas da Semana</Text>

        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={{ x: 20, y: 10 }}
        >
          {/* Eixo X: dias da semana */}
          <VictoryAxis
            tickValues={["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]}
            style={{
              tickLabels: { fontSize: 14, padding: 5 },
            }}
          />

          {/* Eixo Y: número de tarefas */}
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: { fontSize: 12, padding: 5 },
            }}
          />

          {/* Gráfico de barras */}
          <VictoryBar
            data={weeklyData}
            x="x"
            y="y"
            barRatio={0.8}
            style={{
              data: { fill: "#4f6cff", borderRadius: 5 },
            }}
          />
        </VictoryChart>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  Corpo: {
    backgroundColor: "rgba(217, 217, 217, 0.4)",
    width: "95%",
    height: "95%",
    borderRadius: 25,
    alignItems: "center",
    paddingVertical: 20,
  },
  Titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});