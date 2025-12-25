import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Tela_inicio from './Tela_inicio';
import A_fazer from './A_fazer';
import Concluida from './Concluida';

const Tab = createBottomTabNavigator();

export default function Navegacao() {
  return (
    <Tab.Navigator
        screenOptions={{
            tabBarStyle: {
                backgroundColor: '#ffffff',
                height: "10%",
                marginBottom: "10%"
            },
            tabBarActiveTintColor: '#56177B',
            tabBarInactiveTintColor: '#000000',
            tabBarIcon: () => null,
            headerTitleStyle: { fontSize: 25, fontWeight: 'bold' },
            tabBarLabelStyle: {
                fontSize: 17,
            },
        }}
    >
        <Tab.Screen name="Tela_inicio" component={Tela_inicio} options={{title: "Tarefas"}}/>
        <Tab.Screen name="A_fazer" component={A_fazer} options={{title: "A fazer"}}/>
        <Tab.Screen name="Concluida" component={Concluida} options={{title: "Concluidas"}}/>
    </Tab.Navigator>
  );
}