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
    <div class="login">
      <h1>Pin eingeben</h1>
    </div>
    <div class="subtitle">
      <p>Geben Sie Ihren Pin ein, um fortzufahren.</p>
    </div>
    
    <div class="pin-display">
      <div class="pin-dots">
        <span v-for="i in 4" :key="i" class="dot" :class="{ filled: i <= enteredPin.length }"></span>
      </div>
    </div>
    
    <div v-if="showError" class="error-message">
      {{ errorMessage }}
    </div>
    
    <div class="pinpad">
      <button class="pin-button" @click="inputPin('1')">1</button>
      <button class="pin-button" @click="inputPin('2')">2</button>
      <button class="pin-button" @click="inputPin('3')">3</button>
      <button class="pin-button" @click="inputPin('4')">4</button>
      <button class="pin-button" @click="inputPin('5')">5</button>
      <button class="pin-button" @click="inputPin('6')">6</button>
      <button class="pin-button" @click="inputPin('7')">7</button>
      <button class="pin-button" @click="inputPin('8')">8</button>
      <button class="pin-button" @click="inputPin('9')">9</button>
      <button class="pin-button clear-btn" @click="clearPin()">Clear</button>
      <button class="pin-button" @click="inputPin('0')">0</button>
      <button class="pin-button enter-btn" @click="submitPin()">Enter</button>
      <button class="pin-button cancel-btn" @click="cancel()">Cancel</button>
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
}

.login h1 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 2rem;
}

.pin-display {
  margin-bottom: 2rem;
}

.pin-dots {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.dot.filled {
  background: white;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  transform: scale(1.2);
}

.error-message {
  background: rgba(239, 68, 68, 0.9);
  color: white;
  padding: 1rem 2rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  font-weight: 500;
  text-align: center;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

.pinpad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  max-width: 350px;
  width: 100%;
}

.pin-button {
  padding: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #667eea;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.pin-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  background: white;
}

.pin-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.pin-button.clear-btn {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}

.pin-button.clear-btn:hover {
  background: rgba(239, 68, 68, 1);
}

.pin-button.enter-btn {
  background: rgba(34, 197, 94, 0.9);
  color: white;
}

.pin-button.enter-btn:hover {
  background: rgba(34, 197, 94, 1);
}

.pin-button.cancel-btn {
  background: rgba(251, 146, 60, 0.9);
  color: white;
  grid-column: span 3;
}

.pin-button.cancel-btn:hover {
  background: rgba(251, 146, 60, 1);
}

@media (max-width: 640px) {
  .login h1 {
    font-size: 2rem;
  }
  
  .pin-button {
    padding: 1.2rem;
    font-size: 1.3rem;
  }
}
</style>

