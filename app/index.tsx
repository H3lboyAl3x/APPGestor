// index.tsx


// Importação das Telas
import Navegacao from '@/components/Telas/Navegacao';
import Adicionar_tarefa from '@/components/Telas/Adicionar_tarefa';
import Grafico from '@/components/Telas/grafico';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function HomeScreen() {
  return (
    <Stack.Navigator initialRouteName='Navegacao'>
        <Stack.Screen 
          name="Navegacao" 
          component={Navegacao} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Adicionar_tarefa" 
          component={Adicionar_tarefa}
          options={{
            title: "Adicionar tarefa",
            headerTitleStyle:{
              fontSize:20
            }
          }}
        />
        <Stack.Screen 
          name="Grafico" 
          component={Grafico}
          options={{
            title: "Grafico",
            headerTitleStyle:{
              fontSize:20
            }
          }}
        />
      </Stack.Navigator>
  );
}