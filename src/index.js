import { View, ScrollView, ActivityIndicator, RefreshControl, StyleSheet, FlatList, SafeAreaView, Text, Alert, Image, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Location from 'expo-location'


const apikey = '8edb8ba82dd3b6070609afa24237a379'
const ApiCall = `http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=${apikey}`


const oneapicall = 'https://api.open-meteo.com/v1/forecast?latitude=${}.52&longitude=13.41&hourly=temperature_2m'

const Weather = () => {

    const [forecast, setForecast] = useState(null)
    const [refreshing, setRefreshing] = useState(false)
    //  const [hourly, setHourly] = useState(null)


    const loadforecast = async () => {
        setRefreshing(true)
        const { status } = await Location.requestForegroundPermissionsAsync()

        if (status !== 'granted') {
            setRefreshing(false)
            Alert.alert('premission Not Granted')
            return
        }
        const location = await Location.getCurrentPositionAsync({})


        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${apikey}&units=imperial`)


        const data = await response.json()


        //  const hourly = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&hourly=temperature_2m`)
        //    const res = await hourly.json()
        //   setHourly(res)
        //  console.log(res)
        if (!response.ok) {
            Alert.alert('Error', 'Something went Wrong')

        } else {
            setForecast(data)
            //   setHourly(res)
        }
        setRefreshing(false)
    }
    useEffect(() => {
        loadforecast()
    }, [])

    if (!forecast) {
        return (
            <SafeAreaView style={styles.loading}>
                <ActivityIndicator size='large' />
            </SafeAreaView>
        )
    }

    const current = forecast['weather'][0]
    //console.log(forecast)
    const sun = new Date(forecast.dt).toLocaleTimeString()
    const moon = new Date(forecast.sys.sunset).toLocaleTimeString()
    // console.log(sun)
    // console.log(moon)

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadforecast()} />} style={{ marginTop: 50 }}>


                <Text style={styles.title}>Current Weather</Text>
                <Text style={{ alignItems: 'center', textAlign: 'center' }}>Current Location</Text>
                <View style={styles.current}>
                    <Image style={styles.largeIcon} source={{ uri: `http://openweathermap.org/img/wn/${current.icon}@4x.png` }}>

                    </Image>
                    <Text style={styles.currentTemp}>
                        {Math.round((((forecast.main.temp) - 32) * 5) / 9)}°C
                    </Text>
                </View>
                <Text style={styles.currentDescription}>
                    {current.description}
                </Text>
                <View style={styles.extraInfo}>
                    <View style={styles.info}>
                        <Image source={require('../assets/temp.png')} style={{ width: 40, height: 40, borderRadius: 40 / 2, marginLeft: 50 }} />
                        <Text style={styles.text}>
                            {Math.round((((forecast.main.feels_like) - 32) * 5) / 9)}°C
                        </Text>
                        <Text style={styles.text}>
                            Feels Like
                        </Text>
                    </View>

                    <View style={styles.info}>
                        <Image source={require('../assets/min.png')} style={{ width: 40, height: 40, borderRadius: 40 / 2, marginLeft: 50 }} />
                        <Text style={styles.text}>
                        {Math.floor((((forecast.main.temp_min) - 32) * 5) / 9)}°C -- {Math.ceil((((forecast.main.temp_max) - 32) * 5) / 9)}°C
                        </Text>
                        <Text style={styles.text}>
                            Min--Max
                        </Text>
                    </View>

                </View>
                <View style={styles.extraInfo}>
                    <View style={styles.info}>
                        <Image source={require('../assets/visibility.png')} style={{ width: 40, height: 40, borderRadius: 40 / 2, marginLeft: 50 }} />
                        <Text style={styles.text}>
                            {(forecast.visibility) / 1000} Km
                        </Text>
                        <Text style={styles.text}>
                            Visibility
                        </Text>
                    </View>

                    <View style={styles.info}>
                        <Image source={require('../assets/wind.png')} style={{ width: 40, height: 40, borderRadius: 40 / 2, marginLeft: 50 }} />
                        <Text style={styles.text}>
                           {Math.round(forecast.wind.speed)} Km/h
                        </Text>
                        <Text style={styles.text}>
                            Wind
                        </Text>
                    </View>

                </View>
                <View style={styles.extraInfo}>
                    <View style={styles.info}>
                        <Image source={require('../assets/presure.png')} style={{ width: 40, height: 40, borderRadius: 40 / 2, marginLeft: 50 }} />

                        <Text style={styles.text}>

                            {(forecast.main.pressure)/1000} mBar
                        </Text>
                        <Text style={styles.text}>
                            Pressure
                        </Text>
                    </View>

                    <View style={styles.info}>
                        <Image source={require('../assets/humidity.png')} style={{ width: 40, height: 40, borderRadius: 40 / 2, marginLeft: 50 }} />
                        <Text style={styles.text}>
                            {forecast.main.humidity}%
                        </Text>
                        <Text style={styles.text}>
                            Humidity
                        </Text>
                    </View>

                </View>


            </ScrollView>
        </SafeAreaView>
    )
}

export default Weather

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "ECDBBB"
    }
    ,
    title: {
        textAlign: 'center',
        fontSize: 22
        , fontWeight: 'bold',
        color: '#c84831'

    },
    current: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center'
    },
    largeIcon: {
        width: 150,
        height: 250,
        marginLeft: 20
    },
    currentTemp: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    currentDescription: {
        width: '100%',
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'blue',
        fontSize: 24,
        marginBottom: 5
    },
    info: {
        width: Dimensions.get('screen').width / 2.5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 15,
        justifyContent: 'center'
    },
    extraInfo: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
        padding: 10
    },
    text: {
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',

    },
    subtitle: {
        fontSize: 24,
        marginVertical: 12,
        marginLeft: 7,
        color: '#C84831',
        fontWeight: 'bold'

    }
})