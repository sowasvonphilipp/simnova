<script setup>
import { ref, onMounted, watch } from 'vue'

const appConfig = useAppConfig()
const router = useRouter()

// Get configuration from app.config.ts
const skipStartup = ref(appConfig.startup?.skipStartup ?? true)
const shouldFail = ref(appConfig.startup?.shouldFail ?? false)
const failureChance = ref(appConfig.startup?.failureChance ?? 100)

const startupComplete = ref(false)
const startupFailed = ref(false)
const currentMessage = ref('')
const progress = ref(0)

const messages = [
  { text: 'Booting System...', delay: 0 },
  { text: 'Initializing Core Modules...', delay: 2000 },
  { text: 'Loading Neural Network...', delay: 4000 },
  { text: 'Calibrating Sensors...', delay: 6000 },
  { text: 'Establishing Connections...', delay: 8000 },
  { text: 'System Ready!', delay: 10000 }
]

const startBootSequence = () => {
  startupComplete.value = false
  startupFailed.value = false
  progress.value = 0
  currentMessage.value = messages[0].text

  // Determine if this boot should fail (random chance or forced)
  const willFail = shouldFail.value || (Math.random() * 100 < failureChance.value)

  // Animate progress bar
  const progressInterval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 1
    }
  }, 100)

  // Show messages progressively
  messages.forEach((msg, index) => {
    setTimeout(() => {
      currentMessage.value = msg.text
      
      // Check for failure at 70% mark
      if (index === 3 && willFail) {
        clearInterval(progressInterval)
        setTimeout(() => {
          startupFailed.value = true
          currentMessage.value = 'ERROR: System initialization failed!'
        }, 500)
      }
    }, msg.delay)
  })

  // Complete startup if no failure
  if (!willFail) {
    setTimeout(() => {
      clearInterval(progressInterval)
      progress.value = 100
      startupComplete.value = true
    }, 10000)
  }
}

const retryStartup = () => {
  startBootSequence()
}

// Redirect to home when startup completes
watch(startupComplete, (isComplete) => {
  if (isComplete) {
    navigateTo('/login')
  }
})

onMounted(() => {
  // Skip startup if configured
  if (skipStartup.value) {
    navigateTo('/login')
  } else {
    startBootSequence()
  }
})
</script>

<template>
  <div class="startup">
    <!-- Loading Screen -->
    <div v-if="!startupComplete && !startupFailed" class="loading-screen">
      <div class="loading-content">
        <div class="logo-container">
          <div class="pulse-ring"></div>
          <div class="logo">SIM</div>
        </div>
        
        <div class="message-container">
          <p class="current-message">{{ currentMessage }}</p>
        </div>
        
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <p class="progress-text">{{ progress }}%</p>
        </div>
        
        <div class="spinner"></div>
      </div>
    </div>

    <!-- Failure Screen -->
    <div v-if="startupFailed" class="failure-screen">
      <div class="failure-content">
        <div class="error-icon">⚠</div>
        <h2 class="error-title">System Boot Failed</h2>
        <p class="error-message">{{ currentMessage }}</p>
        <button class="retry-button" @click="retryStartup">
          <span class="retry-icon">↻</span>
          Retry
        </button>
        <p class="hint">Configure startup settings in app.config.ts</p>
      </div>
    </div>


  </div>
</template>

<style scoped>
.startup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  color: white;
  font-family: system-ui, -apple-system, sans-serif;
  overflow: hidden;
}

/* Loading Screen */
.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.loading-content {
  text-align: center;
  max-width: 500px;
  padding: 2rem;
}

.logo-container {
  position: relative;
  margin: 0 auto 3rem;
  width: 120px;
  height: 120px;
}

.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  border: 3px solid rgba(99, 102, 241, 0.5);
  border-radius: 50%;
  animation: pulse 2s ease-out infinite;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.4);
    opacity: 0;
  }
}

.logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(45deg, #6366f1, #a855f7, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.message-container {
  margin-bottom: 2rem;
  min-height: 30px;
}

.current-message {
  font-size: 1.1rem;
  color: #a5b4fc;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.progress-container {
  margin-bottom: 2rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
  border-radius: 10px;
  transition: width 0.1s linear;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
}

.progress-text {
  font-size: 0.9rem;
  color: #94a3b8;
}

.spinner {
  margin: 2rem auto 0;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Failure Screen */
.failure-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e1b4b, #991b1b, #7f1d1d);
}

.failure-content {
  text-align: center;
  padding: 2rem;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

.error-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0.3; }
}

.error-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #fca5a5;
}

.error-message {
  font-size: 1.1rem;
  color: #fecaca;
  margin-bottom: 2rem;
}

.retry-button {
  padding: 1rem 3rem;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #dc2626, #991b1b);
  color: white;
  border: 2px solid #fca5a5;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-weight: 600;
}

.retry-button:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
}

.retry-button:active {
  transform: scale(0.98);
}

.retry-icon {
  font-size: 1.5rem;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

.hint {
  margin-top: 2rem;
  font-size: 0.85rem;
  color: #94a3b8;
  opacity: 0.7;
}


</style>