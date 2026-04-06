<script setup>
import { ref } from 'vue'

const correctPin = "2305"
const enteredPin = ref("")
const showError = ref(false)
const errorMessage = ref("")

const inputPin = (digit) => {
  if (enteredPin.value.length < 6) {
    enteredPin.value += digit
    showError.value = false
  }
}

const clearPin = () => {
  enteredPin.value = ""
  showError.value = false
}

const submitPin = () => {
  if (enteredPin.value === correctPin) {
    // Successful login - redirect to dashboard
    navigateTo('/dashboard')
  } else {
    // Failed login - show error
    showError.value = true
    errorMessage.value = "Falscher PIN. Bitte versuchen Sie es erneut."
    enteredPin.value = ""
  }
}

const cancel = () => {
  // Cancel - redirect to locked
  navigateTo('/locked')
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="header">
        <div class="lock-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
          </svg>
        </div>
        <h1>AUTHENTIFIZIERUNG</h1>
        <p class="subtitle">Geben Sie Ihren PIN-Code ein</p>
      </div>
      
      <div class="pin-display">
        <div class="pin-dots">
          <span v-for="i in 4" :key="i" class="dot" :class="{ filled: i <= enteredPin.length }"></span>
        </div>
      </div>
      
      <div v-if="showError" class="error-message">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
        </svg>
        {{ errorMessage }}
      </div>
      
      <div class="pinpad">
        <button class="pin-button" @click="inputPin('1')">
          <span class="number">1</span>
        </button>
        <button class="pin-button" @click="inputPin('2')">
          <span class="number">2</span>
        </button>
        <button class="pin-button" @click="inputPin('3')">
          <span class="number">3</span>
        </button>
        <button class="pin-button" @click="inputPin('4')">
          <span class="number">4</span>
        </button>
        <button class="pin-button" @click="inputPin('5')">
          <span class="number">5</span>
        </button>
        <button class="pin-button" @click="inputPin('6')">
          <span class="number">6</span>
        </button>
        <button class="pin-button" @click="inputPin('7')">
          <span class="number">7</span>
        </button>
        <button class="pin-button" @click="inputPin('8')">
          <span class="number">8</span>
        </button>
        <button class="pin-button" @click="inputPin('9')">
          <span class="number">9</span>
        </button>
        <button class="pin-button function-btn" @click="clearPin()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
          </svg>
        </button>
        <button class="pin-button" @click="inputPin('0')">
          <span class="number">0</span>
        </button>
        <button class="pin-button function-btn" @click="submitPin()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      
      <button class="cancel-btn" @click="cancel()">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </svg>
        <span>ABBRECHEN</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #000000;
  padding: 2rem;
}

.login-box {
  width: 100%;
  max-width: 420px;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.lock-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  color: #ffffff;
  opacity: 0.9;
}

.lock-icon svg {
  width: 100%;
  height: 100%;
}

.header h1 {
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 0.3em;
  margin-bottom: 0.5rem;
  color: #ffffff;
  text-transform: uppercase;
}

.subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  font-weight: 300;
  letter-spacing: 0.05em;
}

.pin-display {
  margin-bottom: 3rem;
  padding: 2rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.pin-dots {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dot.filled {
  background: #ffffff;
  border-color: #ffffff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  margin-bottom: 2rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  color: #ef4444;
  font-size: 0.9rem;
  font-weight: 300;
  letter-spacing: 0.05em;
}

.error-message svg {
  width: 20px;
  height: 20px;
}

.pinpad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.pin-button {
  padding: 1.5rem;
  font-size: 1.8rem;
  font-weight: 300;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  background: transparent;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.pin-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s;
}

.pin-button:hover::before {
  width: 200%;
  height: 200%;
}

.pin-button:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.pin-button:active {
  transform: translateY(0);
  background: rgba(255, 255, 255, 0.1);
}

.pin-button .number {
  position: relative;
  z-index: 1;
}

.pin-button.function-btn {
  background: rgba(255, 255, 255, 0.05);
}

.pin-button.function-btn svg {
  width: 24px;
  height: 24px;
  position: relative;
  z-index: 1;
}

.pin-button.function-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.cancel-btn {
  width: 100%;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.cancel-btn svg {
  width: 20px;
  height: 20px;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.4);
  color: #ffffff;
}

.cancel-btn:active {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 640px) {
  .header h1 {
    font-size: 1.5rem;
  }
  
  .pin-button {
    padding: 1.2rem;
    font-size: 1.5rem;
  }
}
</style>

