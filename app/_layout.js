import { Stack } from 'expo-router'
import { theme } from './service/Theme'

export default function Layout () { // Esse arquivo com essa nomenclatura serve para adicionar um "header" em cima de todas as telas, e esse heade funciona como um navegador
    return (
        <Stack screenOptions={{ contentStyle: { backgroundColor: theme.colorsBackground.pretoDeFundo }}}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    )
}