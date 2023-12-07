<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { ObjectId } from "mongodb";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import router from "../../router";
import { fetchy } from "../../utils/fetchy";
import ToggleBookmarkButton from "../Bookmark/ToggleBookmarkButton.vue";
import EditPostButton from "./EditPostButton.vue";

const hasImage = ref(false);
const hasVideo = ref(false);

const isBookmarked = ref(false);

const props = defineProps(["postId", "author"]);
const loaded = ref(false);

let post = ref();
const { currentUsername } = storeToRefs(useUserStore());

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${post.value._id}`, "DELETE");
    void router.push({ path: `/home` });
  } catch {
    return;
  }
};

async function getPostById(_id: ObjectId) {
  let postResults;
  try {
    postResults = await fetchy(`/api/posts/${_id}`, "GET");
  } catch (_) {
    return;
  }
  post.value = postResults;

  try {
    if (post.value.image !== "") {
      hasImage.value = true;
    }
    if (post.value.video !== "") {
      hasVideo.value = true;
    }
  } catch (_) {
    return;
  }
}

async function isPostBookmarked(postId: string) {
  let bookmarkResults;
  try {
    bookmarkResults = await fetchy(`/api/bookmarks`, "GET", {
      query: { post: postId },
    });
  } catch (_) {
    return;
  }
  isBookmarked.value = bookmarkResults;
}

async function refreshBookmark(postId: string) {
  await isPostBookmarked(postId);
}

onBeforeMount(async () => {
  try {
    await getPostById(props.postId);
    loaded.value = true;
  } catch (_) {
    return;
  }
});
</script>

<template>
  <section class="article" v-if="loaded">
    <ToggleBookmarkButton @updatedBookmarkState="refreshBookmark(post._id)" :postId="post._id" :isBookmarked="isBookmarked" />
    <p class="author">{{ post.author }}</p>

    <img v-if="hasImage" class="postMedia image" :src="post.image" />
    <!-- <img v-if="hasVideo" class="postMedia video" :src="props.post.video" /> -->
    <video v-if="hasVideo" class="postMedia video" controls>
      <source v-if="hasVideo" :src="post.video" type="video/mp4" />
    </video>
    <!-- placeholder media -->
    <!-- <img class="postMedia" src="https://i.imgur.com/CWuBXGh.jpg" /> -->

    <p class="text single-line">{{ post.content }}</p>
    <div class="base">
      <menu>
        <!-- will implement editing within expanded view later? -->
        <li><EditPostButton :post="post" @editPost="getPostById(post._id)" /></li>
        <li><button v-if="post.author == currentUsername" class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
      </menu>
      <article class="timestamp">
        <p v-if="post.dateCreated !== post.dateUpdated">Edited on: {{ formatDate(post.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(post.dateCreated) }}</p>
      </article>
    </div>
  </section>
  <h2 v-else>Loading...</h2>
</template>

<style scoped>
h2 {
  text-align: center;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}
.article {
  margin: 1em;
  width: 70vh;
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  overflow-y: auto;
  max-height: 70vh;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}

.postMedia {
  max-width: 500px;
  height: auto;
  align-self: center;
  text-align: center;
}
.text.single-line {
  white-space: nowrap;
  text-wrap: balance;
}
</style>
