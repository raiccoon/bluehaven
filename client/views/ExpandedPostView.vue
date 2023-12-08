<script setup lang="ts">
import commentList from "@/components/Comment/commentList.vue";
import ExpandedPost from "@/components/Post/ExpandedPost.vue";
import ExpandedPost2 from "@/components/Post/ExpandedPost2.vue";
</script>

<template>
  <main>
    <section>
      <div class="post">
        <ExpandedPost2 :postId="$route.params.postId" />
      </div>
      <div class="comments">
        <commentList :parentId="$route.params.postId" />
      </div>
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
section {
  display: flex;
  height: 100%;
}

.post,
.comments {
  margin: 10px;
  margin-bottom: 0px;
  flex: 1;
  max-width: 50%;
  border-radius: 8px;
  display: flex;
  justify-content: center;
}
@media (max-width: 800px) {
  section {
    flex-direction: column;
  }
  .post,
  .comments {
    max-width: none;
    width: 90%;
    height: 100%;
    margin: 10px auto;

  }
}
</style>
