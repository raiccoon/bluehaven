<script setup lang="ts">
import { ref } from "vue";

const isButtonClicked = ref(false);

const clickButton = () => {
  isButtonClicked.value = true;
};

const handleCancel = () => {
  isButtonClicked.value = false;
};
</script>

<template>
  <button type="button" class="button" @click="clickButton">Markdown Hints <i class="material-symbols-outlined hint">lightbulb</i></button>

  <div class="modal-background" v-if="isButtonClicked">
    <div class="modal-content">
      <div class="textContent">
        <div class="section">
          <p style="text-align: left;">Here is how to insert an image:</p>
          <p style="text-align: center; font-family: monospace;">[image]image_url[\image]</p>
        </div>
        <div class="section">
          <p style="text-align: left;">Here is how to insert an mp4 video:</p>
          <p style="text-align: center; font-family: monospace;">[mp4]video_url[/mp4]</p>
        </div>
        <div class="section">
          <p style="text-align: left;">Here is how to insert a YouTube video:</p>
          <p style="text-align: center; font-family: monospace;">[YouTube]youtube_url[/YouTube]</p>
        </div>
        <div class="section">
          <p style="text-align: left;">Here is a link to other markdown syntax:</p>
          <p style="text-align: center;"><a href="https://www.markdownguide.org/cheat-sheet/">www.markdownguide.org/cheat-sheet</a></p>
        </div>
      </div>
      <div class="modal-buttons">
        <button class="cancel" @click="handleCancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400&display=swap");
.textContent {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
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

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.button {
  background-color: transparent;
  padding: 0px;
  border: none;
  border-radius: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
}
.button:hover {
  text-decoration: underline;
}

.hint {
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
.cancel {
  display: inline-block;
  outline: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  border-radius: 500px;
  transition-property: background-color,border-color,color,box-shadow,filter;
  transition-duration: .3s;
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
.cancel:hover{
  transform: scale(1.04);
}
</style>
