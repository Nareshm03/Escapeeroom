class AntiCheatSystem {
  constructor() {
    this.violations = [];
    this.listeners = [];
    this.isActive = false;
  }

  start(onViolation) {
    this.isActive = true;
    this.onViolation = onViolation;

    // Tab switching detection
    this.tabListener = () => {
      if (document.hidden) {
        this.recordViolation('tab_switch', 'User switched tabs or minimized window');
      }
    };
    document.addEventListener('visibilitychange', this.tabListener);

    // Developer tools detection
    this.devToolsCheck = setInterval(() => {
      const threshold = 160;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        this.recordViolation('devtools', 'Developer tools detected');
      }
    }, 1000);

    // Window resize detection
    this.resizeListener = () => {
      this.recordViolation('resize', 'Window resized (potential screen sharing)');
    };
    window.addEventListener('resize', this.resizeListener);

    // Context menu prevention
    this.contextMenuListener = (e) => {
      e.preventDefault();
      this.recordViolation('context_menu', 'Right-click attempted');
    };
    document.addEventListener('contextmenu', this.contextMenuListener);
  }

  stop() {
    this.isActive = false;
    document.removeEventListener('visibilitychange', this.tabListener);
    window.removeEventListener('resize', this.resizeListener);
    document.removeEventListener('contextmenu', this.contextMenuListener);
    if (this.devToolsCheck) clearInterval(this.devToolsCheck);
  }

  recordViolation(type, description) {
    if (!this.isActive) return;

    const violation = {
      type,
      description,
      timestamp: new Date().toISOString(),
      count: this.violations.filter((v) => v.type === type).length + 1,
    };

    this.violations.push(violation);

    if (this.onViolation) {
      this.onViolation(violation, this.violations.length);
    }

    return violation;
  }

  getViolations() {
    return this.violations;
  }

  clearViolations() {
    this.violations = [];
  }
}

export default new AntiCheatSystem();
