<template>
  <!-- Loading Screen -->
  <div v-if="isLoading" class="loading-screen">
    <div class="spinner"></div>
    <p>{{ loadingMessage }}</p>
  </div>

  <!-- Configuration Modal -->
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
            <label>Gerätestatus</label>
            <select v-model="deviceStatus[activeModal]" @click.stop @change="saveStatus">
              <option value="active">In Betrieb</option>
              <option value="inactive">Ausgeschaltet</option>
              <option value="outOfOrder">Nicht in Funktion</option>
            </select>
          </div>
          
          <h3 class="config-heading">Einstellungen</h3>
          <div class="config-item">
            <label>Leistung (%)</label>
            <input type="range" v-model="genericConfig.power" min="0" max="100" @click.stop />
            <span class="value-display">{{ genericConfig.power }}%</span>
          </div>
          <div class="config-item">
            <label>Notizen</label>
            <textarea v-model="deviceNotes[activeModal]" @click.stop placeholder="z.B. Defekt: Motor macht Geräusche" rows="3"></textarea>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <div class="footer-right">
          <button class="btn-secondary" @click.stop="closeModal">Schließen</button>
          <button class="btn-primary" @click.stop="saveConfiguration">Speichern</button>
        </div>
      </div>
    </div>
  </div>

  <div class="dashboard-container" @click="resetTimer">
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <h1>🔧 Schulwerkstatt Steuerung</h1>
          <div class="date-time">
            <p class="date">{{ currentDate }}</p>
            <p class="time">{{ currentTime }}</p>
          </div>
        </div>
        
        <div class="header-right">
          <div class="session-info">
            <p class="session-label">Aktivität</p>
            <div class="circular-timer">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle
                  class="circle-bg"
                  cx="30"
                  cy="30"
                  r="26"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  stroke-width="4"
                />
                <circle
                  class="circle-progress"
                  cx="30"
                  cy="30"
                  r="26"
                  fill="none"
                  :stroke="getTimerColor()"
                  stroke-width="4"
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
        </div>
      </div>
    </header>
    
    <main class="main-content">
      <!-- Control Panel Grid -->
      <div class="control-panel">
        <h2>Werkstatt Steuerung</h2>
        
        <!-- Machines Section -->
        <div class="section">
          <h3 class="section-title">🔨 Maschinen</h3>
          <div class="controls-grid">
            <div 
              v-for="system in machinesGroup" 
              :key="system.id"
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
                title="Einstellungen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Power Section -->
        <div class="section">
          <h3 class="section-title">⚡ Stromversorgung</h3>
          <div class="controls-grid">
            <div 
              v-for="system in powerGroup" 
              :key="system.id"
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
                title="Einstellungen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Lighting Section -->
        <div class="section">
          <h3 class="section-title">💡 Beleuchtung</h3>
          <div class="controls-grid">
            <div 
              v-for="system in lightingGroup" 
              :key="system.id"
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
                title="Einstellungen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Climate Section -->
        <div class="section">
          <h3 class="section-title">🌡️ Klima & Lüftung</h3>
          <div class="controls-grid">
            <div 
              v-for="system in climateGroup" 
              :key="system.id"
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
                title="Einstellungen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Safety Section -->
        <div class="section">
          <h3 class="section-title">🚨 Sicherheit</h3>
          <div class="controls-grid">
            <div 
              v-for="system in safetyGroup" 
              :key="system.id"
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
                title="Einstellungen"
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
        <h2>Systemübersicht</h2>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon active-icon">⚡</div>
            <div class="stat-info">
              <p class="stat-label">Aktive Geräte</p>
              <p class="stat-value">{{ activeSystemsCount }} / {{ totalSystemsCount }}</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon temp-icon">🌡️</div>
            <div class="stat-info">
              <p class="stat-label">Raumtemperatur</p>
              <p class="stat-value">{{ currentTemp }}°C</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon power-icon">🔌</div>
            <div class="stat-info">
              <p class="stat-label">Stromverbrauch</p>
              <p class="stat-value">{{ powerConsumption }} kW</p>
            </div>
          </div>
          
          <div class="stat-card warning-card">
            <div class="stat-icon warning-icon">⚠️</div>
            <div class="stat-info">
              <p class="stat-label">Nicht in Funktion</p>
              <p class="stat-value">{{ outOfOrderCount }}</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h3>Schnellaktionen</h3>
          <div class="action-buttons">
            <button @click="activateGeneralSystems" class="action-btn success">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              Generelle Systeme Ein
            </button>
            <button @click="activateAllMachines" class="action-btn primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              Alle Maschinen Ein
            </button>
            <button @click="deactivateAllMachines" class="action-btn secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
              </svg>
              Alle Maschinen Aus
            </button>
            <button @click="activateLighting" class="action-btn warning">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
              Beleuchtung An
            </button>
            <button @click="toggleTimerPause" :class="['action-btn', timerPaused ? 'timer-active' : 'timer-paused']">
              <svg v-if="!timerPaused" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              {{ timerPaused ? 'Aktivität Fortsetzen' : 'Aktivität Pause' }}
            </button>
          </div>
        </div>

        <!-- Out of Order List -->
        <div v-if="outOfOrderDevices.length > 0" class="out-of-order-list">
          <h3>⚠️ Defekte Geräte</h3>
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
const isLoading = ref(false)
const loadingMessage = ref('')
const activeModal = ref<string | null>(null)
const currentTemp = ref(22.0)
const powerConsumption = ref(0)

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
    systems.value[key] && deviceStatus.value[key] !== 'outOfOrder'
  ).length
})

const totalSystemsCount = computed(() => {
  return allSystems.length
})

const outOfOrderCount = computed(() => {
  return Object.keys(deviceStatus.value).filter(key => 
    deviceStatus.value[key] === 'outOfOrder'
  ).length
})

const outOfOrderDevices = computed(() => {
  return allSystems.filter(system => deviceStatus.value[system.id] === 'outOfOrder')
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
  return system ? `${system.name}` : 'System Einstellungen'
}

const getSystemStatus = (systemId: string) => {
  if (deviceStatus.value[systemId] === 'outOfOrder') {
    return '⚠️ Nicht in Funktion'
  }
  
  const isActive = systems.value[systemId]
  if (systemId === 'notaus') return isActive ? '🚨 AKTIV' : 'Bereit'
  if (systemId === 'tuer') return isActive ? 'Offen' : 'Verriegelt'
  return isActive ? 'EIN' : 'AUS'
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
    if (!systems.value[system.id] && deviceStatus.value[system.id] !== 'outOfOrder' && system.id !== 'notlicht') {
      await toggleSystem(system.id)
    }
  }
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
  })
  
  // Load saved states
  if (typeof window !== 'undefined') {
    const savedSystems = localStorage.getItem('workshopSystems')
    const savedConfig = localStorage.getItem('workshopConfig')
    const savedStatus = localStorage.getItem('deviceStatus')
    const savedNotes = localStorage.getItem('deviceNotes')
    
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
  }
  
  // Start timers
  updateDateTime()
  clockTimer = setInterval(updateDateTime, 1000)
  
  sessionTimer = setInterval(() => {
    if (!timerPaused.value) {
      if (sessionExpireCountdown.value > 0) {
        sessionExpireCountdown.value--
      } else {
        sessionExpireCountdown.value = 30
      }
    }
  }, 1000)
  
  // Update temperature periodically
  setInterval(() => {
    const machineCount = machinesGroup.filter(m => systems.value[m.id]).length
    const targetTemp = 21.0 + (machineCount * 0.3)
    currentTemp.value += (targetTemp - currentTemp.value) * 0.1
    currentTemp.value = Math.round(currentTemp.value * 10) / 10
  }, 5000)
})

onUnmounted(() => {
  if (sessionTimer) clearInterval(sessionTimer)
  if (clockTimer) clearInterval(clockTimer)
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
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(10px);
}

.spinner {
  width: 80px;
  height: 80px;
  border: 8px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-screen p {
  margin-top: 24px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  max-width: 400px;
  padding: 0 20px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
  padding: 20px;
}

.modal-content {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  color: white;
  font-size: 22px;
  font-weight: 700;
}

.close-button {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.05);
}

.close-button svg {
  width: 24px;
  height: 24px;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.config-section {
  margin-bottom: 20px;
}

.config-heading {
  color: #60a5fa;
  font-size: 16px;
  font-weight: 600;
  margin: 20px 0 12px 0;
}

.config-item {
  margin-bottom: 16px;
}

.config-item label {
  display: block;
  color: #cbd5e1;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.config-item input[type="range"],
.config-item input[type="number"],
.config-item input[type="time"],
.config-item select,
.config-item textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px;
  color: white;
  font-size: 14px;
  font-family: inherit;
}

.config-item textarea {
  resize: vertical;
  min-height: 60px;
}

.value-display {
  display: inline-block;
  margin-left: 12px;
  color: #60a5fa;
  font-weight: 600;
  font-size: 14px;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
}

/* Dashboard */
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
}

.header {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h1 {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.date-time {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #94a3b8;
}

.circular-timer {
  position: relative;
}

.session-label {
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 8px;
}

.timer-text {
  fill: white;
  font-size: 16px;
  font-weight: 700;
}

/* Main Content */
.main-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
}

.control-panel h2,
.stats-panel h2 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #f1f5f9;
}

/* Sections */
.section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(59, 130, 246, 0.3);
}

/* Controls Grid */
.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.control-card {
  background: rgba(30, 41, 59, 0.6);
  border: 2px solid rgba(71, 85, 105, 0.3);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.control-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: transparent;
  transition: all 0.3s ease;
}

.control-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-color: rgba(96, 165, 250, 0.5);
}

.control-card.active {
  background: rgba(59, 130, 246, 0.15);
  border-color: #3b82f6;
}

.control-card.active::before {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.control-card.out-of-order {
  background: rgba(239, 68, 68, 0.15);
  border-color: #ef4444;
  cursor: not-allowed;
}

.control-card.out-of-order::before {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.control-card.emergency {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  animation: pulse-red 2s ease-in-out infinite;
}

@keyframes pulse-red {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
}

.control-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  color: #94a3b8;
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

.control-info {
  margin-bottom: 8px;
}

.control-name {
  font-size: 15px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.control-status {
  font-size: 12px;
  color: #64748b;
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #94a3b8;
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
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: rotate(90deg);
}

.config-btn svg {
  width: 20px;
  height: 20px;
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
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-card.warning-card {
  border-color: rgba(239, 68, 68, 0.5);
}

.stat-icon {
  font-size: 32px;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.active-icon {
  background: rgba(59, 130, 246, 0.1);
}

.temp-icon {
  background: rgba(251, 146, 60, 0.1);
}

.power-icon {
  background: rgba(34, 197, 94, 0.1);
}

.warning-icon {
  background: rgba(239, 68, 68, 0.1);
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: white;
}

/* Quick Actions */
.quick-actions {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.quick-actions h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #f1f5f9;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  padding: 14px 20px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-btn svg {
  width: 20px;
  height: 20px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
}

.action-btn.secondary {
  background: rgba(71, 85, 105, 0.3);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.action-btn.secondary:hover {
  background: rgba(71, 85, 105, 0.5);
}

.action-btn.warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.action-btn.warning:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3);
}

.action-btn.success {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.action-btn.success:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
}

.action-btn.timer-paused {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.action-btn.timer-paused:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.5);
}

.action-btn.timer-active {
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.action-btn.timer-active:hover {
  background: rgba(34, 197, 94, 0.3);
  border-color: rgba(34, 197, 94, 0.5);
}

/* Out of Order List */
.out-of-order-list {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 20px;
}

.out-of-order-list h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #fca5a5;
}

.defect-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.defect-item {
  background: rgba(30, 41, 59, 0.6);
  padding: 12px;
  border-radius: 8px;
  border-left: 3px solid #ef4444;
}

.defect-name {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
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
