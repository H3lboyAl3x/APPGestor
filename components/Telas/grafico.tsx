import React, { useCallback, useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from "victory-native";
import { getUsers, initDB } from "../Banco_de_dados/database";
import { Tarefa } from "../Banco_de_dados/type";
import { useFocusEffect } from "expo-router";

const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function getWeekNumber(d: Date) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
export default function App() {
    const [tarefa, settarefa] = useState<Tarefa[]>([]);
    const [data, setData] = useState<{ day: number; count: number }[]>([]);
    const carregarTarefa = async () => {
        const lista = await getUsers();
        settarefa(lista);
    };
    useFocusEffect(
        useCallback(() => {
            const carregar = async () => {
                await initDB();
                await carregarTarefa();
            };
            carregar();
        },[])
    );
    useEffect(() => {
        const contagemDias = [0, 0, 0, 0, 0, 0, 0];
        const tarefasFiltradas = tarefa.filter(t => t.estado === 3);
        const hoje = new Date();
        const semanaAtual = getWeekNumber(hoje);
        const tarefasSemanaAtual = tarefasFiltradas.filter(t => {
            const dataObj = new Date(t.data);
            return getWeekNumber(dataObj) === semanaAtual;
        });
        tarefasSemanaAtual.forEach(t => {
            const dataObj = new Date(t.data);
            let diaSemana = dataObj.getDay();
            diaSemana = diaSemana === 0 ? 7 : diaSemana;
            contagemDias[diaSemana - 1] += 1;
        });
        const graficoData = contagemDias.map((count, index) => ({
            day: index + 1,
            count
        }));
        setData(graficoData);
    },[tarefa]);
    return (
        <View style={styles.container}>
            <VictoryChart width={350} theme={VictoryTheme.material}>
                <VictoryAxis tickValues={[1, 2, 3, 4, 5, 6, 7]} tickFormat={weekDays} />
                <VictoryAxis dependentAxis />
                <VictoryBar data={data} x="day" y="count" />
            </VictoryChart>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5fcff"
    }
});