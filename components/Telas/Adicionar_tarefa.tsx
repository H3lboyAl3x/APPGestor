import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { addUser, updateUser } from "../Banco_de_dados/database";
import { useState } from "react";

export default function Adicionar_tarefa({ navigation, route }: any) {
    const habitToEdit = route.params?.habito; // se houver, é edição
    const [nome, setnome] = useState(habitToEdit?.nome || '');
    const estado = 1;
    const adicionarOuEditar = async () => {
        if (!nome) return;
        const dataAtual = getDataAtual();
        if (habitToEdit) {
            await updateUser(habitToEdit.id!, nome, dataAtual, estado);
        } else {
            await addUser(nome, dataAtual, estado);
        }
        navigation.goBack();
    };  
    const getDataAtual = () => {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const dia = String(hoje.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    };
    return (
        <View style={styles.Container}>
            <View style={styles.Conteudo}>
                <Text style={styles.Texto}>Nome</Text>
                <TextInput style={styles.Coixa_de_texto} value={nome} onChangeText={setnome} />
                <TouchableOpacity style={styles.Botao} onPress={adicionarOuEditar}>
                    <Text style={styles.Texto_botao}>{habitToEdit ? 'Salvar alterações' : 'Criar'}</Text>
                </TouchableOpacity>
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
    Conteudo:{
        backgroundColor: '#FFFFFF',
        height: '90%',
        width: '90%',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#D9D9D9',
    },
    Texto:{
        fontSize: 15,
        marginVertical: '5%',
        marginHorizontal: '5%',
        fontWeight: 'bold'
    },
    Coixa_de_texto:{
        width: '90%',
        height: 60,
        marginHorizontal: '5%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        justifyContent: 'center',
    },
    Botao:{
        backgroundColor: '#0091FF',
        height: 60,
        width: '90%',
        marginHorizontal: '5%',
        marginTop: '5%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    Texto_botao:{
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold'
    }
});