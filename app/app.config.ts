export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    }
  },
  startup: {
    // Set to true to skip the startup sequence entirely
    skipStartup: false,
    
    // Set to true to force a startup failure
    shouldFail: false,
    
    // Chance of random failure (0-100, where 50 = 50% chance)
    failureChance: 0
  }
})
