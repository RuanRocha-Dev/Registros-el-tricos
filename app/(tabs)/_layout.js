import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter, useSegments } from 'expo-router';
import { theme } from '../service/Theme';

export default function TabLayout() {
  const router = useRouter();
  const segments = useSegments();

  const optionsTabGeral = {
    tabBarActiveTintColor: 'blue',
    tabBarInactiveTintColor: 'gray',
    tabBarHideOnKeyboard: true,
    tabBarShowLabel: false,
    tabBarStyle: {
      width: 200,        
      height: 85,
      paddingTop: 10,
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 40,              
      borderRadius: 50,
      borderTopWidth: 0,
      backgroundColor: theme.colorsBackground.cinzaEscuro,
    },
  };

  const tabBarItemStyle = {
    backgroundColor: theme.colorsBackground.verdeAtivo,
    borderRadius: '50%',
    color: theme.colorsBackground.cinzaEscuro
  }

  const verificaRegistro = segments[1] === undefined ? tabBarItemStyle : '';
  const verificaAgendamento = segments[1] !== undefined ? tabBarItemStyle : '';


  return (
    <Tabs screenOptions={optionsTabGeral}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'REGISTROS',
          tabBarIcon: () => (
            <FontAwesome size={30} name="home" color='#cccc' />
          ),
          headerStyle: {
            backgroundColor: theme.colorsBackground.cinzaEscuro,
          },
          headerTitleAlign: 'center',
          headerTintColor: '#cccc',
          headerStatusBarHeight: 30,
          tabBarIconStyle: {
            width: '100%',
            height: '100%',
          },
          tabBarItemStyle: {
            maxWidth: 65,
            maxHeight: 65,
            marginRight: 25,
            ...verificaRegistro
          }
        }}
      />
      <Tabs.Screen
        name="Agendamentos"
        options={{
          title: 'AGENDAMENTOS',
          tabBarIcon: () => (
            <FontAwesome size={30} name="cog" color='#cccc' />
          ),
          headerStyle: {
            backgroundColor: theme.colorsBackground.cinzaEscuro,
          },
          headerTitleAlign: 'center',
          headerTintColor: '#cccc',
          headerStatusBarHeight: 30,
          tabBarIconStyle: {
            width: '100%',
            height: '100%',
          },
          tabBarItemStyle: {
            maxWidth: 65,
            maxHeight: 65,
            marginLeft: 25,
            ...verificaAgendamento
          }
        }}
      />
    </Tabs>
  );
}
