<script setup>
</script>

<template>
  <div class="pokemon-list">
    <template v-if="isReady">
      <button @click="showData()">PRINT DATA</button>
    </template>
    <template v-else>
      <div>LOADING</div>
    </template>
  </div>
</template>

<script>

export default {
  data() {
    return {
      pokemons: [],
      isReady: false
    }
  },

  async mounted() {
    await this.getAllData(2);
    this.isReady = true;
  },

  methods: {
    showData(){
      const json = JSON.stringify(this.pokemons);
      console.log(json);
    },

    async getAllData(generation){
      let pokemonList = []

      await fetch(`https://pokeapi.co/api/v2/generation/${generation}`)
        .then(response => response.json())
        .then(data => {
          pokemonList = data.pokemon_species;
        });

      for(let pokemonIndex in pokemonList){
        let pokemonName = pokemonList[pokemonIndex].name

        let pokemon = {}
        
        let evolutionNames = []
        let evolutionURL = ''
        let responseOK = true

        await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
          .then(response => {
            if(!response.ok){
              responseOK = false
              pokemon = {
                id: -1,
                name: data.name,
                error: 'Not found'
              }
              throw new Error("404 response", {cause: response});
            }

            return response.json()
          })
          .then(data => {
            pokemon = {
              id: data.id,
              generation: generation,
              sprite: data.sprites.front_default,
              name: data.name,
              height: data.height / 10,
              weight: data.weight / 10,
              experience: data.base_experience,
              stats: data.stats.map(stat => {
                return {
                  stat: stat.stat.name,
                  value: stat.base_stat,
                }
              }),
              abilities: data.abilities.map(ability => {
                return {
                  name: ability.ability.name,
                  isHidden: ability.is_hidden,
                }
              }),
              types: data.types.map(type => type.type.name),
              games: data.game_indices.map(game => game.version.name),
            }
          })
          .catch(function(err) {
            console.log(err)
          });
        
        if(responseOK) {
          await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`)
            .then(response => response.json())
            .then(data => {
              pokemon.color = data.color.name
              pokemon.happiness = data.happiness
              pokemon.captureRate = data.capture_rate
              pokemon.legendary = data.is_legendary
              pokemon.genderDifference = data.has_gender_differences
              pokemon.shape = data.shape.name
              pokemon.habitat = data.habitat.name
              pokemon.egg = data.egg_groups.map(egg => egg.name)

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
              if(data.chain.evolves_to) pokemon.evolutions = evolutionNames
            })
        }

        this.pokemons.push(pokemon)
      }
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
</style>
