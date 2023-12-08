<script setup lang="ts">
import { ref } from "vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
const { logoutUser } = useUserStore();

const showModal = ref(false);

async function logout() {
  showModal.value = true;
}

function cancelLogout() {
  showModal.value = false;
}

async function confirmLogout() {
  await logoutUser();
  void router.push({ name: "Start" });
}
</script>

<template>
  <div>
    <button class="logout" @click="logout">Log Out</button>
    <div v-if="showModal" class="modal-background">
      <div class="modal-content">
        <p>Are you sure you want to log out?</p>
        <div class="modal-buttons">
          <button class="submit" @click="confirmLogout">Log Out</button>
          <button class="cancel" @click="cancelLogout">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/popupButton.css";
p {
  font-size: 16px;
  text-align: center;
}
.modal-content {
  width: 300px;
  height: 80px;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.logout {
  font-size: large;
  color: black;
  text-decoration: none;
  transition: text-decoration 0.3s ease;
  background: transparent;
  border: none;
  border-radius: none;
}

.logout:hover {
  text-decoration: underline;
}
</style>
