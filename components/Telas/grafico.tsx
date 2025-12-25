import { View, Text, StyleSheet } from "react-native";

export default function grafico(){
    return(
        <View>
            <Text>oiiiii</Text>
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
        backgroundColor: 'rgba(217, 217, 217, 0.4)',
        width: "95%",
        height: "95%",
        borderRadius: 25,
        alignItems: "center"
    },
    Titulo:{

    },
});