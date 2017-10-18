/**
 * Importation des modules nécessaires depuis React Native
 */
import React from 'react'
import { ScrollView, Image, TouchableHighlight, ActivityIndicator, View, Text, StyleSheet, ListView, Button } from 'react-native'
/**
 * Importation des modules persos depuis nos différents dossiers
 */
import {colors, fontSize} from '../config/styles'
import {SETTINGS} from '../config/settings'
import Header from '../components/Header'
import Footer from '../components/Footer'

/**
 * URL D'importation des données depuis l'API
 */
const REQUEST_URL = `${SETTINGS.SITEURL}${SETTINGS.APIURL}${SETTINGS.VERSION}/circuit`


export default class GuidedTour extends React.Component {

    static navigationOptions = {
        title: 'Visites guidées',
    }

    constructor(props) {
        super(props)
        // On initalise le state
        this.state = {
            isLoading: true,
            town : '',
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            myPositionLat: 0,
            myPositionLong: 0
        }
    }

    // On récupère les données passées en paramètres dans la navigation
    componentWillReceiveProps(nextProps) {
        this.props.navigation.setOptions({
            town: nextProps.navigation.state.params.town
        })
    }

    componentDidMount() {

        // On récupère la position du visiteur
        this.watchID = navigator.geolocation.watchPosition((position) => {
            this.setState({ 
                myPositionLat : Number(position.coords.latitude).toFixed(6), 
                myPositionLong : Number(position.coords.longitude).toFixed(6)
            })
        })

        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseJson) => {
            // On met à jour le state avec les données reçues
            this.setState({
            isLoading: false,
            town: this.props.navigation.state.params.town,
            dataSource: this.state.dataSource.cloneWithRows(responseJson),
            }, function() {
            })
        })
        .catch((error) => {
            console.error(error);
        })
        .done(() => {

        })

    }



    render() {
        const { navigate } = this.props.navigation

        // Si la page est en cours de chargement, on affiche le loader
        if(this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 50}}>
                    <ActivityIndicator />
                </View>
            )
        } else {
            return (
                <View style={{flex: 1}}>
                    <ScrollView>
                        <View>
                            <Header subtitle='Visites guidées' image='route' />

                            <View style={{padding: 25}}>
                                <View style={styles.divTexteHaut}>
                                    <View style={{textAlign: 'center'}}>
                                        <Text style={styles.fenetreTitre}>Découvrez la liste des visite guidées du moment</Text>
                                    </View>
                                </View>
                            </View>

                            <View>
                                <ListView
                                    dataSource={this.state.dataSource}
                                    renderRow={(rowData) => 
                                        <TouchableHighlight style={styles.divContainer} onPress={() => navigate('PointsOfInterest', {circuitID : rowData.ID, id: rowData.ID, circuitName: rowData.title, myPositionLat: this.state.myPositionLat, myPositionLong: this.state.myPositionLong})}>
                                            
                                            <View style={styles.divFlex}>

                                                <View style={styles.divImg}>
                                                    <Image style={{width: undefined, height: undefined, flex: 1, resizeMode: 'cover'}} source={{uri:rowData.imageurl}} />
                                                </View>

                                                <View style={styles.divTexte}>

                                                    <View style={styles.divTitre}>
                                                        <Text style={styles.texteTitre}>{rowData.title}</Text>
                                                    </View>

                                                    <View style={styles.divDescription}>
                                                        <Text style={styles.texteDescription}>{rowData.description}</Text>
                                                    </View>


                                                    <View style={styles.divIcones}>                                                    
                                                        <Text style={{textAlign: 'right'}}>
                                                            {rowData.familialcircuit == 1 && <Image style={{width: 25, height: 25, marginRight: 5}} source={require('../images/poussette.png')} /> }
                                                            {rowData.usablebydisabledperson == 1 && <Image style={{width: 25, height: 25, marginRight: 5}} source={require('../images/disabled.png')} /> }
                                                            {rowData.difficultylevel == 1 && <Image style={styles.level} source={require('../images/level1.png')}/> || rowData.difficultylevel == 2 && <Image style={styles.level} source={require('../images/level2.png')}/> || rowData.difficultylevel == 3 && <Image style={styles.level} source={require('../images/level3.png')}/> }
                                                        </Text> 
                                                    </View>

                                                </View>

                                            </View>

                                        </TouchableHighlight> 
                                        
                                    }
                                />
                            </View>
                        </View>

                        
                        
                    </ScrollView>
                    <Footer />
                </View>
            )
        }
    }
}

/**
 * Style de l'écran
 */
const styles = StyleSheet.create({
    fenetreTitre: {
        fontSize: 22,
        textAlign: 'center'
    },
    level: {
        width: 25,
        height: 25
    },
    divContainer: {
        width: '100%',
        height: 180,
        backgroundColor: colors.violet,
        marginTop: 5,
        marginBottom: 5
    },
    divFlex: {
        flex: 1,
        flexDirection: 'row'
    },
    divImg : {
        width: '30%',
        height: 180
    },
    divTexte : {
        flex: 1,
        flexDirection: 'column'
    },
    texteTitre : {
        color: '#fff',
        fontSize: 20,
        marginLeft: 20,
        marginTop: 10
    },
    divTitre : {
        width: '100%'
    },
    divDescription: {
        width: '100%'
    },
    texteDescription : {
        color: '#fff',
        fontSize: 14,
        marginLeft: 20,
        marginTop: 10
    },
    divIcones : {
        position: 'absolute',
        bottom: 0,
        margin: 5
    }
})