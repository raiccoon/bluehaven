<script setup lang="ts">
import PublishModuleButton from "@/components/Module/PublishModuleButton.vue";
import AddPostButton from "@/components/Post/AddPostButton.vue";
import DeleteModuleButton from "@/components/Module/DeleteModuleButton.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["module", "isAdmin"]);
const emits = defineEmits(["expand", "refreshPosts", "deleteModule"]);
const _module = ref({ _id: "", name: "", description: "", hidden: true });

const isModuleClicked = ref(false);

const clickModule = () => {
  isModuleClicked.value = !isModuleClicked.value;
  emits("expand");
};

const refreshPosts = () => {
  emits("refreshPosts");
};

const deleteModule = () => {
  emits("deleteModule");
};

const refreshModule = async () => {
  try {
    _module.value = await fetchy(`/api/modules/${_module.value._id}`, "GET");
  } catch (_) {
    return;
  }
};

onBeforeMount(() => {
  _module.value = props.module;
});
</script>

<template>
  <main>
    <div class="header">
      <div class="expand">
        <button v-if="isAdmin" class="button">
          <DeleteModuleButton :module="_module" @deleteModule="deleteModule" />
        </button>
        <button v-if="isAdmin" class="button">
          <AddPostButton :module="_module" @refreshPosts="refreshPosts" />
        </button>
        <button v-if="props.isAdmin" class="button">
          <PublishModuleButton :module="_module" @toggleVisibility="refreshModule" />
        </button>
        <button @click="clickModule" class="button">
          <span v-if="!isModuleClicked">
            <i class="material-symbols-outlined">expand_more</i>
          </span>
          <span v-else>
            <i class="material-symbols-outlined">expand_less</i>
          </span>
        </button>
      </div>
      <div class="headerText">
        <h3 class="name">
          {{ _module.name }}
          <i v-if="_module.hidden" class="material-symbols-outlined eye">visibility_off</i>
          <i v-else class="material-symbols-outlined eye">visibility</i>
        </h3>
        <p class="description">{{ _module.description }}</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400&display=swap");
.eye {
  font-size: 16px;
  opacity: 0.5;
}
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}
.name {
  margin: 15px;
  margin-top: 0px;
  margin-bottom: 5px;
  font-size: 22px;
}
.description {
  margin: 15px;
  margin-top: 0px;
  font-size: 18px;
}
.header {
  border-radius: 8px;
  background-color: #a7d6f8ff;
  width: 100%;
  color: black;
  transition: background-color 0.1s ease;
  display: flex;
  flex-direction: column;
}
.expand {
  display: flex;
  justify-content: flex-end;
}

.button {
  margin-top: 5px;
  margin-right: 15px;
  background-color: transparent;
  color: black;
  padding: 0px;
  border: none;
  border-radius: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
}
.button:hover {
  text-decoration: underline;
}
</style>
