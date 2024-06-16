<template>
  <v-container>
    <v-list class="mb-3 list">
      <v-list-item v-if="!messages.length">
        Сообщений пока нет
      </v-list-item>
      <v-list-item
        v-for="(message, index) in messages"
        :key="index"
        :class="isMyMessage(message) ? 'my-message' : 'other-message'"
        class="message-item ma-3"
      >
        <v-list-item-content>
          <h2>{{ isMyMessage(message) ? 'Вы:' : `${message.user}:` }}</h2>
          {{ message.text }}
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-form v-if="!entered" @submit.prevent="confirmName" class="d-flex">
      <v-text-field
        v-model="userName"
        label="Введите ваше имя, чтобы продолжить"
        autocomplete="off"
        outlined
      ></v-text-field>
      <v-btn @click="confirmName" x-large color="primary">Войти</v-btn>
    </v-form>
    <v-form @submit.prevent="sendMessage" v-if="entered" class="d-flex">
      <v-text-field
        v-model="message"
        label="Введите ваше сообщение"
        autocomplete="off"
        outlined
      ></v-text-field>
      <v-btn @click="sendMessage" x-large color="primary">Отправить</v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSocket } from '@/composables/useSocket';

const message = ref<string>('');
const userName = ref<string>('');

const messages = ref<Array<{ user: string, text: string }>>([]);
const socket = useSocket();

const entered = ref<boolean>(false);

const sendMessage = () => {
  if (message.value.trim() !== '') {
    const msg = { user: userName.value, text: message.value };
    socket.emit('chat message', msg);
    message.value = '';
  }
};

const confirmName = () => {
  if (userName.value.trim() !== '') {
    entered.value = true;
  }
};

const isMyMessage = (msg: any) => {
  return msg.user === userName.value;
};

onMounted(() => {
  socket.on('chat message', (msg) => {
    messages.value.push(msg);
  });
});
</script>

<style scoped>
form {
  gap: 15px;
}

.list {
  height: 500px;
  overflow-y: scroll;
}

.my-message {
  background-color: #1976d2;
  color: white;
  margin-right: auto;
}

.other-message {
  background-color: #e0e0e0;
  color: black !important;
  margin-left: auto;
}

.list::-webkit-scrollbar {
  width: 8px;
}
.list::-webkit-scrollbar-track {
  background: black;
}
.list::-webkit-scrollbar-thumb {
  background-color: #888;
}
</style>
