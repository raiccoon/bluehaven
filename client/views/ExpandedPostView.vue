<script setup lang="ts">
import commentList from "@/components/Comment/commentList.vue";
import ExpandedPost2 from "@/components/Post/ExpandedPost2.vue";
</script>

<template>
  <main class="container">
    <div class="post">
      <ExpandedPost2 :postId="$route.params.postId" />
    </div>
    <div class="comments">
      <commentList :parentId="$route.params.postId" />
    </div>
  </main>
</template>

<style scoped>
.container {
  border: solid black 1px;
  height: 87vh;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  gap: 10px;
}
h1 {
  text-align: center;
}

.post {
  border: solid black 1px;
  height: 100%;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  justify-content: center;
}
.comments {
  border: solid black 1px;
  background-color: #eff0f6ff;
  width: fit-content;
  height: 100%;
  box-sizing: border-box;
  border-radius: 8px;
  display: flex;
  justify-content: center;
}
</style>
