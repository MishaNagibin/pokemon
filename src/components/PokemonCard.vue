<script setup>
const props = defineProps({
  item: {
    type: Object,
  },
});
</script>

<template>
  <router-link
    :to="{ name: 'pokemon', params: { pokemonName: item.name } }"
    class="c-pokemon-card"
  >
    <img src="/src/assets/pikachu.jpg" />
    <h1>{{ item.name }}</h1>
  </router-link>
</template>

<style scoped>
.c-pokemon-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 15px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  color: black;
  text-decoration: none;
  overflow: hidden;
  padding-bottom: 20px;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2), 0 0 15px rgba(255, 105, 180, 0.5);
    transform: translateY(-5px);
  }

  > img {
    width: 250px;
  }

  > h1 {
    text-align: center;
    margin: 0;
  }
}
</style>
