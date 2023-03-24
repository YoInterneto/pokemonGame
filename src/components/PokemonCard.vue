
<template>
    <div class="pokemon-card">
        <div class="card-img">
            <img :src="sprite" :alt="name">
        </div>
        <div class="card-info">
            <div class="card-name">{{ name.split('-')[0] }}</div>
            <div class="card-type">
                <span
                    v-for="(type) in types"
                >
                    {{ type }} &nbsp;
                </span>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    props: {
        name: String,
        sprite: String,
        types: Array,
    },
}
</script>

<style lang="scss" scoped>
.pokemon-card{
    background-color: #373737;
    border-radius: 10px 10px 0px 0px;
    box-sizing: border-box;
    margin: 10px;
    width: calc(33% - 20px);

    .card-img{
        background-color: #d7d7d7;
        img{ 
            background-color: #cbf1f6;
            border-radius: 999px;
            display: block;
            margin: 0 auto;
        }
    }

    .card-info{
        font-weight: bold;
        text-align: center;
        padding: 12px 0px;
        .card-name{ }
        .card-type{ }
    }
}
</style>
