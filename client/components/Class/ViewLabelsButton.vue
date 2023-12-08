<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const { toast } = storeToRefs(useToastStore());
let labels = ref<Array<Record<string, string>>>([]);
const error = ref("");
const props = defineProps(["classId"]);

const isButtonClicked = ref(false);

const clickButton = () => {
  isButtonClicked.value = true;
};

const handleCreateLabel = async () => {
  try {
    // TODO api for creating a label
    // will add button when i get my component from label_frontend
  } catch (e) {
    if (toast.value !== null) {
      error.value = toast.value.message;
    }
    return;
  }
};

const getLabels = async () => {
  let labelResponse;
  try {
    // TODO api for getting all the labels
    labelResponse = await fetchy(`/api/classes/id/${props.classId}/labels`, "GET");
    console.log("labelResponse", labelResponse);
  } catch (_) {
    return;
  }
  labels.value = labelResponse;
};

const handleCancel = () => {
  isButtonClicked.value = false;
};
</script>

<template>
  <main>
    <div @click="clickButton">View Labels</div>
    <div class="modal-background" v-if="isButtonClicked">
      <div class="modal-content">
        <div class="label-display" v-for="label in labels" :key="label._id">{{ label.name }}</div>
        <button type="button" class="cancel" @click="handleCancel">Cancel</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
h3 {
  margin-bottom: 0px;
}
p {
  text-align: center;
}
.modal-content {
  background-color: white;
  width: 400px;
  height: 400px;
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
