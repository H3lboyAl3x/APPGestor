import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { deleteUser, getUsers, initDB } from "../Banco_de_dados/database";
import { Tarefa } from "../Banco_de_dados/type";
import { useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";

export default function Concluida({navigation}: any){
    const [tarefa, settarefa] = useState<Tarefa[]>([]);
    const handleLongPress = (item: Tarefa) => {
        Alert.alert(
            "O que deseja fazer?",
            `Tarefa: ${item.nome}`,
            [
                { text: "Apagar", onPress: () => apagarTarefa(item)},
                { text: "Cancelar", style: "cancel" }
            ]
        );
        carregarTarefa();
    };
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
    return (
        <View style={styles.Container}>
            <View style={styles.Corpo}>
                <Text style={[styles.Titulo, {marginTop: "2%"}]}>Tarefas</Text>
                <FlatList
                    data={tarefa}
                    keyExtractor={(item) => item.id!.toString()}
                    renderItem={({ item }) => item.estado === 3 ? (
                        <TouchableOpacity style={styles.Habitos} onLongPress={() => handleLongPress(item)}>
                            <Text style={styles.Texto}>{item.nome}</Text>
                        </TouchableOpacity>
                    ) : null}
                    style={{ flex: 1, width: '90%' }}
                    contentContainerStyle={{ paddingBottom: 10 }}
                />
                <View style={styles.Barra}/>
                <Ionicons style={styles.Botao} name="add-circle-outline" size={40} color="#000" onPress={() => navigation.navigate("Grafico")}/>
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
        backgroundColor: 'rgba(51, 255, 0, 0.5)',
        width: "95%",
        height: "95%",
        borderRadius: 25,
        alignItems: "center"
    },
    Titulo:{
        fontSize: 25,
        textAlign: "center",
    },
    Barra:{
        width: "90%", 
        height: 2,
        backgroundColor: "#000000",
        marginBottom: "10%",
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
    Botao:{
        height: 40,
        width: '10%',
        marginBottom: "5%",
    },
});