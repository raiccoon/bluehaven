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
@import url("https://fonts.googleapis.com/css2?family=Assistant:wght@300&display=swap");

.container {
  height: 87vh;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  gap: 10px;
  font-family: "Assistant", sans-serif;
}
h1 {
  text-align: center;
}
.post {
  border: solid rgb(0, 0, 0) 1px;
  height: 100%;
  box-sizing: border-box;
  flex: 1;
  border-radius: 8px;
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

@media (max-width: 800px) {
  .container {
    flex-direction: column;
  }

  .post {
    width: 100%;
    height: 50%;
    flex: 1;
  }

  .comments {
    width: 100%;
    margin-top: 10px;
    height: 50%;
    flex: 1;
  }
}
</style>
