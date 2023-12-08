<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

import router from "../../router";

const props = defineProps(["post", "classId"]);

const isDeletePostClicked = ref(false);

const clickDeletePost = async () => {
  isDeletePostClicked.value = true;
};

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
    void router.push({ path: `/classes/${props.classId}` });
  } catch {
    return;
  }
};

const handleCancel = () => {
  isDeletePostClicked.value = false;
};
</script>

<template>
  <div>
    <div @click="clickDeletePost">Delete Post</div>
    <div class="modal-background" v-if="isDeletePostClicked">
      <div class="modal-content">
        <form @submit.prevent="deletePost()">
          <p>Are you sure you want to delete this post?</p>
          <div class="modal-buttons">
            <button class="submit" type="submit">Delete</button>
            <button class="cancel" type="button" @click="handleCancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin-bottom: 0px;
}
p {
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
  width: 300px;
  height: 80px;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
