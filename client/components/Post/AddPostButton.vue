<script setup lang="ts">
import { ref, watch } from "vue";
import { fetchy } from "@/utils/fetchy";
import { useToastStore } from "@/stores/toast";
import { storeToRefs } from "pinia";
import katex from "katex";
import * as marked from "marked";
const { toast } = storeToRefs(useToastStore());
const error = ref("");
const props = defineProps(["module"]);
const emit = defineEmits(["refreshPosts"]);

const isAddPostClicked = ref(false);
const content = ref("");
const image = ref("");
const video = ref("");
const livePreview = ref("");

watch(content, async (newValue) => {
  livePreview.value = await renderMarkdown(newValue);
});

async function renderMarkdown(text: string) {
  return await marked.parse(text);
}

const clickAddPost = () => {
  isAddPostClicked.value = true;
};

const createPost = async (module: string, content: string, image: string, video: string) => {
  if (!content.trim()) {
    error.value = "Do not leave the post content empty.";
    return;
  }
  try {
    await fetchy("/api/posts", "POST", {
      body: { module, content, image, video },
    });
    emptyForm();
    emit("refreshPosts");
  } catch (e) {
    if (toast.value !== null) {
      error.value = toast.value.message;
    }
    return;
  }
};

const emptyForm = () => {
  content.value = "";
  image.value = "";
  video.value = "";
  error.value = "";
  isAddPostClicked.value = false;
};

const handleCancel = () => {
  content.value = "";
  image.value = "";
  video.value = "";
  error.value = "";
  isAddPostClicked.value = false;
};
</script>

<template>
  <main>
    <button class="click" @click="clickAddPost">Add Post</button>
    <div class="modal-background" v-if="isAddPostClicked">
      <div class="modal-content">
        <form @submit.prevent="createPost(props.module._id, content, image, video)">
          <h3>Create a new post</h3>
          <div class="container">
            <div class="textInputs">
              <textarea class="content" v-model="content" placeholder="Write your post here."> </textarea>
              <textarea class="media-link" v-model="image" placeholder="Paste a link to image media (optional)"> </textarea>
              <textarea class="media-link" v-model="video" placeholder="Paste a link to video media (optional)"> </textarea>
            </div>
            <div class="preview" v-html="livePreview"></div>
          </div>
          <div class="modal-buttons">
            <button class="submit" type="submit">Create Post</button>
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
.container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  border: solid black 1px;
}
.textInputs {
  border: solid black 1px;
  width: 50%;
}
.preview {
  border: solid black 1px;
  width: 50%;
}
@media (max-width: 700px) {
  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: solid black 1px;
  }
  .textInputs {
    border: solid black 1px;
    width: 100%;
  }
  .preview {
    border: solid black 1px;
    width: 100%;
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
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 900px;
  height: 650px;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 1000px) {
    width: calc(100vw - 100px);
    max-width: 900px;
    margin-left: 50px;
    margin-right: 50px;
  }
}
textarea {
  display: block;
  margin-bottom: 10px;
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
}
.media-link {
  height: 40px;
}
.content {
  height: 400px;
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
