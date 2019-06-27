import React, { Component } from 'react';
import { SearchBar } from 'react-native-elements'
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import RNGooglePlaces from 'react-native-google-places';

export default class SearchPlace extends Component {
    static navigationOptions = { header: null }
    constructor(props) {
        super(props);

        this.state = {
            place: "",
            concatDestinationLot: "",
            currentPlace: "",
            results: []
        }
    }
    async getLocationCoord(locationID) {

        //U must find a way to wait for this function below to give u a value
        await RNGooglePlaces.lookUpPlaceByID(locationID)
            .then((result) => {
                const coord = this.mergeLot(result.latitude, result.longitude);
                this.setState({ concatDestinationLot: coord });
                console.log("Hi");
            })
            .catch(error => console.log(error))
        console.log('No');
        return (this.state.concatDestinationLot);
    };




    onDestination(location) {
        //We will have to send location to the map that needs to render
        //the route directions. So we navigate to that map
        const { origin, OriginPlaceID } = this.state;
        let Place = location

        console.log(location)

        let placeID = location.placeID


        this.props.navigation.navigate("BookRide", { placeID, Place });


    }



    openSearchModal(data) {
        // This fucntion gives us autocomplete list when we seacrh for places

        RNGooglePlaces.getAutocompletePredictions(data, {country: 'NG'})
            .then((place) => {
                this.setState({
                    results: place
                })


                // place represents user's selection from the
                // suggestions and it is a simplified Google Place object.
            })
            .catch(error => console.log(error.message));  // error is a Javascript Error object
    }
    render() {
        const { place, origin } = this.state;
        return (
            <View style={styles.container}>

                <View style={styles.body}>


                    <SearchBar


                        platform="android"
                        value={place}
                        onChangeText={(place) => {
                            this.setState({ place });
                            this.openSearchModal(place)
                        }}

                        placeholder="Choose Your Destination" />


                    {
                        this.state.results ?
                            <FlatList
                                data={this.state.results}
                                renderItem={({ item }) =>
                                    <TouchableOpacity onPress={() => this.onDestination(item)}>
                                        <Text style={styles.item}>{item.fullText}</Text>
                                    </TouchableOpacity>
                                }
                            />
                            : (
                                <Text>Loading....</Text>
                            )
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },

    body: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 10
    },
    button: {
        backgroundColor: '#DDDDDD',
        padding: 10
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
})
