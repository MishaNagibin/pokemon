<script setup>
import { onBeforeMount, reactive } from "vue";
import pokemon from "@/api/pokemon";
import PokemonCard from "@/components/PokemonCard.vue";
import Spinner from "@/components/Spinner.vue";

const data = reactive({
  pokemons: [],
  offset: 0,
  limit: 20,
  totalCount: 0,
  isLoading: false,
});

let debounceTimer = null;

const methods = {
  getPokemons() {
    data.isLoading = true;
    pokemon
      .getList(20, 0)
      .then((p) => {
        data.totalCount = p.count;
        data.pokemons = p.results;
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        methods.stopSpinner();
      });
  },
  loadingPokemons() {
    // подружаем покемонов пока не достигнем totalCount
    // используем limit и offset,
    // хотя можем юзать поле next из апи, который дает некст ссылку с учетом лимита и оффсета
    if (data.offset + data.limit < data.totalCount) {
      data.isLoading = true;
      data.offset += data.limit;
      pokemon
        .getList(data.limit, data.offset)
        .then((p) => {
          data.pokemons = [...data.pokemons, ...p.results];
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          methods.stopSpinner();
        });
    }
  },
  handleScroll() {
    // вешаем debounceTimer чтобы метод не срабатывал каждую МС
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const documentHeight = document.documentElement.scrollHeight;
      const currentScroll = window.scrollY + window.innerHeight;
      // проверяем достигли ли низ страницы, чтобы запросить новую партию покемонов
      // учитываем погрешность поэтому к currentScroll + 1 делаем
      if (currentScroll + 1 >= documentHeight && !data.isLoading) {
        methods.loadingPokemons();
      }
    }, 300);
  },
  stopSpinner() {
    // если ответ от апи очень быстрый, то наш спиннер будет мелькать и рябить в глазах каждый раз
    // поэтому даем ему полсекунды покрутиться :)
    setTimeout(() => {
      data.isLoading = false;
    }, 500);
  },
};

onBeforeMount(() => {
  window.addEventListener("scroll", methods.handleScroll);
  if (data.totalCount === 0) {
    methods.getPokemons();
  }
});
</script>

<template>
  <main>
    <Spinner v-if="data.isLoading" />
    <div class="pokemon-list">
      <PokemonCard v-for="(p, i) of data.pokemons" :key="i" :item="p" />
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 20px;
  box-sizing: border-box;

  > .pokemon-list {
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
  }
}
</style>
