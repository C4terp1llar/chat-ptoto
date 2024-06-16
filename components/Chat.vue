<template>
  <v-container>
    <v-list v-if="messages.length" class="pa-3 mb-3">
      <v-list-item v-for="(message, index) in messages" :key="index">
        <v-list-item-content>{{ message }}</v-list-item-content>
      </v-list-item>
    </v-list>
    <v-form v-if="!entered">
      <v-text-field
        v-model="userName"
        label="Введите ваше имя, чтобы продолжить"
        autocomplete="off"
        outlined
      >
      </v-text-field>
      <v-btn @click="confirmName" color="primary">Войти</v-btn>
    </v-form>
    <v-form @submit.prevent="sendMessage" v-if="entered">
      <v-text-field
        v-model="message"
        label="Введите ваше сообщение"
        autocomplete="off"
        outlined
      ></v-text-field>
      <v-btn @click="sendMessage" color="primary">Отправить</v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSocket } from '@/composables/useSocket';

const message = ref<String>('');
const userName = ref<String>('');

const messages = ref<String[]>([]);
const socket = useSocket();

const entered = ref<Boolean>(false);

const sendMessage = () => {
  if (message.value.trim() !== '') {
    socket.emit('chat message', `${userName.value}: ${message.value}`);
    message.value = '';
  }
};

const confirmName = () =>{
  if (userName.value.trim() !== '') {
    entered.value = true
  }
}

onMounted(() => {
  socket.on('chat message', (msg) => {
    messages.value.push(msg);
  });
});
</script>

<style scoped>

</style>
