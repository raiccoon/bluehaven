<script setup lang="ts">
import createModule from "@/components/Module/boilerplate/createModule.vue";
import deleteModule from "@/components/Module/boilerplate/deleteModule.vue";
import getClassOfModule from "@/components/Module/boilerplate/getClassOfModule.vue";
import getClassOfPost from "@/components/Module/boilerplate/getClassOfPost.vue";
import getModule from "@/components/Module/boilerplate/getModule.vue";
import getModuleOfPost from "@/components/Module/boilerplate/getModuleOfPost.vue";
import getPostsInModule from "@/components/Module/boilerplate/getPostsInModule.vue";
import isPostInClass from "@/components/Module/boilerplate/isPostInClass.vue";
import isPostInModule from "@/components/Module/boilerplate/isPostInModule.vue";
import relocatePost from "@/components/Module/boilerplate/relocatePost.vue";
import tempAddPost from "@/components/Module/boilerplate/tempAddPost.vue";
</script>

<template>
  <main>
    <h1>Module</h1>
    <div class="column">
      <createModule />
      <getModule />
      <tempAddPost />
      <getPostsInModule />
      <getClassOfModule />
      <getModuleOfPost />
      <getClassOfPost />
      <isPostInModule />
      <isPostInClass />
      <relocatePost />
      <deleteModule />
    </div>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
