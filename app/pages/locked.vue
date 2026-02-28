<template>
  <div class="locked-container">
    <div class="locked-content">
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      </div>
      <div class="title">
        <h1>System Locked</h1>
      </div>
      <div class="text">
        <p>Das System ist gesperrt. Bitte drücke auf den Button, um fortzufahren.</p>
      </div>
      <div class="button">
        <NuxtLink to="/login">
          <button class="button__button">Unlock</button>
        </NuxtLink>
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
}

.locked-content {
  text-align: center;
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.icon svg {
  width: 64px;
  height: 64px;
}

.title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.text {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button__button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;  
}

.button__button:hover {
  background-color: #0056b3;
} 
</style>