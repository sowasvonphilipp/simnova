<template>
  <div class="locked-container">
    <div class="locked-content">
      <div class="lock-circle">
        <div class="lock-ring"></div>
        <div class="lock-ring-2"></div>
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      
      <div class="title">
        <h1>SYSTEM GESPERRT</h1>
      </div>
      
      <div class="text">
        <p>Das System wurde aus Sicherheitsgründen gesperrt.</p>
        <p class="subtext">Authentifizierung erforderlich</p>
      </div>
      
      <div class="button">
        <NuxtLink to="/login">
          <button class="unlock-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <span>ENTSPERREN</span>
          </button>
        </NuxtLink>
      </div>
      
      <div class="footer">
        <p>Schulwerkstatt Control System v2.0</p>
      </div>
    </div>
  </div>
</template>


<style scoped>
.locked-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  background: #000000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
}

.locked-content {
  text-align: center;
  max-width: 500px;
  padding: 40px;
}

.lock-circle {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lock-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: pulse 3s ease-in-out infinite;
}

.lock-ring-2 {
  position: absolute;
  width: 140px;
  height: 140px;
  border: 2px solid rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  animation: pulse 3s ease-in-out infinite;
  animation-delay: 0.5s;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.icon {
  width: 80px;
  height: 80px;
  color: white;
  z-index: 1;
}

.icon svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
}

.title {
  margin-bottom: 24px;
}

.title h1 {
  color: white;
  font-size: 36px;
  font-weight: 900;
  letter-spacing: 6px;
  margin: 0;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
}

.text {
  margin-bottom: 48px;
}

.text p {
  color: #888888;
  font-size: 16px;
  font-weight: 500;
  margin: 8px 0;
  letter-spacing: 0.5px;
}

.subtext {
  font-size: 14px !important;
  color: #555555 !important;
  text-transform: uppercase;
  letter-spacing: 2px !important;
  margin-top: 16px !important;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 60px;
}

.unlock-button {
  padding: 18px 48px;
  font-size: 16px;
  font-weight: 700;
  background: white;
  color: #000000;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 3px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2);
}

.unlock-button svg {
  width: 24px;
  height: 24px;
}

.unlock-button:hover {
  background: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(255, 255, 255, 0.4);
}

.unlock-button:active {
  transform: translateY(-1px);
}

.footer {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 24px;
}

.footer p {
  color: #333333;
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
}
</style>