<script setup>
import PokemonCard from '../components/PokemonCard.vue'
</script>

<template>
  <div class="pokemon-list" v-if="pokemons.length > 0">
    <PokemonCard 
      v-for="(pokemon, index) in pokemons"
      :name="pokemon.name" 
      :sprite="pokemon.sprite"
      :types="pokemon.types"
    />
  </div>
</template>

<script>

export default {
  data() {
    return {
      pokemons: []
    }
  },

  mounted() {

    fetch('https://pokeapi.co/api/v2/generation/1/')
      .then(response => response.json())
      .then(data => {
        const pokemonList = data.pokemon_species;

        const pokemonDataPromises = pokemonList.map(pokemon => {
          return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
            .then(response => response.json())
        });

        Promise.all(pokemonDataPromises)
          .then(pokemonDataList => {
            this.pokemons = pokemonDataList.map(pokemonData => {
              return {
                id: pokemonData.id,
                sprite: pokemonData.sprites.front_default,
                name: pokemonData.name,
                height: pokemonData.height,
                weight: pokemonData.weight,
                stats: pokemonData.stats.map(stat => {
                  return {
                    stat: stat.stat.name,
                    value: stat.base_stat,
                  }
                }),
                types: pokemonData.types.map(type => type.type.name),
                moveList: pokemonData.moves.map(move => move.move.name),
              };
            });
            
            this.randomPoke = this.pokemons[Math.floor(Math.random() * pokemonDataPromises.length)]
          });
    });
  },

  methods: {
    
  }
}
</script>


<style lang="scss" scoped>
.pokemon-list{
  width: 100%;
  max-width: 992px;
  margin: 0 auto;
  padding: 30px 60px;
  display: flex;
  flex-wrap: wrap;
}
</style>
