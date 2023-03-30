<script setup>
import PokemonCard from '../components/PokemonCard.vue'
</script>

<template>
    <h1>GUESS THE POKEMON</h1>
    <div class="pokemon-random">
        <template v-if="lifes > 0">
            <div class="label">Streak: {{ streak }}</div>
            <div class="label">Lifes: {{ lifes }}</div>
            <br>
            <div class="label">Tries: {{ tries }}</div>
            <img id="guessPoke" :src="randomPoke.sprite" :alt="randomPoke.name">
            <input id="guessText" type="text" />
            <button @click="checkSolution()">GUESS</button>
            <button @click="refreshRandom()">REFRESH</button>
        </template>
        <template v-else>
            <div class="label">Has perdido tus vidas</div>
            <div class="label">Tu racha ha sido de {{ streak }}</div>
            <button @click="retryGame()">RETRY</button>
        </template>
    </div>
    
</template>

<script>

export default {
  data() {
    return {
      randomPoke: [],
      pokemonList: [],
      guessed: [],
      streak: 0,
      lifes: 3,
      tries: 5
    }
  },

  async mounted() {
    this.pokemonList = await this.getPokemonList();

    this.pickAnother()
  },

  methods: {
    retryGame(){
        this.streak = 0
        this.lifes = 3
        this.tries = 5
        this.guessed = []

        this.pickAnother()
    },

    checkSolution() {
      let image = document.getElementById('guessPoke')
      let text = document.getElementById('guessText').value
      let name = this.randomPoke.name

      if(text && name.toLowerCase() === text.toLowerCase()){
        image.classList.add('guessed')
        this.guessed.push(name)
        this.streak ++
        this.tries = 5

        setTimeout(() => {
            this.refreshRandom()
        }, "1000");
      }
      else{ 
        this.tries --

        if(this.tries < 1){
            this.lifes --
            this.tries = 5
            this.pickAnother()
        }
    }
    },

    refreshRandom(){
      let image = document.getElementById('guessPoke')
      let text = document.getElementById('guessText')

      image.classList.remove('guessed')
      text.value = ''
      
      this.pickAnother()
    },

    async getPokemonList(){
        return fetch('https://pokeapi.co/api/v2/generation/1/')
            .then(response => response.json())
            .then(data => {
                return data.pokemon_species.map((poke) => poke.name );
            });
    },

    async pickAnother(){
        const pokemons = this.pokemonList.filter((pokemon) => !this.guessed.includes(pokemon))
        const selected = pokemons[Math.floor(Math.random() * pokemons.length)]
        //const selected = 'vaporeon'

        let evolutionNames = [];
        let evolutionURL = ''

        await fetch(`https://pokeapi.co/api/v2/pokemon/${selected}`)
            .then(response => response.json())
            .then(data => 
                this.randomPoke = {
                    id: data.id,
                    sprite: data.sprites.front_default,
                    name: data.name,
                    height: data.height,
                    weight: data.weight,
                    stats: data.stats.map(stat => {
                        return {
                            stat: stat.stat.name,
                            value: stat.base_stat,
                        }
                    }),
                    types: data.types.map(type => type.type.name),
                    moveList: data.moves.map(move => move.move.name),
                    evolutions: []
                }
            )
        
        await fetch(`https://pokeapi.co/api/v2/pokemon-species/${selected}`)
            .then(response => response.json())
            .then(data => {
                this.randomPoke.color = data.color.name
                evolutionURL = data.evolution_chain.url
            })
        
        await fetch(evolutionURL)
            .then(response => response.json())
            .then(data => {
                let evolutionList = data.chain;

                let firstEvolution = evolutionList.species.name
                if(!evolutionNames.includes(firstEvolution)) evolutionNames.push(firstEvolution);
            
                while (evolutionList.evolves_to.length !== 0) {
                    let variants = evolutionList.evolves_to.length
                    let evolution = ''
                    
                    //Check and add variants of the evolution
                    if(variants > 1){
                        let variantList = evolutionList.evolves_to
                        let variantNames = []

                        for(let variantIndex in variantList){
                            evolution = variantList[variantIndex].species.name
                            if(!evolutionNames.includes(evolution) && !variantNames.includes(evolution)) variantNames.push(evolution)
                        }

                        evolutionNames.push(variantNames); 
                    }
                    //Add evolution
                    else { 
                        evolution = evolutionList.evolves_to[0].species.name
                        if(!evolutionNames.includes(evolution)) evolutionNames.push(evolution); 
                    }

                    evolutionList = evolutionList.evolves_to[0];
                }
                

                // Imprimir la lista de nombres de evoluciones
                console.log(selected)
                console.log(evolutionNames)
                if(data.chain.evolves_to) this.randomPoke.evolutions.push(evolutionNames)
            })
    }
  }
}
</script>


<style lang="scss" scoped>
h1{ text-align: center; }
.pokemon-random{
  display: block;
  margin: 0 auto;
  width: 300px;
  background-color: #cbf1f6;

  .label{
    color: black;
    padding-left: 15px;
  }

  img{
    width: 100%;
    height: auto;
    display: block;
    filter: brightness(0);
    transition: none;
    
    &.guessed{filter: brightness(1); transition: filter 500ms linear;}
  }
}
</style>
