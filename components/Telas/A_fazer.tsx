import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { deleteUser, getUsers, initDB, updateUser } from "../Banco_de_dados/database";
import { Tarefa } from "../Banco_de_dados/type";
import { useState, useCallback, useRef, useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import { Audio } from 'expo-av';

const TOTAL_TIME = 0.1 * 60; 
const PAUSE_TIME = 0.1 * 60;

export default function A_fazer({navigation}: any){
    const [tarefa, settarefa] = useState<Tarefa[]>([]);
    const [timeLeft, setTimeLeft] = useState<number>(TOTAL_TIME);
    const [minutes, setMinutes] = useState<string>("25");
    const [seconds, setSeconds] = useState<string>("00");
    const [running, setRunning] = useState<boolean>(false);
    const intervalRef = useRef<number | null>(null);
    const [status, setstatus] = useState<0 | 1>(0);
    const [mode, setMode] = useState<"Atividade" | "Pausa">("Atividade");
    useEffect(() => {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        setMinutes(String(mins).padStart(2, "0"));
        setSeconds(String(secs).padStart(2, "0"));
    }, [timeLeft]);
    const pausa = useCallback(async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../../assets/som/alarme.mp3')
        );
        const tarefasAtivas = tarefa.filter(t => t.estado === 2);
        if (status === 0 && minutes === "00") {
            setTimeLeft(PAUSE_TIME);
            setstatus(1);
            setMode("Pausa");
            sound.playAsync();
            setTimeout(() => {
                sound.unloadAsync();
            }, 2000);
        } 
        else if (status === 1 && minutes === "00") {
            setTimeLeft(TOTAL_TIME);
            setstatus(0);
            setMode("Atividade");
            sound.playAsync();
            setTimeout(() => {
                sound.unloadAsync();
            }, 2000);
        }
    }, [status, minutes, tarefa]);
    useEffect(() => {
        if (!running) return;
        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    if (intervalRef.current !== null) {
                        clearInterval(intervalRef.current);
                    }
                    pausa();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, [running, pausa, tarefa]);
    const start = () => {   
        const tarefasAtivas = tarefa.filter(t => t.estado === 2);
        if (tarefasAtivas.length > 0) {
            setRunning(true);
        } else {
            Alert.alert("Atenção", "Você precisa ter pelo menos aqui para iniciar!");
        }
    };
    const pause = () => {
        clearInterval(intervalRef.current!);
        setRunning(false);
    };
    const reset = () => {
        clearInterval(intervalRef.current!);
        setRunning(false);
        if (status === 0) {
            setTimeLeft(TOTAL_TIME);
            setMode("Atividade");
        } 
        else if (status === 1) {
            setTimeLeft(PAUSE_TIME);
            setMode("Pausa");
        }
    };
    const handleLongPress = (item: Tarefa) => {
        Alert.alert(
            "O que deseja fazer?",
            `Tarefa: ${item.nome}`,
            [
                { text: "Apagar", onPress: () => apagarTarefa(item)},
                { text: "Cancelar", style: "cancel" }
            ]
        );
    };
    const atualizar = async (item: Tarefa) => {
        const estado = 3;
        Alert.alert(
            "Deseja concluir essa tarefa?",
            `Tarefa: ${item.nome}`,
            [
                { text: "Concluir", onPress: async () => {await updateUser(item.id!, item.nome, item.data, estado); carregarTarefa();}},
                { text: "Cancelar", style: "cancel" }
            ]
        );
    }
    const apagarTarefa = async (item: Tarefa) => {
        await deleteUser(item.id!);
        carregarTarefa();
    };
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
        }, [])
    );
    useEffect(() => {
        const tarefasAtivas = tarefa.filter(t => t.estado === 2);

        if (tarefasAtivas.length === 0 && running) {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }

            setRunning(false);
            setTimeLeft(TOTAL_TIME);
            setstatus(0);
            setMode("Atividade");
        }
    }, [tarefa, running]);
    return (
        <View style={styles.Container}>
            <View style={styles.Corpo}>
                <Text style={[styles.Titulo, {marginTop: "2%", fontSize: 30}]}>{minutes}:{seconds}</Text>
                <Text style={styles.Titulo}>Tempo de {mode}</Text>
                <FlatList
                    data={tarefa}
                    keyExtractor={(item) => item.id!.toString()}
                    renderItem={({ item }) => item.estado === 2 ? (
                        <TouchableOpacity style={styles.Habitos} onLongPress={() => handleLongPress(item)} onPress={() => atualizar(item)}>
                            <Text style={styles.Texto}>{item.nome}</Text>
                        </TouchableOpacity>
                    ) : null}
                    style={{ flex: 1, width: '90%' }}
                    contentContainerStyle={{ paddingBottom: 10 }}
                />
                <View style={styles.Barra}/>
                <View style={styles.base}>
                    <Ionicons name="refresh-outline" style={[styles.botoes, running && { opacity: 0.01 }]} size={40} color="#fff" onPress={!running ? reset : undefined}/>
                    <Ionicons name={running ? "pause-circle-outline" : "caret-forward-circle-outline"} style={styles.botoes} size={40} color="#fff" onPress={running ? pause : start}/>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    Container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF'
    },
    Corpo:{
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
        width: "95%",
        height: "95%",
        borderRadius: 25,
        alignItems: "center"
    },
    Titulo:{
        fontSize: 20,
        textAlign: "center",
    },
    Barra:{
        width: "90%", 
        height: 2,
        backgroundColor: "#000000",
    },
    Habitos:{
        height: 70,
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 50,
        marginVertical: '1%',
        alignItems: "center",
        justifyContent: "center",
    },
    Texto:{
        fontSize: 17,
        color: "#000"
    },
    base:{
        height: "12%",
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
    },
    botoes:{
        height: "50%",
        width: "12%",
        alignSelf: "center",
        marginHorizontal: "30%",
        borderRadius: 25

    }
});