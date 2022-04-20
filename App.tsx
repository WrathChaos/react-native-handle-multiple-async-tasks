import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  LogBox,
} from "react-native";
import SplashScreen from "react-native-splash-screen";
import axios from "axios";
import { Pokemon, PokeResult } from "@services/models";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { capitalizeFirstLetter } from "utils";
import fonts from "@fonts";
LogBox.ignoreAllLogs();

export default function App() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  useEffect(() => {
    SplashScreen.hide();
    // wrongWaytoHandleMultipleRequests();
    correctWaytoHandleMultipleRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ? Just an example of a wrong way to handle multiple async tasks
  // const wrongWaytoHandleMultipleRequests = async () => {
  //   const response = await axios.get(
  //     "https://pokeapi.co/api/v2/pokemon?limit=10",
  //   );
  //   console.log(response.data.results);
  //   const pokemons = response.data.results as PokeResult[];
  //   const pokeArray: Pokemon[] = [];
  //   pokemons.forEach((poke: PokeResult) => {
  //     axios.get(poke.url).then((res) => {
  //       pokeArray.push(res.data);
  //     });
  //   });
  //   setPokemonList(pokeArray.sort());
  //   console.log("All Pokemon Data Length: ", pokeArray);
  // };

  const correctWaytoHandleMultipleRequests = async () => {
    const response = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=100",
    );
    console.log(response.data.results);
    const pokemons = response.data.results;
    const pokeArray: Pokemon[] = [];
    await fetchAllPokemonData(pokemons, pokeArray);
    setPokemonList(pokeArray.sort((a, b) => a.id - b.id));
    console.log("All Pokemon Data Length: ", pokeArray.length);
  };

  const fetchAllPokemonData = (pokemons: PokeResult[], array: Pokemon[]) => {
    return Promise.all(
      pokemons.map(async (poke: PokeResult) => {
        const res = await axios.get(poke.url);
        array.push(res.data);
      }),
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */

  const renderPokemon = (pokeData: Pokemon) => {
    const { name, sprites } = pokeData;
    return (
      <View style={styles.pokemonContainer}>
        <Image
          resizeMode="contain"
          source={{ uri: sprites.other?.["official-artwork"].front_default }}
          style={styles.imageStyle}
        />
        <Text style={styles.textStyle}>{capitalizeFirstLetter(name)}</Text>
      </View>
    );
  };

  const renderContent = () => {
    if (pokemonList.length) {
      return (
        <FlatList
          data={pokemonList}
          numColumns={3}
          renderItem={({ item }) => renderPokemon(item)}
        />
      );
    }
    return <ActivityIndicator animating size="large" />;
  };

  return (
    <SafeAreaView style={styles.container}>{renderContent()}</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  pokemonContainer: {
    margin: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  imageStyle: {
    width: 100,
    height: 100,
  },
  textStyle: {
    marginTop: 8,
    fontSize: 16,
    color: "#333",
    fontFamily: fonts.montserrat.medium,
  },
});
