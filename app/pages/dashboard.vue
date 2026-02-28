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
        <!-- Door Configuration -->
        <div v-if="activeModal === 'door'" class="config-section">
          <div class="config-item">
            <label>Auto-Lock Delay (seconds)</label>
            <input type="number" v-model="config.door.autoLockDelay" min="0" max="300" @click.stop />
          </div>
          <div class="config-item">
            <label>Access Code</label>
            <input type="text" v-model="config.door.accessCode" maxlength="6" @click.stop />
          </div>
          <div class="config-item">
            <label>Door Type</label>
            <select v-model="config.door.type" @click.stop>
              <option value="sliding">Sliding</option>
              <option value="swing">Swing</option>
              <option value="automatic">Automatic</option>
            </select>
          </div>
        </div>

        <!-- Light Configuration -->
        <div v-if="activeModal === 'light'" class="config-section">
          <div class="config-item">
            <label>Light Color</label>
            <input type="color" v-model="config.light.color" class="color-picker" @click.stop />
          </div>
          <div class="config-item">
            <label>Brightness (%)</label>
            <input type="range" v-model="config.light.brightness" min="0" max="100" @click.stop />
            <span class="value-display">{{ config.light.brightness }}%</span>
          </div>
          <div class="config-item">
            <label>Mode</label>
            <select v-model="config.light.mode" @click.stop>
              <option value="constant">Constant</option>
              <option value="dimmed">Dimmed</option>
              <option value="pulsing">Pulsing</option>
            </select>
          </div>
        </div>

        <!-- Air Conditioning Configuration -->
        <div v-if="activeModal === 'aircon'" class="config-section">
          <div class="config-item">
            <label>Temperature (°C)</label>
            <input type="range" v-model="config.aircon.temperature" min="16" max="30" step="0.5" @click.stop />
            <span class="value-display">{{ config.aircon.temperature }}°C</span>
          </div>
          <div class="config-item">
            <label>Fan Speed</label>
            <select v-model="config.aircon.fanSpeed" @click.stop>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div class="config-item">
            <label>Zone</label>
            <select v-model="config.aircon.zone" @click.stop>
              <option value="front">Front</option>
              <option value="rear">Rear</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>

        <!-- Sound System Configuration -->
        <div v-if="activeModal === 'sound'" class="config-section">
          <div class="config-item">
            <label>Volume (%)</label>
            <input type="range" v-model="config.sound.volume" min="0" max="100" @click.stop />
            <span class="value-display">{{ config.sound.volume }}%</span>
          </div>
          <div class="config-item">
            <label>Bass Level</label>
            <input type="range" v-model="config.sound.bass" min="0" max="100" @click.stop />
            <span class="value-display">{{ config.sound.bass }}%</span>
          </div>
          <div class="config-item">
            <label>Audio Source</label>
            <select v-model="config.sound.source" @click.stop>
              <option value="simulator">Simulator</option>
              <option value="bluetooth">Bluetooth</option>
              <option value="aux">AUX</option>
            </select>
          </div>
        </div>

        <!-- Motion Platform Configuration -->
        <div v-if="activeModal === 'motion'" class="config-section">
          <div class="config-item">
            <label>Intensity (%)</label>
            <input type="range" v-model="config.motion.intensity" min="0" max="100" @click.stop />
            <span class="value-display">{{ config.motion.intensity }}%</span>
          </div>
          <div class="config-item">
            <label>Pitch Sensitivity</label>
            <input type="range" v-model="config.motion.pitch" min="0" max="100" @click.stop />
            <span class="value-display">{{ config.motion.pitch }}%</span>
          </div>
          <div class="config-item">
            <label>Roll Sensitivity</label>
            <input type="range" v-model="config.motion.roll" min="0" max="100" @click.stop />
            <span class="value-display">{{ config.motion.roll }}%</span>
          </div>
        </div>

        <!-- VR System Configuration -->
        <div v-if="activeModal === 'vr'" class="config-section">
          <div class="config-item">
            <label>Resolution</label>
            <select v-model="config.vr.resolution" @click.stop>
              <option value="1080p">1080p</option>
              <option value="2k">2K</option>
              <option value="4k">4K</option>
            </select>
          </div>
          <div class="config-item">
            <label>Refresh Rate (Hz)</label>
            <select v-model="config.vr.refreshRate" @click.stop>
              <option value="60">60 Hz</option>
              <option value="90">90 Hz</option>
              <option value="120">120 Hz</option>
            </select>
          </div>
          <div class="config-item">
            <label>IPD (mm)</label>
            <input type="range" v-model="config.vr.ipd" min="58" max="72" step="0.5" @click.stop />
            <span class="value-display">{{ config.vr.ipd }} mm</span>
          </div>
          <div class="config-item">
            <label>Tracking Mode</label>
            <select v-model="config.vr.tracking" @click.stop>
              <option value="inside-out">Inside-Out</option>
              <option value="outside-in">Outside-In</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </div>

        <!-- Hydraulics Configuration -->
        <div v-if="activeModal === 'hydraulics'" class="config-section">
          <div class="config-item">
            <label>Pressure (PSI)</label>
            <input type="range" v-model="config.hydraulics.pressure" min="1000" max="3000" step="100" @click.stop />
            <span class="value-display">{{ config.hydraulics.pressure }} PSI</span>
          </div>
          <div class="config-item">
            <label>Flow Rate (L/min)</label>
            <input type="range" v-model="config.hydraulics.flowRate" min="10" max="100" @click.stop />
            <span class="value-display">{{ config.hydraulics.flowRate }} L/min</span>
          </div>
          <div class="config-item">
            <label>Safety Cutoff</label>
            <select v-model="config.hydraulics.safetyCutoff" @click.stop>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <div class="config-item">
            <label>Response Time (ms)</label>
            <input type="range" v-model="config.hydraulics.responseTime" min="10" max="200" @click.stop />
            <span class="value-display">{{ config.hydraulics.responseTime }} ms</span>
          </div>
        </div>

        <!-- Screens Configuration -->
        <div v-if="activeModal === 'screens'" class="config-section">
          <div class="config-item">
            <label>Brightness (%)</label>
            <input type="range" v-model="config.screens.brightness" min="0" max="100" @click.stop />
            <span class="value-display">{{ config.screens.brightness }}%</span>
          </div>
          <div class="config-item">
            <label>Contrast</label>
            <input type="range" v-model="config.screens.contrast" min="0" max="100" @click.stop />
            <span class="value-display">{{ config.screens.contrast }}%</span>
          </div>
          <div class="config-item">
            <label>Color Temperature</label>
            <select v-model="config.screens.colorTemp" @click.stop>
              <option value="warm">Warm (3000K)</option>
              <option value="neutral">Neutral (6500K)</option>
              <option value="cool">Cool (9000K)</option>
            </select>
          </div>
          <div class="config-item">
            <label>Bezel Correction</label>
            <select v-model="config.screens.bezelCorrection" @click.stop>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>

        <!-- Projector Configuration -->
        <div v-if="activeModal === 'projector'" class="config-section">
          <div class="config-item">
            <label>Brightness (Lumens)</label>
            <input type="range" v-model="config.projector.lumens" min="1000" max="5000" step="100" @click.stop />
            <span class="value-display">{{ config.projector.lumens }} lm</span>
          </div>
          <div class="config-item">
            <label>Keystone Correction</label>
            <input type="range" v-model="config.projector.keystone" min="-40" max="40" @click.stop />
            <span class="value-display">{{ config.projector.keystone }}°</span>
          </div>
          <div class="config-item">
            <label>Aspect Ratio</label>
            <select v-model="config.projector.aspectRatio" @click.stop>
              <option value="16:9">16:9</option>
              <option value="21:9">21:9</option>
              <option value="4:3">4:3</option>
            </select>
          </div>
          <div class="config-item">
            <label>Lamp Mode</label>
            <select v-model="config.projector.lampMode" @click.stop>
              <option value="eco">Eco</option>
              <option value="normal">Normal</option>
              <option value="bright">Bright</option>
            </select>
          </div>
        </div>

        <!-- Flight Controls Configuration -->
        <div v-if="activeModal === 'controls'" class="config-section">
          <div class="config-item">
            <label>Sensitivity</label>
            <input type="range" v-model="config.controls.sensitivity" min="0" max="100" @click.stop />
            <span class="value-display">{{ config.controls.sensitivity }}%</span>
          </div>
          <div class="config-item">
            <label>Deadzone (%)</label>
            <input type="range" v-model="config.controls.deadzone" min="0" max="20" @click.stop />
            <span class="value-display">{{ config.controls.deadzone }}%</span>
          </div>
          <div class="config-item">
            <label>Force Feedback</label>
            <input type="range" v-model="config.controls.forceFeedback" min="0" max="100" @click.stop />
            <span class="value-display">{{ config.controls.forceFeedback }}%</span>
          </div>
          <div class="config-item">
            <label>Calibration Mode</label>
            <select v-model="config.controls.calibration" @click.stop>
              <option value="auto">Auto</option>
              <option value="manual">Manual</option>
              <option value="preset1">Preset 1 - Cessna</option>
              <option value="preset2">Preset 2 - Boeing</option>
            </select>
          </div>
        </div>

        <!-- Recording Configuration -->
        <div v-if="activeModal === 'recording'" class="config-section">
          <div class="config-item">
            <label>Video Quality</label>
            <select v-model="config.recording.quality" @click.stop>
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
              <option value="4k">4K</option>
            </select>
          </div>
          <div class="config-item">
            <label>Frame Rate</label>
            <select v-model="config.recording.fps" @click.stop>
              <option value="30">30 FPS</option>
              <option value="60">60 FPS</option>
              <option value="120">120 FPS</option>
            </select>
          </div>
          <div class="config-item">
            <label>Audio Bitrate</label>
            <select v-model="config.recording.audioBitrate" @click.stop>
              <option value="128">128 kbps</option>
              <option value="256">256 kbps</option>
              <option value="320">320 kbps</option>
            </select>
          </div>
          <div class="config-item">
            <label>Storage Path</label>
            <input type="text" v-model="config.recording.path" @click.stop />
          </div>
        </div>

        <!-- Emergency Configuration -->
        <div v-if="activeModal === 'emergency'" class="config-section">
          <div class="config-item">
            <label>Emergency Type</label>
            <select v-model="config.emergency.type" @click.stop>
              <option value="full">Full Stop - All Systems</option>
              <option value="motion">Motion Only</option>
              <option value="power">Power Cut</option>
            </select>
          </div>
          <div class="config-item">
            <label>Response Time (ms)</label>
            <input type="range" v-model="config.emergency.responseTime" min="10" max="500" @click.stop />
            <span class="value-display">{{ config.emergency.responseTime }} ms</span>
          </div>
          <div class="config-item">
            <label>Override Code</label>
            <input type="password" v-model="config.emergency.overrideCode" maxlength="6" @click.stop />
          </div>
          <div class="config-item">
            <label>Auto Reset</label>
            <select v-model="config.emergency.autoReset" @click.stop>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>

        <!-- Communications Configuration -->
        <div v-if="activeModal === 'comms'" class="config-section">
          <div class="config-item">
            <label>Radio Frequency (MHz)</label>
            <input type="number" v-model="config.comms.frequency" min="118" max="137" step="0.025" @click.stop />
          </div>
          <div class="config-item">
            <label>Squelch Level</label>
            <input type="range" v-model="config.comms.squelch" min="0" max="100" @click.stop />
            <span class="value-display">{{ config.comms.squelch }}%</span>
          </div>
          <div class="config-item">
            <label>Voice Activation</label>
            <select v-model="config.comms.vox" @click.stop>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <div class="config-item">
            <label>Echo Cancellation</label>
            <select v-model="config.comms.echo" @click.stop>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>

        <!-- Security Camera Configuration -->
        <div v-if="activeModal === 'securityCamera'" class="config-section">
          <div class="config-item">
            <label>Recording Mode</label>
            <select v-model="config.securityCamera.mode" @click.stop>
              <option value="continuous">Continuous</option>
              <option value="motion">Motion Detection</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          <div class="config-item">
            <label>Resolution</label>
            <select v-model="config.securityCamera.resolution" @click.stop>
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
              <option value="4k">4K</option>
            </select>
          </div>
          <div class="config-item">
            <label>Night Vision</label>
            <select v-model="config.securityCamera.nightVision" @click.stop>
              <option value="auto">Auto</option>
              <option value="on">On</option>
              <option value="off">Off</option>
            </select>
          </div>
          <div class="config-item">
            <label>Retention Days</label>
            <input type="number" v-model="config.securityCamera.retention" min="1" max="90" @click.stop />
          </div>
        </div>

        <!-- System Shutdown Configuration -->
        <div v-if="activeModal === 'systemShutdown'" class="config-section">
          <div class="config-item">
            <label>Shutdown Type</label>
            <select v-model="config.systemShutdown.type" @click.stop>
              <option value="graceful">Graceful (Save State)</option>
              <option value="immediate">Immediate</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          <div class="config-item">
            <label>Delay (seconds)</label>
            <input type="number" v-model="config.systemShutdown.delay" min="0" max="300" @click.stop />
          </div>
          <div class="config-item">
            <label>Notification</label>
            <select v-model="config.systemShutdown.notify" @click.stop>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <div class="config-item">
            <label>Confirmation Required</label>
            <select v-model="config.systemShutdown.confirmation" @click.stop>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        <!-- Generic Advanced Configuration -->
        <div v-if="!['door', 'light', 'aircon', 'sound', 'motion', 'vr', 'hydraulics', 'screens', 'projector', 'controls', 'recording', 'emergency', 'comms', 'securityCamera', 'systemShutdown'].includes(activeModal)" class="config-section">
          <h3 class="config-heading">Basic Settings</h3>
          <div class="config-item">
            <label>Power Level (%)</label>
            <input type="range" v-model="genericConfig.power" min="0" max="100" @click.stop />
            <span class="value-display">{{ genericConfig.power }}%</span>
          </div>
          <div class="config-item">
            <label>Operating Mode</label>
            <select v-model="genericConfig.mode" @click.stop>
              <option value="eco">Eco</option>
              <option value="normal">Normal</option>
              <option value="performance">Performance</option>
            </select>
          </div>
          <div class="config-item">
            <label>Priority Level</label>
            <select v-model="genericConfig.priority" @click.stop>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          
          <h3 class="config-heading">Automation</h3>
          <div class="config-item">
            <label>Auto-Start Time</label>
            <input type="time" v-model="genericConfig.autoStartTime" @click.stop />
          </div>
          <div class="config-item">
            <label>Auto-Shutdown (minutes)</label>
            <input type="number" v-model="genericConfig.autoShutdown" min="0" max="240" @click.stop />
          </div>
          <div class="config-item">
            <label>Scheduled Days</label>
            <select v-model="genericConfig.scheduleDays" multiple @click.stop class="multi-select">
              <option value="mon">Monday</option>
              <option value="tue">Tuesday</option>
              <option value="wed">Wednesday</option>
              <option value="thu">Thursday</option>
              <option value="fri">Friday</option>
              <option value="sat">Saturday</option>
              <option value="sun">Sunday</option>
            </select>
          </div>
          
          <h3 class="config-heading">Monitoring & Safety</h3>
          <div class="config-item">
            <label>Enable Diagnostics</label>
            <select v-model="genericConfig.diagnostics" @click.stop>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <div class="config-item">
            <label>Temperature Alert (°C)</label>
            <input type="number" v-model="genericConfig.tempAlert" min="30" max="100" @click.stop />
          </div>
          <div class="config-item">
            <label>Error Notification</label>
            <select v-model="genericConfig.errorNotify" @click.stop>
              <option value="immediate">Immediate</option>
              <option value="batch">Batch (hourly)</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <div class="footer-left">
          <button class="btn-preset" @click.stop="loadPreset('low')" title="Low Performance Preset">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" />
            </svg>
            Low
          </button>
          <button class="btn-preset" @click.stop="loadPreset('medium')" title="Medium Performance Preset">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z" />
            </svg>
            Medium
          </button>
          <button class="btn-preset" @click.stop="loadPreset('high')" title="High Performance Preset">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            High
          </button>
        </div>
        <div class="footer-right">
          <button class="btn-secondary" @click.stop="closeModal">Cancel</button>
          <button class="btn-primary" @click.stop="saveConfiguration">Save Configuration</button>
        </div>
      </div>
    </div>
  </div>

  <div class="dashboard-container" @click="resetTimer">
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <h1>Flight Sim Control Panel</h1>
          <div class="date-time">
            <p class="date">{{ currentDate }}</p>
            <p class="time">{{ currentTime }}</p>
          </div>
        </div>
        
        <div class="header-right">
          <div class="session-info">
            <p class="session-label">Activity</p>
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
        <h2>System Controls - Admin Panel</h2>
        
        <div class="controls-grid">
          <!-- Iterate through all systems -->
          <div 
            v-for="system in allSystems" 
            :key="system.id"
            class="control-card"
            :class="{ 
              active: systems[system.id], 
              locked: system.id === 'door' && !systems[system.id],
              emergency: (system.id === 'emergency' || system.id === 'systemShutdown' || system.id === 'systemRestart') && systems[system.id],
              systemShutdown: system.id === 'systemShutdown',
              systemRestart: system.id === 'systemRestart'
            }"
          >
            <div class="control-icon" @click.stop="toggleSystem(system.id)">
              <component :is="'svg'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" :d="system.icon" />
              </component>
            </div>
            <h3 @click.stop="toggleSystem(system.id)">{{ system.name }}</h3>
            <p class="status" @click.stop="toggleSystem(system.id)">{{ getSystemStatus(system.id) }}</p>
            <button class="config-btn" @click.stop="openModal(system.id)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
    
    <footer class="footer">
      <div class="footer-content">
        <p class="footer-text">© 2026 Simnova Flight Simulator - Staff Control Panel</p>
        <NuxtLink to="/login">
          <button class="logout-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            Logout
          </button>
        </NuxtLink>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentDate = ref('')
const currentTime = ref('')
const sessionExpireCountdown = ref(30)
const isLoading = ref(false)
const loadingMessage = ref('')
const activeModal = ref<string | null>(null)
const genericConfig = ref({ 
  power: 50, 
  mode: 'normal', 
  priority: 'medium',
  autoStartTime: '08:00',
  autoShutdown: 30,
  scheduleDays: [],
  diagnostics: 'enabled',
  tempAlert: 70,
  errorNotify: 'immediate'
})

// System states - 40+ systems for complete admin control
const systems = ref<Record<string, boolean>>({
  door: false,
  light: false,
  aircon: false,
  sound: false,
  motion: false,
  vr: false,
  hydraulics: false,
  screens: false,
  projector: false,
  isolation: false,
  ventilation: false,
  seat: false,
  controls: false,
  instruments: false,
  comms: false,
  recording: false,
  emergency: false,
  heating: false,
  cooling: false,
  humidity: false,
  airQuality: false,
  fireSupression: false,
  smokeDetection: false,
  securityCamera: false,
  accessControl: false,
  intercom: false,
  ambientLight: false,
  taskLight: false,
  emergencyLight: false,
  powerBackup: false,
  mainPower: false,
  dataLogging: false,
  networkSwitch: false,
  wifiRouter: false,
  bluetooth: false,
  floorVibration: false,
  seatBelt: false,
  pedals: false,
  yoke: false,
  throttle: false,
  sessionLog: false,
  systemShutdown: false,
  systemRestart: false,
})

// Configuration objects for different systems
const config = ref({
  door: {
    autoLockDelay: 30,
    accessCode: '123456',
    type: 'sliding'
  },
  light: {
    color: '#fbbf24',
    brightness: 80,
    mode: 'constant'
  },
  aircon: {
    temperature: 22,
    fanSpeed: 'auto',
    zone: 'all'
  },
  sound: {
    volume: 70,
    bass: 50,
    source: 'simulator'
  },
  motion: {
    intensity: 75,
    pitch: 80,
    roll: 80
  },
  vr: {
    resolution: '4k',
    refreshRate: '90',
    ipd: 63,
    tracking: 'inside-out'
  },
  hydraulics: {
    pressure: 2000,
    flowRate: 50,
    safetyCutoff: 'enabled',
    responseTime: 50
  },
  screens: {
    brightness: 80,
    contrast: 50,
    colorTemp: 'neutral',
    bezelCorrection: 'enabled'
  },
  projector: {
    lumens: 3000,
    keystone: 0,
    aspectRatio: '16:9',
    lampMode: 'normal'
  },
  controls: {
    sensitivity: 75,
    deadzone: 5,
    forceFeedback: 60,
    calibration: 'auto'
  },
  recording: {
    quality: '1080p',
    fps: '60',
    audioBitrate: '256',
    path: '/recordings/session'
  },
  emergency: {
    type: 'full',
    responseTime: 100,
    overrideCode: '',
    autoReset: 'disabled'
  },
  comms: {
    frequency: 122.8,
    squelch: 50,
    vox: 'disabled',
    echo: 'enabled'
  },
  securityCamera: {
    mode: 'continuous',
    resolution: '1080p',
    nightVision: 'auto',
    retention: 30
  },
  systemShutdown: {
    type: 'graceful',
    delay: 10,
    notify: 'enabled',
    confirmation: 'yes'
  }
})

// System definitions with icons and status
const allSystems = [
  { id: 'door', name: 'Door Lock', icon: 'M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z' },
  { id: 'light', name: 'Main Lighting', icon: 'M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18' },
  { id: 'aircon', name: 'Air Conditioning', icon: 'M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z' },
  { id: 'sound', name: 'Sound System', icon: 'M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z' },
  { id: 'motion', name: 'Motion Platform', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
  { id: 'vr', name: 'VR System', icon: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'hydraulics', name: 'Hydraulics', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'screens', name: 'Display Screens', icon: 'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25' },
  { id: 'projector', name: 'Projector', icon: 'M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375a1.125 1.125 0 00-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h17.25a1.125 1.125 0 001.125-1.125V5.625a1.125 1.125 0 00-1.125-1.125z' },
  { id: 'isolation', name: 'Sound Isolation', icon: 'M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z' },
  { id: 'ventilation', name: 'Ventilation', icon: 'M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5' },
  { id: 'seat', name: 'Seat Position', icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12' },
  { id: 'controls', name: 'Flight Controls', icon: 'M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z' },
  { id: 'instruments', name: 'Instruments', icon: 'M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z' },
  { id: 'comms', name: 'Communications', icon: 'M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z' },
  { id: 'recording', name: 'Session Recording', icon: 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z' },
  { id: 'emergency', name: 'Emergency Stop', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' },
  { id: 'heating', name: 'Floor Heating', icon: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z' },
  { id: 'cooling', name: 'Cooling System', icon: 'M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z' },
  { id: 'humidity', name: 'Humidity Control', icon: 'M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z' },
  { id: 'airQuality', name: 'Air Quality Monitor', icon: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z' },
  { id: 'fireSupression', name: 'Fire Suppression', icon: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z M7.5 14.25h9m-9 3h9' },
  { id: 'smokeDetection', name: 'Smoke Detection', icon: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5' },
  { id: 'securityCamera', name: 'Security Cameras', icon: 'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z' },
  { id: 'accessControl', name: 'Access Control', icon: 'M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z' },
  { id: 'intercom', name: 'Intercom System', icon: 'M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46' },
  { id: 'ambientLight', name: 'Ambient Lighting', icon: 'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z' },
  { id: 'taskLight', name: 'Task Lighting', icon: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' },
  { id: 'emergencyLight', name: 'Emergency Lighting', icon: 'M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z' },
  { id: 'powerBackup', name: 'Backup Power', icon: 'M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z' },
  { id: 'mainPower', name: 'Main Power', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
  { id: 'dataLogging', name: 'Data Logging', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
  { id: 'networkSwitch', name: 'Network Switch', icon: 'M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 010 4.5h-9A2.25 2.25 0 015.25 7.5zm0 9A2.25 2.25 0 017.5 14.25h9a2.25 2.25 0 010 4.5h-9A2.25 2.25 0 015.25 16.5z M18 12.75h.008v.008H18v-.008zM18 21.75h.008v.008H18v-.008zM6 3.75h.008v.008H6v-.008zM6 12.75h.008v.008H6v-.008z' },
  { id: 'wifiRouter', name: 'WiFi Router', icon: 'M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z' },
  { id: 'bluetooth', name: 'Bluetooth', icon: 'M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5' },
  { id: 'floorVibration', name: 'Floor Vibration', icon: 'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z' },
  { id: 'seatBelt', name: 'Seat Belt Lock', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
  { id: 'pedals', name: 'Rudder Pedals', icon: 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z' },
  { id: 'yoke', name: 'Control Yoke', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'throttle', name: 'Throttle Control', icon: 'M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5' },
  { id: 'sessionLog', name: 'Session Logging', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { id: 'systemShutdown', name: 'System Shutdown', icon: 'M5.636 5.636a9 9 0 1012.728 0M12 3v9' },
  { id: 'systemRestart', name: 'System Restart', icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99' },
]

const systemMessages: Record<string, { on: string; off: string }> = {
  door: { on: 'Unlocking Door...', off: 'Locking Door...' },
  light: { on: 'Turning On Lights...', off: 'Turning Off Lights...' },
  aircon: { on: 'Activating Air Conditioning...', off: 'Deactivating Air Conditioning...' },
  sound: { on: 'Powering Sound System...', off: 'Shutting Down Sound System...' },
  motion: { on: 'Activating Motion Platform...', off: 'Deactivating Motion Platform...' },
  vr: { on: 'Starting VR System...', off: 'Shutting Down VR System...' },
  hydraulics: { on: 'Pressurizing Hydraulics...', off: 'Depressurizing Hydraulics...' },
  screens: { on: 'Powering Screens...', off: 'Shutting Down Screens...' },
  projector: { on: 'Starting Projector...', off: 'Shutting Down Projector...' },
  isolation: { on: 'Activating Sound Isolation...', off: 'Deactivating Sound Isolation...' },
  ventilation: { on: 'Starting Ventilation...', off: 'Stopping Ventilation...' },
  seat: { on: 'Adjusting Seat Position...', off: 'Resetting Seat Position...' },
  controls: { on: 'Calibrating Flight Controls...', off: 'Disabling Flight Controls...' },
  instruments: { on: 'Booting Instruments...', off: 'Shutting Down Instruments...' },
  comms: { on: 'Connecting Communications...', off: 'Disconnecting Communications...' },
  recording: { on: 'Starting Recording...', off: 'Stopping Recording...' },
  emergency: { on: 'ACTIVATING EMERGENCY STOP...', off: 'Deactivating Emergency Stop...' },
  heating: { on: 'Activating Floor Heating...', off: 'Turning Off Heating...' },
  cooling: { on: 'Activating Cooling...', off: 'Turning Off Cooling...' },
  humidity: { on: 'Adjusting Humidity...', off: 'Disabling Humidity Control...' },
  airQuality: { on: 'Starting Air Quality Monitor...', off: 'Stopping Monitoring...' },
  fireSupression: { on: 'Arming Fire Suppression...', off: 'Disarming Fire Suppression...' },
  smokeDetection: { on: 'Activating Smoke Detection...', off: 'Deactivating Smoke Detection...' },
  securityCamera: { on: 'Starting Cameras...', off: 'Stopping Cameras...' },
  accessControl: { on: 'Enabling Access Control...', off: 'Disabling Access Control...' },
  intercom: { on: 'Opening Intercom...', off: 'Closing Intercom...' },
  ambientLight: { on: 'Turning On Ambient Light...', off: 'Turning Off Ambient Light...' },
  taskLight: { on: 'Turning On Task Light...', off: 'Turning Off Task Light...' },
  emergencyLight: { on: 'Activating Emergency Lights...', off: 'Deactivating Emergency Lights...' },
  powerBackup: { on: 'Switching to Backup Power...', off: 'Switching to Main Power...' },
  mainPower: { on: 'Restoring Main Power...', off: 'Cutting Main Power...' },
  dataLogging: { on: 'Starting Data Logging...', off: 'Stopping Data Logging...' },
  networkSwitch: { on: 'Powering Network Switch...', off: 'Shutting Down Network...' },
  wifiRouter: { on: 'Starting WiFi Router...', off: 'Shutting Down WiFi...' },
  bluetooth: { on: 'Enabling Bluetooth...', off: 'Disabling Bluetooth...' },
  floorVibration: { on: 'Activating Floor Vibration...', off: 'Deactivating Vibration...' },
  seatBelt: { on: 'Unlocking Seat Belt...', off: 'Locking Seat Belt...' },
  pedals: { on: 'Calibrating Pedals...', off: 'Disabling Pedals...' },
  yoke: { on: 'Calibrating Yoke...', off: 'Disabling Yoke...' },
  throttle: { on: 'Calibrating Throttle...', off: 'Disabling Throttle...' },
  sessionLog: { on: 'Starting Session Logging...', off: 'Stopping Logging...' },
  systemShutdown: { on: 'SHUTTING DOWN SYSTEM...', off: 'Cancelling Shutdown...' },
  systemRestart: { on: 'RESTARTING SYSTEM...', off: 'Cancelling Restart...' },
}

// Loading times in milliseconds based on system complexity
const loadingTimes: Record<string, number> = {
  // Quick operations (500ms)
  light: 500,
  ambientLight: 500,
  taskLight: 500,
  emergencyLight: 500,
  sound: 500,
  dataLogging: 500,
  sessionLog: 500,
  bluetooth: 500,
  wifiRouter: 500,
  
  // Medium operations (1000ms)
  door: 1000,
  aircon: 1000,
  heating: 1000,
  cooling: 1000,
  humidity: 1000,
  ventilation: 1000,
  seat: 1000,
  seatBelt: 1000,
  recording: 1000,
  comms: 1000,
  intercom: 1000,
  airQuality: 1000,
  securityCamera: 1000,
  accessControl: 1000,
  networkSwitch: 1000,
  
  // Longer operations (2000ms)
  motion: 2000,
  hydraulics: 2000,
  vr: 2000,
  screens: 2000,
  projector: 2000,
  controls: 2000,
  instruments: 2000,
  pedals: 2000,
  yoke: 2000,
  throttle: 2000,
  floorVibration: 2000,
  
  // System-critical operations (3000ms)
  isolation: 3000,
  fireSupression: 3000,
  smokeDetection: 3000,
  powerBackup: 3000,
  mainPower: 3000,
  emergency: 3000,
  systemShutdown: 3000,
  systemRestart: 3000,
}

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
  return system ? `Configure ${system.name}` : 'Configure System'
}

const getSystemStatus = (systemId: string) => {
  const isActive = systems.value[systemId]
  if (systemId === 'door') return isActive ? 'Unlocked' : 'Locked'
  if (systemId === 'emergency') return isActive ? 'ACTIVE' : 'Standby'
  if (systemId === 'systemShutdown') return isActive ? 'SHUTTING DOWN' : 'Ready'
  if (systemId === 'systemRestart') return isActive ? 'RESTARTING' : 'Ready'
  if (systemId === 'sessionLog') return isActive ? 'Logging' : 'Stopped'
  return isActive ? 'On' : 'Off'
}

const openModal = (systemId: string) => {
  resetTimer()
  activeModal.value = systemId
}

const closeModal = () => {
  resetTimer()
  activeModal.value = null
}

const saveConfiguration = () => {
  resetTimer()
  if (typeof window !== 'undefined') {
    localStorage.setItem('flightSimConfig', JSON.stringify(config.value))
    localStorage.setItem('flightSimGenericConfig', JSON.stringify(genericConfig.value))
  }
  closeModal()
}

const loadPreset = (level: 'low' | 'medium' | 'high') => {
  resetTimer()
  if (!activeModal.value) return
  
  const presets = {
    low: { power: 30, brightness: 40, intensity: 30, volume: 40, sensitivity: 40 },
    medium: { power: 60, brightness: 70, intensity: 60, volume: 70, sensitivity: 60 },
    high: { power: 100, brightness: 100, intensity: 100, volume: 100, sensitivity: 100 }
  }
  
  const preset = presets[level]
  
  // Apply preset to current modal
  if (activeModal.value === 'light' && config.value.light) {
    config.value.light.brightness = preset.brightness
  } else if (activeModal.value === 'sound' && config.value.sound) {
    config.value.sound.volume = preset.volume
  } else if (activeModal.value === 'motion' && config.value.motion) {
    config.value.motion.intensity = preset.intensity
    config.value.motion.pitch = preset.intensity
    config.value.motion.roll = preset.intensity
  } else if (activeModal.value === 'controls' && config.value.controls) {
    config.value.controls.sensitivity = preset.sensitivity
    config.value.controls.forceFeedback = preset.intensity
  } else if (activeModal.value === 'screens' && config.value.screens) {
    config.value.screens.brightness = preset.brightness
  } else if (activeModal.value === 'hydraulics' && config.value.hydraulics) {
    config.value.hydraulics.pressure = 1000 + (preset.power * 20)
    config.value.hydraulics.flowRate = preset.power
  } else {
    // Generic config
    genericConfig.value.power = preset.power
  }
}

const toggleSystem = (systemName: string) => {
  resetTimer()
  const currentState = systems.value[systemName]
  const newState = !currentState
  
  isLoading.value = true
  loadingMessage.value = systemMessages[systemName]?.[newState ? 'on' : 'off'] || 'Processing...'
  
  // Get loading time for this specific system (default 1500ms if not specified)
  const loadTime = loadingTimes[systemName] || 1500
  
  setTimeout(() => {
    systems.value[systemName] = newState
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('flightSimSystems', JSON.stringify(systems.value))
    }
    
    isLoading.value = false
  }, loadTime)
}

let countdownInterval: NodeJS.Timeout | null = null
let clockInterval: NodeJS.Timeout | null = null

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

const startCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
  
  countdownInterval = setInterval(() => {
    sessionExpireCountdown.value--
    
    if (sessionExpireCountdown.value <= 0) {
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
      router.push('/locked')
    }
  }, 1000)
}

const resetTimer = () => {
  sessionExpireCountdown.value = 30
  startCountdown()
}

onMounted(() => {
  updateDateTime()
  clockInterval = setInterval(updateDateTime, 1000)
  startCountdown()
  
  if (typeof window !== 'undefined') {
    const savedSystems = localStorage.getItem('flightSimSystems')
    if (savedSystems) {
      systems.value = JSON.parse(savedSystems)
    }
    
    const savedConfig = localStorage.getItem('flightSimConfig')
    if (savedConfig) {
      // Merge saved config with default config to preserve new properties
      config.value = { ...config.value, ...JSON.parse(savedConfig) }
    }
    
    const savedGenericConfig = localStorage.getItem('flightSimGenericConfig')
    if (savedGenericConfig) {
      genericConfig.value = { ...genericConfig.value, ...JSON.parse(savedGenericConfig) }
    }
  }
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
  if (clockInterval) {
    clearInterval(clockInterval)
  }
})
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.98);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  gap: 1.5rem;
}

.loading-screen p {
  color: #f1f5f9;
  font-size: 1.2rem;
  font-weight: 600;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  cursor: pointer;
}

.modal-content {
  background: #1e293b;
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid #334155;
  cursor: default;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #334155;
}

.modal-header h2 {
  color: #f1f5f9;
  margin: 0;
  font-size: 1.5rem;
}

.close-button {
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;
}

.close-button:hover {
  background: #334155;
  color: #f1f5f9;
}

.close-button svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 1.5rem;
}

.config-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.config-heading {
  color: #3b82f6;
  font-size: 1rem;
  font-weight: 700;
  margin: 1rem 0 0.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #334155;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.config-item label {
  color: #cbd5e1;
  font-weight: 600;
  font-size: 0.9rem;
}

.config-item input[type="number"],
.config-item input[type="text"],
.config-item input[type="time"],
.config-item input[type="password"],
.config-item select {
  padding: 0.75rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #f1f5f9;
  font-size: 1rem;
}

.config-item select.multi-select {
  min-height: 150px;
  padding: 0.5rem;
}

.config-item select.multi-select option {
  padding: 0.5rem;
  margin: 0.25rem 0;
  border-radius: 4px;
  cursor: pointer;
}

.config-item select.multi-select option:hover {
  background: #334155;
}

.config-item select.multi-select option:checked {
  background: #3b82f6;
  color: white;
}

.config-item input[type="range"] {
  width: 100%;
  height: 8px;
  background: #334155;
  border-radius: 4px;
  outline: none;
}

.config-item input[type="color"] {
  width: 100%;
  height: 50px;
  border: 2px solid #334155;
  border-radius: 8px;
  cursor: pointer;
}

.value-display {
  color: #3b82f6;
  font-weight: 600;
  font-size: 1.1rem;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #334155;
}

.footer-left,
.footer-right {
  display: flex;
  gap: 0.75rem;
}

.btn-secondary,
.btn-primary,
.btn-preset {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-preset {
  background: #1e293b;
  color: #94a3b8;
  border: 1px solid #334155;
  padding: 0.625rem 1.25rem;
  font-size: 0.9rem;
}

.btn-preset:hover {
  background: #334155;
  color: #e2e8f0;
  border-color: #475569;
}

.btn-preset svg {
  width: 1rem;
  height: 1rem;
}

.btn-secondary {
  background: #334155;
  color: #f1f5f9;
}

.btn-secondary:hover {
  background: #475569;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.dashboard-container {
  min-height: 100vh;
  cursor: pointer;
  background: #0f172a;
  display: flex;
  flex-direction: column;
}

.header {
  background: #1e293b;
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid #334155;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.header-left {
  flex: 1;
}

.header-left h1 {
  font-size: 1.75rem;
  color: #f1f5f9;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.date-time {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.date-time p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.9rem;
}

.date {
  font-weight: 500;
}

.time {
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.header-right {
  display: flex;
  align-items: center;
}

.session-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: #0f172a;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid #334155;
}

.session-label {
  margin: 0;
  color: #94a3b8;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.circular-timer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle-bg {
  transition: all 0.3s ease;
}

.circle-progress {
  transition: stroke-dashoffset 1s linear, stroke 0.3s ease;
  stroke-linecap: round;
}

.timer-text {
  font-size: 16px;
  font-weight: bold;
  fill: #f1f5f9;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
  width: 100%;
}

.control-panel {
  background: #1e293b;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #334155;
}

.control-panel h2 {
  color: #f1f5f9;
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  text-align: center;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.control-card {
  background: #0f172a;
  border: 2px solid #334155;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.control-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: transparent;
  transition: all 0.3s ease;
}

.control-card:hover {
  transform: translateY(-2px);
  border-color: #3b82f6;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.control-card.active {
  border-color: #10b981;
  background: linear-gradient(135deg, #0f172a 0%, #064e3b 100%);
}

.control-card.active::before {
  background: #10b981;
}

.control-card.locked {
  border-color: #ef4444;
  background: linear-gradient(135deg, #0f172a 0%, #7f1d1d 100%);
}

.control-card.locked::before {
  background: #ef4444;
}

.control-card.emergency.active {
  border-color: #ef4444;
  background: linear-gradient(135deg, #0f172a 0%, #7f1d1d 100%);
  animation: pulse-red 1.5s infinite;
}

/* Shutdown and Restart system warnings */
.control-card[class*="systemShutdown"],
.control-card[class*="systemRestart"] {
  border-color: #f59e0b;
}

.control-card[class*="systemShutdown"].active,
.control-card[class*="systemRestart"].active {
  border-color: #ef4444;
  background: linear-gradient(135deg, #0f172a 0%, #7f1d1d 100%);
  animation: pulse-orange 2s infinite;
}

@keyframes pulse-red {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
}

@keyframes pulse-orange {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
}

.control-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.3s ease;
  cursor: pointer;
}

.control-card.active .control-icon {
  color: #10b981;
}

.control-card.locked .control-icon {
  color: #ef4444;
}

.control-card.emergency.active .control-icon {
  color: #ef4444;
}

.control-icon svg {
  width: 100%;
  height: 100%;
}

.control-card h3 {
  color: #f1f5f9;
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
}

.status {
  margin: 0;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
}

.control-card.active .status {
  color: #10b981;
  font-weight: 600;
}

.control-card.locked .status {
  color: #ef4444;
  font-weight: 600;
}

.control-card.emergency.active .status {
  color: #ef4444;
  font-weight: 700;
  text-transform: uppercase;
}

.config-btn {
  margin-top: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: #334155;
  border: none;
  border-radius: 6px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.config-btn:hover {
  background: #475569;
  color: #f1f5f9;
}

.config-btn svg {
  width: 16px;
  height: 16px;
}

.footer {
  background: #1e293b;
  padding: 1.25rem 2rem;
  border-top: 1px solid #334155;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.3);
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-text {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-button:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
}

.logout-button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .header {
    padding: 1rem 1.5rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-left h1 {
    font-size: 1.5rem;
  }
  
  .session-info {
    align-self: center;
  }
  
  .main-content {
    padding: 1.5rem;
  }
  
  .control-panel {
    padding: 1.5rem;
  }
  
  .controls-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 0.75rem;
  }
  
  .control-card {
    padding: 0.75rem;
  }
  
  .control-icon {
    width: 32px;
    height: 32px;
  }
  
  .control-card h3 {
    font-size: 0.75rem;
  }
  
  .footer {
    padding: 1rem 1.5rem;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
