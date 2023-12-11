<script setup lang="ts">
import { fetchy } from "../../utils/fetchy";
import router from "../../router";
import * as marked from "marked";
import { formatDate } from "@/utils/formatDate";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import EditPostButton from "./EditPostButton.vue";
import DeletePostButton from "./DeletePostButton.vue";
import { onBeforeMount, ref } from "vue";
const props = defineProps(["postId", "author"]);
const loaded = ref(false);
let post = ref({ _id: "", author: "", title: "", dateUpdated: new Date(), content: "" });
let classId = ref("");
const isBookmarked = ref(false);
const isAdmin = ref(false);
const { currentUsername } = storeToRefs(useUserStore());
const renderText = ref("");
const source = ref("");
async function renderMarkdown(text: string) {
  return await marked.parse(text);
}

async function render(text: string) {
  renderText.value = await renderMarkdown(renderYouTube(renderMP4(renderImages(text))));
}

function renderImages(text: string): string {
  const imageRegex = /\[image\](.*?)\[\/image\]/g; // [image]...[/image]

  return text.replace(imageRegex, (_, imageUrl) => {
    return `<img src="${imageUrl}" width="100%">`;
  });
}

function renderMP4(text: string): string {
  const videoRegex = /\[mp4\](.*?)\[\/mp4\]/g; // [mp4]...[/mp4]

  return text.replace(videoRegex, (_, videoUrl) => {
    return `<video width="100%" controls><source src="${videoUrl}" type="video/mp4" /></video>`;
  });
}

function renderYouTube(text: string): string {
  const youtubeRegex = /\[YouTube\](.*?)\[\/YouTube\]/g; // [YouTube]...[/YouTube]

  return text.replace(youtubeRegex, (_, youtubeUrl) => {
    return `<iframe class="youtube-video" src="${youtubeUrl}"></iframe>`;
  });
}

const checkIfAdmin = async () => {
  try {
    isAdmin.value = await fetchy(`/api/classes/id/${classId.value}/membership/isInstructor`, "GET", {
      query: { classId: classId.value, username: currentUsername.value },
    });
  } catch (_) {
    return;
  }
};

async function getPostById(_id: string) {
  let postResults;
  try {
    postResults = await fetchy(`/api/posts/${_id}`, "GET");
  } catch (_) {
    return;
  }
  post.value = postResults;
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
  let classResult;
  source.value = router.currentRoute.value.query.source?.toString() || "";
  try {
    await getPostById(props.postId);
    classResult = await fetchy(`/api/posts/${props.postId}/class`, "GET");
    classId.value = classResult._id;
    loaded.value = true;
  } catch (_) {
    return;
  }
  await checkIfAdmin();
  await refreshBookmark(props.postId);
  await render(post.value.content);
  loaded.value = true;
});

function goBack() {
  if (source.value === "bookmarks") {
    void router.push({ path: `/classes/${classId.value}/bookmarks` });
  } else {
    void router.push({ path: `/classes/${classId.value}` });
  }
}

const toggleBookmark = async () => {
  try {
    if (isBookmarked.value) {
      await fetchy(`/api/bookmarks/`, "DELETE", {
        query: { post: props.postId },
      });
    } else {
      await fetchy(`/api/bookmarks`, "POST", {
        query: { post: props.postId },
      });
    }
    isBookmarked.value = !isBookmarked.value;
    await refreshBookmark(post.value._id);
  } catch (_) {
    return;
  }
};
const handleEditPost = async () => {
  await getPostById(props.postId);
  await render(post.value.content);
};
</script>
<template>
  <div v-if="loaded" class="post-container">
    <div class="buttons">
      <button class="back-button" @click="goBack()">
        <svg height="19.4px" viewBox="0 0 512 512" width="16px" xmlns="http://www.w3.org/2000/svg">
          <polygon points="352,128.4 319.7,96 160,256 160,256 160,256 319.7,416 352,383.6 224.7,256 " />
        </svg>
        <p>Back</p>
      </button>
      <div class="optionButtons">
        <div v-if="isAdmin">
          <div class="instructorButtons" v-if="post.author == currentUsername">
            <button class="editButton">
              <EditPostButton :post="post" @editPost="handleEditPost" />
            </button>
            <button class="deleteButton">
              <DeletePostButton :post="post" :classId="classId" />
            </button>
          </div>
        </div>
        <button @click="toggleBookmark" class="bookmarkButton">
          <i v-if="!isBookmarked" class="material-symbols-outlined eye">bookmark</i>
          <i v-else class="material-symbols-outlined eye">bookmark_added</i>
        </button>
      </div>
    </div>
    <div class="post">
      <div class="title">
        <h3 class="title">{{ post.title }}</h3>
      </div>
      <p class="footer">By @{{ post.author }} on {{ formatDate(post.dateUpdated) }}</p>
      <p class="content" v-html="renderText"></p>
    </div>
  </div>
</template>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Assistant:wght@300&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400&display=swap");
.post-container {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 10px;
  height: 100%;
  width: 100%;
}
.buttons {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.post {
  border-top: solid black 1px;
  padding-left: 10px;
  padding-right: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-y: scroll;
}
.footer {
  width: 100%;
  text-align: center;
  margin-bottom: 5px;
}
.title {
  width: 100%;
  text-align: center;
  margin-bottom: 2px;
}
.instructorButtons {
  display: flex;
}
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}
.bookmarkButton {
  background: transparent;
  border: none;
  margin-top: 6px;
  margin-right: 10px;
}
.editButton,
.deleteButton {
  background: transparent;
  border: none;
  margin-top: 10px;
  margin-right: 10px;
}
.editButton:hover,
.deleteButton:hover {
  text-decoration: underline;
}

.optionButtons {
  display: flex;
}
@media (max-width: 800px) {
  .container {
    height: 400px;
  }
}
.back-button {
  margin-top: 10px;
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
  font-family: "Assistant", sans-serif;
}
.icon svg {
  fill: black;
  width: 13px;
  margin: 0px;
}
.back-button:hover {
  text-decoration: underline;
}
</style>