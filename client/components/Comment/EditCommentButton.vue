<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { fetchy } from "@/utils/fetchy";
import * as marked from "marked";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import PostHelp from "@/components/Post/PostHelp.vue";

const { toast } = storeToRefs(useToastStore());
const error = ref("");
const props = defineProps(["comment"]);
const emit = defineEmits(["editComment", "refreshComments"]);

const isCreateCommentClicked = ref(false);
const content = ref(props.comment.content);
const livePreview = ref("");

async function renderMarkdown(text: string) {
  return await marked.parse(text);
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
const previewContainer = ref<HTMLElement | null>(null);

watch(content, async (newValue) => {
  const renderedImages = renderYouTube(renderMP4(renderImages(newValue)));
  livePreview.value = await renderMarkdown(renderedImages);
});

const clickCreateComment = async () => {
  isCreateCommentClicked.value = true;
  content.value = props.comment.content;
  const renderedImages = renderYouTube(renderMP4(renderImages(props.comment.content)));
  livePreview.value = await renderMarkdown(renderedImages);
};

const editComment = async (content: string, image: string, video: string) => {
  if (!content.trim()) {
    error.value = "Do not leave the comment empty.";
    return;
  }
  try {
    await fetchy(`/api/comments/${props.comment._id}`, "PATCH", { body: { update: { content: content, image: image, video: video } } });
  } catch (e) {
    if (toast.value !== null) {
      error.value = toast.value.message;
    }
    return;
  }
  emit("editComment");
  emit("refreshComments");
  emptyForm();
};

const emptyForm = () => {
  content.value = props.comment.content;
  error.value = "";
  isCreateCommentClicked.value = false;
};

const handleCancel = () => {
  content.value = props.comment.content;
  error.value = "";
  isCreateCommentClicked.value = false;
};
</script>

<template>
  <main>
    <button class="button" @click="clickCreateComment">Edit</button>
    <div class="modal-background" v-if="isCreateCommentClicked">
      <div class="modal-content">
        <form @submit.prevent="editComment(content, '', '')">
          <h3>Edit your comment</h3>
          <div class="container">
            <div class="textArea">
              <PostHelp />
              <textarea class="text" v-model="content" placeholder="Write your comment here! You can use markdown syntax and add images and videos."> </textarea>
            </div>
            <div class="previewArea">
              <p class="previewYourPostHere">Preview your comment here</p>
              <div class="preview" ref="previewContainer">
                <div v-html="livePreview"></div>
              </div>
            </div>
          </div>
          <div class="modal-buttons">
            <button class="submit" type="submit">Edit Comment</button>
            <button class="cancel" type="button" @click="handleCancel">Cancel</button>
          </div>
          <div class="error" v-if="error">{{ error }}</div>
          <div class="placeholder" v-else></div>
        </form>
      </div>
    </div>
  </main>
</template>

<style scoped>
.button {
  background-color: transparent;
  color: black;
  border: none;
  box-shadow: none;
}
.button:hover {
  text-decoration: underline;
}
.title {
  width: calc(100% - 5px);
  padding: 8px;
  box-sizing: border-box;
  margin-bottom: 10px;
}
h3 {
  margin-bottom: 0px;
}
.previewYourPostHere {
  text-align: center;
}
.container {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  gap: 5px;
}
.textArea {
  width: calc(50% - 2.5px);
}
.previewArea {
  width: calc(50% - 2.5px);
}
.preview {
  margin-bottom: 5px;
  border: solid black 1px;
  width: 100%;
  height: 500px;
  overflow: auto;
  overflow-y: auto;
  padding: 8px;
  box-sizing: border-box;
  text-align: left;
}
.text {
  margin-bottom: 5px;
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
  height: 500px;
  background-color: #e8f9ffff;
}
@media (max-width: 700px) {
  p.placeholder {
    display: none;
  }
  h3 {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .textArea {
    width: 100%;
  }
  .previewArea {
    width: 100%;
  }
  .text {
    height: 250px;
  }
  .preview {
    height: 250px;
  }
}
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}
form {
  background-color: white;
  padding: 20px;
  color: black;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 900px;
  height: fit-content;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 1000px) {
    width: calc(100vw - 100px);
    max-width: 900px;
    margin-left: 50px;
    margin-right: 50px;
  }
}
.modal-buttons {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.click {
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
.click:hover {
  text-decoration: underline;
}
.submit {
  display: inline-block;
  outline: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  border-radius: 500px;
  transition-property: background-color, border-color, color, box-shadow, filter;
  transition-duration: 0.3s;
  border: 1px solid transparent;
  letter-spacing: 2px;
  min-width: 115px;
  white-space: normal;
  text-align: center;
  padding: 5px 5px 5px;
  color: #fff;
  box-shadow: inset 0 0 0 2px #5190bbff;
  background-color: #5190bbff;
  height: 40px;
}
.submit:hover {
  transform: scale(1.04);
}
.cancel {
  display: inline-block;
  outline: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  border-radius: 500px;
  transition-property: background-color, border-color, color, box-shadow, filter;
  transition-duration: 0.3s;
  border: 1px solid transparent;
  letter-spacing: 2px;
  min-width: 115px;
  white-space: normal;
  text-align: center;
  padding: 5px 5px 5px;
  color: #888888;
  box-shadow: inset 0 0 0 2px #888888;
  background-color: transparent;
  height: 40px;
}
.cancel:hover {
  transform: scale(1.04);
}

.error {
  display: flex;
  justify-content: center;
  height: 18.4px;
}
.placeholder {
  height: 18.4px;
}
</style>
