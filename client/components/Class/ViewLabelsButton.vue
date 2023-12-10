<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import CreateLabelForm from "../Label/CreateLabelForm.vue";

const { toast } = storeToRefs(useToastStore());
const error = ref("");
const loaded = ref(false);
const props = defineProps(["classId"]);

let labels = ref<Array<Record<string, string>>>([]);
const isButtonClicked = ref(false);

const clickButton = () => {
  isButtonClicked.value = true;
};

const getLabels = async () => {
  let labelResults;
  try {
    // TODO api for getting all the labels
    labelResults = await fetchy(`/api/classes/id/${props.classId}/labels`, "GET");
  } catch (_) {
    return;
  }
  labels.value = labelResults;
};

const handleCancel = () => {
  isButtonClicked.value = false;
};

onBeforeMount(async () => {
  await getLabels();
  loaded.value = true;
});
</script>

<template>
  <div>
    <div @click="clickButton">View Labels</div>
    <div class="modal-background" v-if="isButtonClicked">
      <div class="modal-content">
        <div>
          <div class="cancelButton">
            <button type="button" class="cancel close-btn" @click="handleCancel">
              <i class="material-symbols-outlined">close</i>
            </button>
          </div>

          <h3>Class Labels</h3>
          <div class="label-list">
            <div class="label-item" v-for="label in labels" :key="label._id">{{ label.name }}</div>
          </div>
        </div>
        <div class="createButton">
          <CreateLabelForm :classId="props.classId" @refreshLabels="getLabels" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400&display=swap");
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}
.createButton {
  margin-bottom: 10px;
}
.cancelButton {
  width: 100%;
  display: flex;
  flex-direction: flex-end;
}
.cancel {
  background: transparent;
  border: none;
  margin-top: 10px;
  margin-left: 10px;
}
h3 {
  margin-bottom: 0px;
}
p {
  text-align: center;
}
.modal-content {
  background-color: white;
  width: 400px;
  height: 460px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  width: 300px;
  height: 150px;
  margin-left: auto;
  margin-right: auto;
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

.error {
  display: flex;
  justify-content: center;
  height: 18.4px;
}
.placeholder {
  height: 18.4px;
}

.label-item {
  margin: 1em;
  font-size: 14px;
  border-radius: 500px;
  border: 1px solid transparent;
  letter-spacing: 2px;
  white-space: normal;
  text-align: center;
  padding: 5px 5px 5px;
  color: #fff;
  box-shadow: inset 0 0 0 2px #5190bbff;
  background-color: #5190bbff;
}

.label-list {
  max-height: 70%;
  overflow-y: auto;
}
</style>
