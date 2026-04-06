<template>
  <!-- Loading Screen -->
  <div v-if="isLoading" class="loading-screen">
    <div class="loading-content">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <h2 class="loading-title">SYSTEM</h2>
      <p class="loading-message">{{ loadingMessage }}</p>
      <div class="loading-bar">
        <div class="loading-bar-fill"></div>
      </div>
    </div>
  </div>

  <!-- System Configuration Modal -->
  <div v-if="showSystemConfig" class="modal-overlay" @click.stop="showSystemConfig = false">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>System Configuration</h2>
        <button class="close-button" @click.stop="showSystemConfig = false">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="config-section">
          <h3 class="config-heading">Visible Systems</h3>
          <div class="config-category">
            <h4>Machines</h4>
            <div v-for="system in machinesGroup" :key="system.id" class="checkbox-item">
              <label>
                <input type="checkbox" v-model="visibleSystems[system.id]" @change="saveVisibleSystems" />
                <span>{{ system.name }}</span>
              </label>
            </div>
          </div>
          <div class="config-category">
            <h4>Power</h4>
            <div v-for="system in powerGroup" :key="system.id" class="checkbox-item">
              <label>
                <input type="checkbox" v-model="visibleSystems[system.id]" @change="saveVisibleSystems" />
                <span>{{ system.name }}</span>
              </label>
            </div>
          </div>
          <div class="config-category">
            <h4>Lighting</h4>
            <div v-for="system in lightingGroup" :key="system.id" class="checkbox-item">
              <label>
                <input type="checkbox" v-model="visibleSystems[system.id]" @change="saveVisibleSystems" />
                <span>{{ system.name }}</span>
              </label>
            </div>
          </div>
          <div class="config-category">
            <h4>Climate</h4>
            <div v-for="system in climateGroup" :key="system.id" class="checkbox-item">
              <label>
                <input type="checkbox" v-model="visibleSystems[system.id]" @change="saveVisibleSystems" />
                <span>{{ system.name }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-primary" @click.stop="showSystemConfig = false">Done</button>
      </div>
    </div>
  </div>

  <!-- Device Configuration Modal -->
  <div v-if="activeModal" class="modal-overlay" @click.stop="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ getModalTitle() }}</h2>
        <button class="close-button" @click.stop="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="config-section">
          <h3 class="config-heading">Status</h3>
          <div class="config-item">
            <label>Device Status</label>
            <select v-model="deviceStatus[activeModal]" @click.stop @change="saveStatus">
              <option value="active">Operational</option>
              <option value="inactive">Offline</option>
              <option value="outOfOrder">Out of Order</option>
            </select>
          </div>
          
          <h3 class="config-heading">Settings</h3>
          <div class="config-item">
            <label>Power Level (%)</label>
            <input type="range" v-model="genericConfig.power" min="0" max="100" @click.stop />
            <span class="value-display">{{ genericConfig.power }}%</span>
          </div>
          <div class="config-item">
            <label>Notes</label>
            <textarea v-model="deviceNotes[activeModal]" @click.stop placeholder="e.g. Defect: Motor making noise" rows="3"></textarea>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <div class="footer-right">
          <button class="btn-secondary" @click.stop="closeModal">Cancel</button>
          <button class="btn-primary" @click.stop="saveConfiguration">Save</button>
        </div>
      </div>
    </div>
  </div>

  <div class="dashboard-container" @click="resetTimer" @mousemove="resetTimer" @keydown="resetTimer">
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo-section">
            <div class="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
              </svg>
            </div>
            <div>
              <h1>SMART CONTROL</h1>
              <p class="subtitle">Workshop Management System</p>
            </div>
          </div>
        </div>
        
        <div class="header-center">
          <div class="date-time">
            <p class="date">{{ currentDate }}</p>
            <p class="time">{{ currentTime }}</p>
          </div>
        </div>
        
        <div class="header-right">
          <div class="session-info">
            <p class="session-label">SESSION ACTIVE</p>
            <div class="circular-timer">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle
                  class="circle-bg"
                  cx="30"
                  cy="30"
                  r="26"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.05)"
                  stroke-width="3"
                />
                <circle
                  class="circle-progress"
                  cx="30"
                  cy="30"
                  r="26"
                  fill="none"
                  :stroke="getTimerColor()"
                  stroke-width="3"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="dashOffset"
                  transform="rotate(-90 30 30)"
                />
                <text
                  x="30"
                  y="30"
                  text-anchor="middle"
                  dy="5"
                  class="timer-text"
                >
                  {{ sessionExpireCountdown }}
                </text>
              </svg>
            </div>
          </div>
          <button class="settings-btn" @click.stop="showSystemConfig = true" title="Systemkonfiguration">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button class="logout-btn" @click.stop="lockSystem" title="System sperren">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
    
    <main class="main-content">
      <!-- Control Panel Grid -->
      <div class="control-panel">
        <h2>SYSTEM CONTROL</h2>
        
        <!-- Machines Section -->
        <div class="section" v-if="hasVisibleSystems(machinesGroup)">
          <h3 class="section-title">MACHINES</h3>
          <div class="controls-grid">
            <div 
              v-for="system in machinesGroup" 
              :key="system.id"
              v-show="visibleSystems[system.id]"
              class="control-card"
              :class="{ 
                active: systems[system.id],
                'out-of-order': deviceStatus[system.id] === 'outOfOrder'
              }"
            >
              <div class="control-icon" @click.stop="toggleSystem(system.id)">
                <component :is="'svg'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="system.icon" />
                </component>
              </div>
              
              <div class="control-info">
                <h3 class="control-name">{{ system.name }}</h3>
                <p class="control-status">{{ getSystemStatus(system.id) }}</p>
              </div>
              
              <button 
                class="config-btn" 
                @click.stop="openModal(system.id)"
                title="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Power Section -->
        <div class="section" v-if="hasVisibleSystems(powerGroup)">
          <h3 class="section-title">POWER SUPPLY</h3>
          <div class="controls-grid">
            <div 
              v-for="system in powerGroup" 
              :key="system.id"
              v-show="visibleSystems[system.id]"
              class="control-card"
              :class="{ 
                active: systems[system.id],
                'out-of-order': deviceStatus[system.id] === 'outOfOrder'
              }"
            >
              <div class="control-icon" @click.stop="toggleSystem(system.id)">
                <component :is="'svg'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="system.icon" />
                </component>
              </div>
              
              <div class="control-info">
                <h3 class="control-name">{{ system.name }}</h3>
                <p class="control-status">{{ getSystemStatus(system.id) }}</p>
              </div>
              
              <button 
                class="config-btn" 
                @click.stop="openModal(system.id)"
                title="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Lighting Section with Vertical Sliders -->
        <div class="section" v-if="hasVisibleSystems(lightingGroup)">
          <h3 class="section-title">LIGHTING CONTROL</h3>
          <div class="lighting-controls">
            <div 
              v-for="system in lightingGroup" 
              :key="system.id"
              v-show="visibleSystems[system.id]"
              class="light-slider-card"
              :class="{ 
                active: systems[system.id] && (lightBrightness[system.id] ?? 0) > 0,
                'out-of-order': deviceStatus[system.id] === 'outOfOrder'
              }"
            >
              <div class="light-header">
                <div class="light-icon" @click.stop="toggleLight(system.id)">
                  <svg v-if="systems[system.id] && (lightBrightness[system.id] ?? 0) > 0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                </div>
                <button 
                  class="config-btn-small" 
                  @click.stop="openModal(system.id)"
                  title="Settings"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              
              <div class="vertical-slider-container">
                <div class="brightness-value">{{ lightBrightness[system.id] }}</div>
                <div class="slider-track">
                  <div class="slider-fill" :style="{ height: lightBrightness[system.id] + '%' }"></div>
                  <input 
                    type="range" 
                    class="vertical-slider" 
                    :value="lightBrightness[system.id]" 
                    @input="updateBrightness(system.id, $event)"
                    @click.stop
                    min="0" 
                    max="100"
                    orient="vertical"
                  />
                </div>
                <div class="slider-labels">
                  <span>100</span>
                  <span>0</span>
                </div>
              </div>
              
              <div class="light-info">
                <h4 class="light-name">{{ system.name }}</h4>
                <p class="light-status">{{ getLightStatus(system.id) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Climate Section -->
        <div class="section" v-if="hasVisibleSystems(climateGroup)">
          <h3 class="section-title">CLIMATE & VENTILATION</h3>
          <div class="controls-grid">
            <div 
              v-for="system in climateGroup" 
              :key="system.id"
              v-show="visibleSystems[system.id]"
              class="control-card"
              :class="{ 
                active: systems[system.id],
                'out-of-order': deviceStatus[system.id] === 'outOfOrder'
              }"
            >
              <div class="control-icon" @click.stop="toggleSystem(system.id)">
                <component :is="'svg'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="system.icon" />
                </component>
              </div>
              
              <div class="control-info">
                <h3 class="control-name">{{ system.name }}</h3>
                <p class="control-status">{{ getSystemStatus(system.id) }}</p>
              </div>
              
              <button 
                class="config-btn" 
                @click.stop="openModal(system.id)"
                title="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Safety Section -->
        <div class="section" v-if="hasVisibleSystems(safetyGroup)">
          <h3 class="section-title">SAFETY & SECURITY</h3>
          <div class="controls-grid">
            <div 
              v-for="system in safetyGroup" 
              :key="system.id"
              v-show="visibleSystems[system.id]"
              class="control-card"
              :class="{ 
                active: systems[system.id],
                emergency: system.id === 'notaus' && systems[system.id],
                'out-of-order': deviceStatus[system.id] === 'outOfOrder'
              }"
            >
              <div class="control-icon" @click.stop="toggleSystem(system.id)">
                <component :is="'svg'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="system.icon" />
                </component>
              </div>
              
              <div class="control-info">
                <h3 class="control-name">{{ system.name }}</h3>
                <p class="control-status">{{ getSystemStatus(system.id) }}</p>
              </div>
              
              <button 
                class="config-btn" 
                @click.stop="openModal(system.id)"
                title="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Panel -->
      <div class="stats-panel">
        <h2>SYSTEM STATUS</h2>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon active-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Aktive Geräte</p>
              <p class="stat-value">{{ activeSystemsCount }} / {{ visibleSystemsCount }}</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon temp-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.25a.75.75 0 01.75.75v.756a49.106 49.106 0 019.152 1 .75.75 0 01-.152 1.485h-1.918l2.474 10.124a.75.75 0 01-.375.84A6.723 6.723 0 0118.75 18a6.723 6.723 0 01-3.181-.795.75.75 0 01-.375-.84l2.474-10.124H12.75v13.28c1.293.076 2.534.343 3.697.776a.75.75 0 01-.262 1.453h-8.37a.75.75 0 01-.262-1.453c1.162-.433 2.404-.7 3.697-.775V6.24H6.332l2.474 10.124a.75.75 0 01-.375.84A6.723 6.723 0 015.25 18a6.723 6.723 0 01-3.181-.795.75.75 0 01-.375-.84L4.168 6.241H2.25a.75.75 0 01-.152-1.485 49.105 49.105 0 019.152-1V3a.75.75 0 01.75-.75z" />
              </svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Temperatur</p>
              <p class="stat-value">{{ currentTemp }}°C</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon power-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.5 9.75a6 6 0 0011.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" />
              </svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Stromverbrauch</p>
              <p class="stat-value">{{ powerConsumption }} kW</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon uptime-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Betriebszeit</p>
              <p class="stat-value">{{ systemUptime }}</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon efficiency-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clip-rule="evenodd" />
                <path fill-rule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-6.75V4.5a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Systemeffizienz</p>
              <p class="stat-value">{{ systemEfficiency }}%</p>
            </div>
          </div>
          
          <div class="stat-card warning-card" v-if="outOfOrderCount > 0">
            <div class="stat-icon warning-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Nicht funktionsfähig</p>
              <p class="stat-value">{{ outOfOrderCount }}</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h3>QUICK ACTIONS</h3>
          <div class="action-buttons">
            <button @click="activateAllMachines" class="action-btn primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              All Machines ON
            </button>
            <button @click="deactivateAllMachines" class="action-btn danger">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
              </svg>
              All Machines OFF
            </button>
            <button @click="activateLighting" class="action-btn warning">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
              All Lights ON
            </button>
            <button @click="toggleTimerPause" :class="['action-btn', timerPaused ? 'timer-active' : 'timer-paused']">
              <svg v-if="!timerPaused" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              {{ timerPaused ? 'Resume Timer' : 'Pause Timer' }}
            </button>
          </div>
        </div>

        <!-- Out of Order List -->
        <div v-if="outOfOrderDevices.length > 0" class="out-of-order-list">
          <h3>OUT OF ORDER</h3>
          <div class="defect-items">
            <div v-for="device in outOfOrderDevices" :key="device.id" class="defect-item">
              <span class="defect-name">{{ device.name }}</span>
              <span v-if="deviceNotes[device.id]" class="defect-note">{{ deviceNotes[device.id] }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Session & Timer Management
const sessionExpireCountdown = ref(30)
const timerPaused = ref(false)
const currentDate = ref('')
const currentTime = ref('')
let sessionTimer: NodeJS.Timeout | null = null
let clockTimer: NodeJS.Timeout | null = null

// System State
const systems = ref<Record<string, boolean>>({})
const deviceStatus = ref<Record<string, 'active' | 'inactive' | 'outOfOrder'>>({})
const deviceNotes = ref<Record<string, string>>({})
const visibleSystems = ref<Record<string, boolean>>({})
const lightBrightness = ref<Record<string, number>>({})
const isLoading = ref(false)
const loadingMessage = ref('')
const activeModal = ref<string | null>(null)
const showSystemConfig = ref(false)
const currentTemp = ref(22.0)
const powerConsumption = ref(0)
const systemUptime = ref('00:00:00')
const systemEfficiency = ref(0)
let uptimeTimer: NodeJS.Timeout | null = null
let uptimeSeconds = 0

// Generic config for all systems
const genericConfig = ref({
  power: 80,
  mode: 'normal',
  priority: 'medium',
  autoStartTime: '07:00',
  autoShutdown: 30,
  tempAlert: 60,
  diagnostics: 'enabled'
})

// System definitions - School workshop focused
const machinesGroup = [
  { id: 'dekupiersaege1', name: 'Dekupiersäge 1', icon: 'M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5', category: 'machine' },
  { id: 'dekupiersaege2', name: 'Dekupiersäge 2', icon: 'M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5', category: 'machine' },
  { id: 'standbohrer1', name: 'Standbohrmaschine 1', icon: 'M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z', category: 'machine' },
  { id: 'standbohrer2', name: 'Standbohrmaschine 2', icon: 'M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z', category: 'machine' },
  { id: 'standbohrer3', name: 'Standbohrmaschine 3', icon: 'M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z', category: 'machine' },
  { id: 'tellerschleifer', name: 'Tellerschleifer', icon: 'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z', category: 'machine' },
  { id: 'bandsaege', name: 'Bandsäge', icon: 'M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z', category: 'machine' },
  { id: 'tischsaege', name: 'Tischsäge', icon: 'M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z', category: 'machine' },
  { id: 'drehbank', name: 'Drehbank', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z', category: 'machine' },
  { id: 'tischbohrer', name: 'Tischbohrer', icon: 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z', category: 'machine' },
  { id: 'laubsaege', name: 'Laubsäge', icon: 'M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5', category: 'machine' },
  { id: 'schleifmaschine', name: 'Schleifbock', icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99', category: 'machine' },
]

const powerGroup = [
  { id: 'hauptstrom', name: 'Hauptstrom', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', category: 'power' },
  { id: 'stromZone1', name: 'Strom Zone 1', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', category: 'power' },
  { id: 'stromZone2', name: 'Strom Zone 2', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', category: 'power' },
  { id: 'stromZone3', name: 'Strom Zone 3', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', category: 'power' },
  { id: 'drehstrom1', name: 'Drehstrom Maschinen 1', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', category: 'power' },
  { id: 'drehstrom2', name: 'Drehstrom Maschinen 2', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', category: 'power' },
]

const lightingGroup = [
  { id: 'hauptlicht', name: 'Hauptbeleuchtung', icon: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z', category: 'lighting' },
  { id: 'arbeitsLicht1', name: 'Arbeitsbereich 1', icon: 'M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18', category: 'lighting' },
  { id: 'arbeitsLicht2', name: 'Arbeitsbereich 2', icon: 'M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18', category: 'lighting' },
  { id: 'arbeitsLicht3', name: 'Arbeitsbereich 3', icon: 'M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18', category: 'lighting' },
  { id: 'maschinenLicht', name: 'Maschinen Beleuchtung', icon: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z', category: 'lighting' },
  { id: 'notlicht', name: 'Notbeleuchtung', icon: 'M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z', category: 'lighting' },
]

const climateGroup = [
  { id: 'luftung', name: 'Lüftungsanlage', icon: 'M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5', category: 'climate' },
  { id: 'absaugung1', name: 'Absauganlage 1', icon: 'M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5', category: 'climate' },
  { id: 'absaugung2', name: 'Absauganlage 2', icon: 'M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5', category: 'climate' },
  { id: 'heizung', name: 'Heizung', icon: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z', category: 'climate' },
]

const safetyGroup = [
  { id: 'notaus', name: 'NOT-AUS', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', category: 'safety' },
  { id: 'brandmelder', name: 'Brandmeldeanlage', icon: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0', category: 'safety' },
  { id: 'rauchmelder', name: 'Rauchmelder', icon: 'M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z', category: 'safety' },
  { id: 'tuer', name: 'Werkstatttür', icon: 'M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z', category: 'safety' },
]

const allSystems = [
  ...machinesGroup,
  ...powerGroup,
  ...lightingGroup,
  ...climateGroup,
  ...safetyGroup
]

const systemMessages: Record<string, { on: string; off: string }> = {
  // Machines
  dekupiersaege1: { on: 'Dekupiersäge 1 startet...', off: 'Dekupiersäge 1 gestoppt' },
  dekupiersaege2: { on: 'Dekupiersäge 2 startet...', off: 'Dekupiersäge 2 gestoppt' },
  standbohrer1: { on: 'Standbohrer 1 startet...', off: 'Standbohrer 1 gestoppt' },
  standbohrer2: { on: 'Standbohrer 2 startet...', off: 'Standbohrer 2 gestoppt' },
  standbohrer3: { on: 'Standbohrer 3 startet...', off: 'Standbohrer 3 gestoppt' },
  tellerschleifer: { on: 'Tellerschleifer läuft...', off: 'Tellerschleifer gestoppt' },
  bandsaege: { on: 'Bandsäge startet...', off: 'Bandsäge gestoppt' },
  tischsaege: { on: 'Tischsäge an', off: 'Tischsäge aus' },
  drehbank: { on: 'Drehbank startet...', off: 'Drehbank gestoppt' },
  tischbohrer: { on: 'Tischbohrer läuft', off: 'Tischbohrer gestoppt' },
  laubsaege: { on: 'Laubsäge an', off: 'Laubsäge aus' },
  schleifmaschine: { on: 'Schleifbock läuft', off: 'Schleifbock gestoppt' },
  
  // Power
  hauptstrom: { on: '⚡ Hauptstrom EIN', off: '⚡ Hauptstrom AUS' },
  stromZone1: { on: 'Zone 1 aktiviert', off: 'Zone 1 deaktiviert' },
  stromZone2: { on: 'Zone 2 aktiviert', off: 'Zone 2 deaktiviert' },
  stromZone3: { on: 'Zone 3 aktiviert', off: 'Zone 3 deaktiviert' },
  drehstrom1: { on: 'Drehstrom 1 an', off: 'Drehstrom 1 aus' },
  drehstrom2: { on: 'Drehstrom 2 an', off: 'Drehstrom 2 aus' },
  
  // Lighting
  hauptlicht: { on: 'Hauptlicht EIN', off: 'Hauptlicht AUS' },
  arbeitsLicht1: { on: 'Arbeitsbereich 1 beleuchtet', off: 'Arbeitsbereich 1 dunkel' },
  arbeitsLicht2: { on: 'Arbeitsbereich 2 beleuchtet', off: 'Arbeitsbereich 2 dunkel' },
  arbeitsLicht3: { on: 'Arbeitsbereich 3 beleuchtet', off: 'Arbeitsbereich 3 dunkel' },
  maschinenLicht: { on: 'Maschinenbeleuchtung an', off: 'Maschinenbeleuchtung aus' },
  notlicht: { on: 'Notbeleuchtung aktiviert', off: 'Notbeleuchtung deaktiviert' },
  
  // Climate
  luftung: { on: 'Lüftung läuft', off: 'Lüftung gestoppt' },
  absaugung1: { on: 'Absaugung 1 aktiv', off: 'Absaugung 1 aus' },
  absaugung2: { on: 'Absaugung 2 aktiv', off: 'Absaugung 2 aus' },
  heizung: { on: 'Heizung an', off: 'Heizung aus' },
  
  // Safety
  notaus: { on: '🚨 NOT-AUS AKTIVIERT!', off: 'NOT-AUS zurückgesetzt' },
  brandmelder: { on: 'Brandmelder aktiv', off: 'Brandmelder bereit' },
  rauchmelder: { on: 'Rauchmelder aktiv', off: 'Rauchmelder bereit' },
  tuer: { on: 'Tür entriegelt', off: 'Tür verriegelt' },
}

const loadingTimes: Record<string, number> = {
  notaus: 100,
  hauptstrom: 2000,
  dekupiersaege1: 2000,
  dekupiersaege2: 2000,
  drehbank: 3000,
}

// Computed properties
const activeSystemsCount = computed(() => {
  return Object.keys(systems.value).filter(key => 
    systems.value[key] && deviceStatus.value[key] !== 'outOfOrder' && visibleSystems.value[key]
  ).length
})

const visibleSystemsCount = computed(() => {
  return Object.keys(visibleSystems.value).filter(key => visibleSystems.value[key]).length
})

const totalSystemsCount = computed(() => {
  return allSystems.length
})

const outOfOrderCount = computed(() => {
  return Object.keys(deviceStatus.value).filter(key => 
    deviceStatus.value[key] === 'outOfOrder' && visibleSystems.value[key]
  ).length
})

const outOfOrderDevices = computed(() => {
  return allSystems.filter(system => 
    deviceStatus.value[system.id] === 'outOfOrder' && visibleSystems.value[system.id]
  )
})

const radius = 26
const circumference = 2 * Math.PI * radius

const dashOffset = computed(() => {
  const progress = sessionExpireCountdown.value / 30
  return circumference * (1 - progress)
})

const getTimerColor = () => {
  if (sessionExpireCountdown.value > 20) return '#10b981'
  if (sessionExpireCountdown.value > 10) return '#f59e0b'
  return '#ef4444'
}

const getModalTitle = () => {
  if (!activeModal.value) return ''
  const system = allSystems.find(s => s.id === activeModal.value)
  return system ? `${system.name}` : 'System Settings'
}

const getSystemStatus = (systemId: string) => {
  if (deviceStatus.value[systemId] === 'outOfOrder') {
    return 'OUT OF ORDER'
  }
  
  const isActive = systems.value[systemId]
  if (systemId === 'notaus') return isActive ? 'ACTIVE' : 'Ready'
  if (systemId === 'tuer') return isActive ? 'Open' : 'Locked'
  return isActive ? 'ON' : 'OFF'
}

const getLightStatus = (systemId: string) => {
  if (deviceStatus.value[systemId] === 'outOfOrder') {
    return 'OUT OF ORDER'
  }
  
  const brightness = lightBrightness.value[systemId] || 0
  if (brightness === 0) return 'OFF'
  return `${brightness}% Brightness`
}

const hasVisibleSystems = (group: any[]) => {
  return group.some(system => visibleSystems.value[system.id])
}

// Update power consumption based on active systems
const updatePowerConsumption = () => {
  let power = 0.3 // Base load
  
  Object.keys(systems.value).forEach(systemId => {
    if (systems.value[systemId] && deviceStatus.value[systemId] !== 'outOfOrder') {
      const system = allSystems.find(s => s.id === systemId)
      if (system) {
        if (system.category === 'machine') power += 2.5
        else if (system.category === 'power') power += 0.2
        else if (system.category === 'lighting') power += 0.4
        else if (system.category === 'climate') power += 1.5
        else power += 0.1
      }
    }
  })
  
  powerConsumption.value = Math.round(power * 10) / 10
}

// Functions
const openModal = (systemId: string) => {
  resetTimer()
  activeModal.value = systemId
}

const closeModal = () => {
  resetTimer()
  activeModal.value = null
}

const saveStatus = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('deviceStatus', JSON.stringify(deviceStatus.value))
  }
}

const saveConfiguration = () => {
  resetTimer()
  if (typeof window !== 'undefined') {
    localStorage.setItem('workshopConfig', JSON.stringify(genericConfig.value))
    localStorage.setItem('deviceNotes', JSON.stringify(deviceNotes.value))
    saveStatus()
  }
  closeModal()
}

const saveVisibleSystems = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('visibleSystems', JSON.stringify(visibleSystems.value))
  }
}

const toggleLight = async (systemId: string) => {
  if (deviceStatus.value[systemId] === 'outOfOrder') {
    isLoading.value = true
    loadingMessage.value = 'Device is not operational!'
    await new Promise(resolve => setTimeout(resolve, 1500))
    isLoading.value = false
    loadingMessage.value = ''
    return
  }
  
  resetTimer()
  
  if ((lightBrightness.value[systemId] ?? 0) > 0) {
    // Turn off
    lightBrightness.value[systemId] = 0
    systems.value[systemId] = false
  } else {
    // Turn on to 100%
    lightBrightness.value[systemId] = 100
    systems.value[systemId] = true
  }
  
  updatePowerConsumption()
  saveLightBrightness()
}

const updateBrightness = (systemId: string, event: Event) => {
  resetTimer()
  const value = parseInt((event.target as HTMLInputElement).value)
  lightBrightness.value[systemId] = value
  systems.value[systemId] = value > 0
  updatePowerConsumption()
  saveLightBrightness()
}

const saveLightBrightness = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lightBrightness', JSON.stringify(lightBrightness.value))
    localStorage.setItem('workshopSystems', JSON.stringify(systems.value))
  }
}

const toggleSystem = async (systemId: string) => {
  // Check if device is out of order
  if (deviceStatus.value[systemId] === 'outOfOrder') {
    isLoading.value = true
    loadingMessage.value = '⚠️ Gerät ist nicht funktionsfähig!'
    await new Promise(resolve => setTimeout(resolve, 1500))
    isLoading.value = false
    loadingMessage.value = ''
    return
  }
  
  resetTimer()
  const newState = !systems.value[systemId]
  const messages = systemMessages[systemId] || { 
    on: `${systemId} aktiviert...`, 
    off: `${systemId} deaktiviert...` 
  }
  
  // Show loading
  isLoading.value = true
  loadingMessage.value = newState ? messages.on : messages.off
  
  // Get loading time (default 1000ms)
  const loadTime = loadingTimes[systemId] || 1000
  
  // Wait for loading
  await new Promise(resolve => setTimeout(resolve, loadTime))
  
  // Update system state
  systems.value[systemId] = newState
  
  // Update power consumption
  updatePowerConsumption()
  
  // Update temperature
  if (newState && allSystems.find(s => s.id === systemId)?.category === 'machine') {
    currentTemp.value += 0.3
  } else if (!newState && allSystems.find(s => s.id === systemId)?.category === 'machine') {
    currentTemp.value -= 0.3
  }
  
  // Save state
  if (typeof window !== 'undefined') {
    localStorage.setItem('workshopSystems', JSON.stringify(systems.value))
  }
  
  // Hide loading
  isLoading.value = false
  loadingMessage.value = ''
}

const activateGeneralSystems = async () => {
  resetTimer()
  // Activate everything students need: power, lighting, machines, climate
  // First: Main power
  if (!systems.value['hauptstrom']) {
    await toggleSystem('hauptstrom')
  }
  
  // Power zones
  for (const system of powerGroup) {
    if (!systems.value[system.id] && deviceStatus.value[system.id] !== 'outOfOrder') {
      await toggleSystem(system.id)
    }
  }
  
  // All lighting except emergency
  for (const system of lightingGroup) {
    if (!systems.value[system.id] && deviceStatus.value[system.id] !== 'outOfOrder' && system.id !== 'notlicht') {
      await toggleSystem(system.id)
    }
  }
  
  // All machines
  for (const system of machinesGroup) {
    if (!systems.value[system.id] && deviceStatus.value[system.id] !== 'outOfOrder') {
      await toggleSystem(system.id)
    }
  }
  
  // Climate systems
  for (const system of climateGroup) {
    if (!systems.value[system.id] && deviceStatus.value[system.id] !== 'outOfOrder') {
      await toggleSystem(system.id)
    }
  }
}

const activateAllMachines = async () => {
  resetTimer()
  // Only activate machines, not safety, lighting, or climate
  for (const system of machinesGroup) {
    if (!systems.value[system.id] && deviceStatus.value[system.id] !== 'outOfOrder') {
      await toggleSystem(system.id)
    }
  }
}

const deactivateAllMachines = async () => {
  resetTimer()
  // Only deactivate machines
  for (const system of machinesGroup) {
    if (systems.value[system.id]) {
      await toggleSystem(system.id)
    }
  }
}

const activateLighting = async () => {
  resetTimer()
  for (const system of lightingGroup) {
    if (visibleSystems.value[system.id] && deviceStatus.value[system.id] !== 'outOfOrder') {
      lightBrightness.value[system.id] = 100
      systems.value[system.id] = true
    }
  }
  updatePowerConsumption()
  saveLightBrightness()
}

const toggleTimerPause = () => {
  timerPaused.value = !timerPaused.value
  if (!timerPaused.value) {
    sessionExpireCountdown.value = 30 // Reset to 30 when unpausing
  }
}

const resetTimer = () => {
  sessionExpireCountdown.value = 30
}

const lockSystem = () => {
  // Save current state before locking
  if (typeof window !== 'undefined') {
    localStorage.setItem('workshopSystems', JSON.stringify(systems.value))
    localStorage.setItem('lightBrightness', JSON.stringify(lightBrightness.value))
  }
  router.push('/locked')
}

const updateDateTime = () => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('de-DE', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  currentTime.value = now.toLocaleTimeString('de-DE', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  // Initialize systems state
  allSystems.forEach(system => {
    systems.value[system.id] = false
    deviceStatus.value[system.id] = 'inactive'
    visibleSystems.value[system.id] = true // All visible by default
    if (lightingGroup.some(l => l.id === system.id)) {
      lightBrightness.value[system.id] = 0
    }
  })
  
  // Load saved states
  if (typeof window !== 'undefined') {
    const savedSystems = localStorage.getItem('workshopSystems')
    const savedConfig = localStorage.getItem('workshopConfig')
    const savedStatus = localStorage.getItem('deviceStatus')
    const savedNotes = localStorage.getItem('deviceNotes')
    const savedVisible = localStorage.getItem('visibleSystems')
    const savedBrightness = localStorage.getItem('lightBrightness')
    
    if (savedSystems) {
      Object.assign(systems.value, JSON.parse(savedSystems))
      updatePowerConsumption()
    }
    
    if (savedConfig) {
      Object.assign(genericConfig.value, JSON.parse(savedConfig))
    }
    
    if (savedStatus) {
      Object.assign(deviceStatus.value, JSON.parse(savedStatus))
    }
    
    if (savedNotes) {
      Object.assign(deviceNotes.value, JSON.parse(savedNotes))
    }
    
    if (savedVisible) {
      Object.assign(visibleSystems.value, JSON.parse(savedVisible))
    }
    
    if (savedBrightness) {
      Object.assign(lightBrightness.value, JSON.parse(savedBrightness))
    }
  }
  
  // Start timers
  updateDateTime()
  clockTimer = setInterval(updateDateTime, 1000)
  
  // Uptime timer
  uptimeTimer = setInterval(() => {
    uptimeSeconds++
    const hours = Math.floor(uptimeSeconds / 3600)
    const minutes = Math.floor((uptimeSeconds % 3600) / 60)
    const seconds = uptimeSeconds % 60
    systemUptime.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, 1000)
  
  sessionTimer = setInterval(() => {
    if (!timerPaused.value) {
      if (sessionExpireCountdown.value > 0) {
        sessionExpireCountdown.value--
      } else {
        // Session expired - redirect to locked page
        if (typeof window !== 'undefined') {
          router.push('/locked')
        }
      }
    }
  }, 1000)
  
  // Update temperature and efficiency periodically
  setInterval(() => {
    const machineCount = machinesGroup.filter(m => systems.value[m.id] && visibleSystems.value[m.id]).length
    const targetTemp = 21.0 + (machineCount * 0.3)
    currentTemp.value += (targetTemp - currentTemp.value) * 0.1
    currentTemp.value = Math.round(currentTemp.value * 10) / 10
    
    // Calculate system efficiency based on active systems and out of order devices
    const totalActive = activeSystemsCount.value
    const totalVisible = visibleSystemsCount.value
    const outOfOrder = outOfOrderCount.value
    
    if (totalVisible > 0) {
      const baseEfficiency = (totalActive / totalVisible) * 100
      const penaltyForOutOfOrder = (outOfOrder / totalVisible) * 20
      systemEfficiency.value = Math.max(0, Math.round(baseEfficiency - penaltyForOutOfOrder))
    } else {
      systemEfficiency.value = 0
    }
  }, 5000)
})

onUnmounted(() => {
  if (sessionTimer) clearInterval(sessionTimer)
  if (clockTimer) clearInterval(clockTimer)
  if (uptimeTimer) clearInterval(uptimeTimer)
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Loading Screen */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.loading-spinner {
  position: relative;
  width: 120px;
  height: 120px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
}

.spinner-ring:nth-child(2) {
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  border-top-color: #888888;
  animation-delay: 0.2s;
  animation-duration: 1.8s;
}

.spinner-ring:nth-child(3) {
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  border-top-color: #555555;
  animation-delay: 0.4s;
  animation-duration: 2.1s;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-title {
  color: white;
  font-size: 48px;
  font-weight: 900;
  letter-spacing: 12px;
  text-transform: uppercase;
  text-align: center;
}

.loading-message {
  color: #888888;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  min-height: 24px;
}

.loading-bar {
  width: 300px;
  height: 3px;
  background: #222222;
  border-radius: 2px;
  overflow: hidden;
}

.loading-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffffff, #888888);
  animation: loading 2s ease-in-out infinite;
}

@keyframes loading {
  0% { width: 0%; }
  50% { width: 100%; }
  100% { width: 0%; }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
  padding: 20px;
}

.modal-content {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.modal-header {
  padding: 28px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  color: white;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.close-button {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
  transform: scale(1.05);
}

.close-button svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 28px;
  overflow-y: auto;
  flex: 1;
}

.config-section {
  margin-bottom: 20px;
}

.config-heading {
  color: #60a5fa;
  font-size: 14px;
  font-weight: 700;
  margin: 24px 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.config-category {
  margin-bottom: 24px;
}

.config-category h4 {
  color: #94a3b8;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.checkbox-item {
  margin-bottom: 10px;
}

.checkbox-item label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.checkbox-item label:hover {
  background: rgba(59, 130, 246, 0.05);
}

.checkbox-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #3b82f6;
}

.checkbox-item span {
  color: #cbd5e1;
  font-size: 14px;
}

.config-item {
  margin-bottom: 20px;
}

.config-item label {
  display: block;
  color: #cbd5e1;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.config-item input[type="range"],
.config-item input[type="number"],
.config-item input[type="time"],
.config-item select,
.config-item textarea {
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 10px;
  padding: 12px 16px;
  color: white;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.3s ease;
}

.config-item input:focus,
.config-item select:focus,
.config-item textarea:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(15, 23, 42, 0.8);
}

.config-item textarea {
  resize: vertical;
  min-height: 80px;
}

.value-display {
  display: inline-block;
  margin-left: 16px;
  color: #60a5fa;
  font-weight: 700;
  font-size: 16px;
}

.modal-footer {
  padding: 24px 28px;
  border-top: 1px solid rgba(59, 130, 246, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.footer-right {
  display: flex;
  gap: 12px;
}

.btn-secondary,
.btn-primary {
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-secondary {
  background: rgba(71, 85, 105, 0.3);
  color: white;
  border: 1px solid rgba(71, 85, 105, 0.4);
}

.btn-secondary:hover {
  background: rgba(71, 85, 105, 0.5);
  border-color: rgba(71, 85, 105, 0.6);
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
}

/* Dashboard */
.dashboard-container {
  min-height: 100vh;
  background: #0a0e1a;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
}

.header {
  background: rgba(10, 14, 26, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  padding: 16px 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.header-content {
  max-width: 1800px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-icon svg {
  width: 28px;
  height: 28px;
}

.header-left h1 {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 2px;
  color: white;
  margin: 0;
}

.subtitle {
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 2px;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.date-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.date {
  font-size: 13px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.time {
  font-size: 28px;
  font-weight: 600;
  color: white;
  font-variant-numeric: tabular-nums;
  letter-spacing: 1px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.circular-timer {
  position: relative;
}

.session-label {
  text-align: center;
  font-size: 10px;
  color: #64748b;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.timer-text {
  fill: white;
  font-size: 16px;
  font-weight: 700;
}

.settings-btn {
  width: 48px;
  height: 48px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  color: #60a5fa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.settings-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
  transform: rotate(90deg);
}

.settings-btn svg {
  width: 24px;
  height: 24px;
}

.logout-btn {
  width: 48px;
  height: 48px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  color: #ef4444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.logout-btn svg {
  width: 24px;
  height: 24px;
}

/* Main Content */
.main-content {
  max-width: 1800px;
  margin: 0 auto;
  padding: 32px 24px;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;
}

.control-panel h2,
.stats-panel h2 {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 32px;
  color: #64748b;
  text-transform: uppercase;
}

/* Sections */
.section {
  margin-bottom: 48px;
}

.section-title {
  font-size: 14px;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

/* Controls Grid */
.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.control-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.6));
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.control-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: transparent;
  transition: all 0.3s ease;
}

.control-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.control-card.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.1));
  border-color: rgba(59, 130, 246, 0.4);
}

.control-card.active::before {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.control-card.out-of-order {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05));
  border-color: rgba(239, 68, 68, 0.3);
  cursor: not-allowed;
  opacity: 0.7;
}

.control-card.out-of-order::before {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.control-card.emergency {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.15));
  border-color: rgba(239, 68, 68, 0.5);
  animation: pulse-red 2s ease-in-out infinite;
}

@keyframes pulse-red {
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
    border-color: rgba(239, 68, 68, 0.5);
  }
  50% { 
    box-shadow: 0 0 0 12px rgba(239, 68, 68, 0);
    border-color: rgba(239, 68, 68, 0.8);
  }
}
.control-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  color: #475569;
  transition: all 0.3s ease;
}

.control-card.active .control-icon {
  color: #60a5fa;
}

.control-card.out-of-order .control-icon {
  color: #ef4444;
}

.control-card.emergency .control-icon {
  color: #ef4444;
}

.control-icon svg {
  width: 100%;
  height: 100%;
}

/* Lighting Controls with Vertical Sliders */
.lighting-controls {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;
}

.light-slider-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.6));
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.light-slider-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: transparent;
  transition: all 0.3s ease;
}

.light-slider-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.light-slider-card.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.1));
  border-color: rgba(59, 130, 246, 0.4);
}

.light-slider-card.active::before {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.light-slider-card.out-of-order {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05));
  border-color: rgba(239, 68, 68, 0.3);
  opacity: 0.7;
}

.light-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.light-icon {
  width: 40px;
  height: 40px;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s ease;
}

.light-slider-card.active .light-icon {
  color: #fbbf24;
}

.light-icon:hover {
  transform: scale(1.1);
}

.light-icon svg {
  width: 100%;
  height: 100%;
}

.config-btn-small {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  width: 32px;
  height: 32px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.config-btn-small:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  transform: rotate(90deg);
}

.config-btn-small svg {
  width: 18px;
  height: 18px;
}

.vertical-slider-container {
  position: relative;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

.brightness-value {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
}

.slider-track {
  position: relative;
  width: 60px;
  height: 200px;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 30px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  overflow: hidden;
}

.slider-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, #3b82f6, #60a5fa, #fbbf24);
  transition: height 0.2s ease;
  border-radius: 30px;
}

.vertical-slider {
  position: absolute;
  width: 200px;
  height: 60px;
  top: 70px;
  left: -70px;
  transform: rotate(-90deg);
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  outline: none;
  cursor: pointer;
}

.vertical-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.vertical-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
}

.vertical-slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.vertical-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
}

.slider-labels {
  position: absolute;
  right: -30px;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}

.light-info {
  width: 100%;
  text-align: center;
  margin-top: 12px;
}

.light-name {
  font-size: 13px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.light-status {
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.light-slider-card.active .light-status {
  color: #fbbf24;
}

.control-info {
  margin-bottom: 8px;
}

.control-name {
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
  letter-spacing: 0.3px;
}

.control-status {
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.control-card.active .control-status {
  color: #60a5fa;
}

.control-card.out-of-order .control-status {
  color: #ef4444;
}

.config-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
}

.control-card:hover .config-btn {
  opacity: 1;
}

.config-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  transform: rotate(90deg);
}

.config-btn svg {
  width: 18px;
  height: 18px;
}

/* Responsive Design */
@media (max-width: 1400px) {
  .main-content {
    grid-template-columns: 1fr 340px;
  }
}

@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .stats-panel {
    position: relative;
    top: 0;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .header-center {
    width: 100%;
  }
  
  .controls-grid,
  .lighting-controls {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
  
  .time {
    font-size: 22px;
  }
}

/* Stats Panel */
.stats-panel {
  position: sticky;
  top: 120px;
  height: fit-content;
}

.stats-grid {
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.6));
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateX(4px);
}

.stat-card.warning-card {
  border-color: rgba(239, 68, 68, 0.3);
}

.stat-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 28px;
  height: 28px;
}

.active-icon {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1));
  color: #60a5fa;
}

.temp-icon {
  background: linear-gradient(135deg, rgba(251, 146, 60, 0.2), rgba(249, 115, 22, 0.1));
  color: #fb923c;
}

.power-icon {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.1));
  color: #4ade80;
}

.warning-icon {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1));
  color: #f87171;
}

.uptime-icon {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1));
  color: #a78bfa;
}

.efficiency-icon {
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(202, 138, 4, 0.1));
  color: #facc15;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 11px;
  color: #64748b;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: white;
  font-variant-numeric: tabular-nums;
}

/* Quick Actions */
.quick-actions {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.6));
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.quick-actions h3 {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  padding: 14px 20px;
  border-radius: 12px;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(16, 185, 129, 0.4);
}

.action-btn.danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.action-btn.danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(239, 68, 68, 0.4);
}

.action-btn.warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.action-btn.warning:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(245, 158, 11, 0.4);
}

.action-btn.timer-paused {
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.action-btn.timer-paused:hover {
  background: rgba(239, 68, 68, 0.25);
  border-color: rgba(239, 68, 68, 0.5);
}

.action-btn.timer-active {
  background: rgba(34, 197, 94, 0.15);
  color: #86efac;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.action-btn.timer-active:hover {
  background: rgba(34, 197, 94, 0.25);
  border-color: rgba(34, 197, 94, 0.5);
}

/* Out of Order List */
.out-of-order-list {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05));
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.out-of-order-list h3 {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #fca5a5;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.defect-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.defect-item {
  background: rgba(15, 23, 42, 0.6);
  padding: 14px;
  border-radius: 10px;
  border-left: 3px solid #ef4444;
}

.defect-name {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: white;
  margin-bottom: 6px;
}

.defect-note {
  display: block;
  font-size: 12px;
  color: #94a3b8;
  font-style: italic;
}

/* Responsive */
@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .stats-panel {
    position: static;
  }
}

@media (max-width: 768px) {
  .controls-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .header-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .control-card {
    padding: 16px;
  }
}
</style>
