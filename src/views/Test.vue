<script setup>
import PokemonCard from '../components/PokemonCard.vue'
</script>

<template>
  <div class="pokemon-random" v-if="pokemons.length > 0">
    <img id="guessPoke" :src="randomPoke.sprite" :alt="randomPoke.name">
    <input id="guessText" type="text" />
    <button @click="checkSolution()">GUESS</button>
    <button @click="refreshRandom()">REFRESH</button>
  </div>
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
      pokemons: [],
      randomPoke: []
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
            console.log(this.pokemons)
            this.randomPoke = this.pokemons[Math.floor(Math.random() * pokemonDataPromises.length)]
          });
    });
  },

  methods: {
    checkSolution() {
      let image = document.getElementById('guessPoke')
      let text = document.getElementById('guessText').value
      let name = this.randomPoke.name

      if(text && name.toLowerCase() === text.toLowerCase()){
        image.classList.add('guessed')
      }
      else{ console.log('oooooooooo') }
    },

    refreshRandom(){
      let image = document.getElementById('guessPoke')
      let text = document.getElementById('guessText')

      image.style.filter = 'brightness(0)'
      image.classList.remove('guessed')
      text.value = ''
      this.randomPoke = this.pokemons[Math.floor(Math.random() * this.pokemons.length)]
    }
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

.pokemon-random{
  display: block;
  margin: 0 auto;
  height: 400px;
  width: 300px;
  background-color: #cbf1f6;

  img{
    width: 100%;
    height: auto;
    display: block;
    filter: brightness(0);
    transition: filter 500ms linear;
    
    &.guessed{filter: brightness(1); transition: none;}
  }
}
</style>
