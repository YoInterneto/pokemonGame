<script setup>
import data from '../assets/data/generation1.json';
</script>

<template>
    <h1>GUESS THE POKEMON</h1>
    <div class="guess-pokemon">
        <template v-if="lifes > 0">
            <div class="label">Lifes: {{ lifes }}</div>
            <input id="guessText" type="text"/>
            <button @click="checkSolution()">GUESS</button>
            <div v-if="selectValues?.length > 0" class="pokemon-select">
                <div v-for="(value, index) in selectValues" class="option" :key="index" @click="selectOption(value.name)">
                    {{ value.name }}
                </div>
            </div>
            <table>
                <tr>
                    <th>Pokemon</th>
                    <th>Generación</th>
                    <th>Tipo</th>
                    <th>Altura</th>
                    <th>Peso</th>
                    <th>Color</th>
                    <th>Evolutions</th>
                </tr>
                <tr v-for="(row, index) in results">
                    <td>
                        <img :src="row.info.sprite" alt="row.info.name" />
                        <span>{{ row.info.name }}</span>
                    </td>
                    <td :class="row.generation.class">{{ row.generation.value }}</td>
                    <td :class="row.type.class">{{ row.type.value }}</td>
                    <td :class="row.height.class">{{ row.height.value }} m</td>
                    <td :class="row.weight.class">{{ row.weight.value }} kg</td>
                    <td :class="row.color.class">{{ row.color.value }}</td>
                    <td :class="row.evolutions.class">{{ row.evolutions.value }}</td>
                </tr>
            </table>
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
        selectValues: [],
        guessed: [],
        results: [],
        pokemon: {},
        lifes: 10,
    }
  },

  async mounted() {
    document.getElementById('guessText').addEventListener('input', (event) => {
        this.autoComplete(event)
    })

    this.pickAnother()
  },

  methods: {
    selectOption(value){
        document.getElementById('guessText').value = value
        this.selectValues = []
    },

    autoComplete(event){        
        if(event.target.value === '') this.selectValues = [] 
        else this.selectValues = data.filter(value => value.name.includes(event.target.value))
    },

    retryGame(){
        this.lifes = 10
        this.guessed = []

        this.pickAnother()
    },

    checkSolution() {
        let text = document.getElementById('guessText').value

        if(text !== ''){
            let actualPokemon = data.find(pokemon => pokemon.name === text)

            if(Object.keys(actualPokemon).length > 0){
                this.results.push({
                    info: {
                        name: actualPokemon.name,
                        sprite: actualPokemon.sprite,
                    },
                    generation: {
                        value: this.checkValuePostion(actualPokemon.generation, this.pokemon.generation) + actualPokemon.generation,
                        class: actualPokemon.generation === this.pokemon.generation ? 'correct' : 'wrong'
                    },
                    type: {
                        value: actualPokemon.types,
                        class: this.checkTypes(actualPokemon.types, this.pokemon.types)
                    },
                    height: {
                        value: this.checkValuePostion(actualPokemon.height, this.pokemon.height) + actualPokemon.height,
                        class: actualPokemon.height === this.pokemon.height ? 'correct' : 'wrong'
                    },
                    weight: {
                        value: this.checkValuePostion(actualPokemon.weight, this.pokemon.weight) + actualPokemon.weight,
                        class: actualPokemon.weight === this.pokemon.weight ? 'correct' : 'wrong'
                    },
                    color: {
                        value: actualPokemon.color,
                        class: actualPokemon.color === this.pokemon.color ? 'correct' : 'wrong'
                    },
                    evolutions: {
                        value: actualPokemon.evolutions.length,
                        class: actualPokemon.evolutions.length === this.pokemon.evolutions.length ? 'correct' : 'wrong'
                    }
                })
            }
        }
    },

    checkValuePostion(valueX, valueY){
        let result = ''

        if(valueX > valueY) result = '↓ '
        else if(valueX < valueY) result = '↑ '
 
        return result
    },

    checkTypes(pokeX, pokeY){
        let result = ''

        if(JSON.stringify(pokeX) == JSON.stringify(pokeY)) result = 'correct'
        else if(pokeX.some(type => pokeY.indexOf(type) >= 0)) result = 'almost'
        else result = 'wrong'

        return result
    },

    refreshRandom(){
      let text = document.getElementById('guessText')

      text.value = ''
      
      this.pickAnother()
    },

    pickAnother(){
        let randomIndex = Math.floor(Math.random() * data.length)

        this.pokemon = data[randomIndex]
    }
  }
}
</script>


<style lang="scss" scoped>
h1{ text-align: center; }
.guess-pokemon{
  display: block;
  margin: 0 auto;
  width: 600px;

  .pokemon-select{
    background-color: white;
    max-height: 300px;
    overflow-y: scroll;

    .option{
        cursor: pointer;
        color: black;
        border: 1px solid grey;
        padding: 5px 15px;
        transition: all .3s linear;

        &:hover{ background-color: #aca4a4; }
    }
  }

  table{
    td{
        text-align: center;

        img{
            display: block;
            margin: 0 auto;
        }

        &.wrong{ background-color: #c52d2d; }
        &.correct{ background-color: #06770f; }
        &.almost{ background-color: #c4990e; }
    }
  }
}
</style>
