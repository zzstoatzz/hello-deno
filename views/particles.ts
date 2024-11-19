export function particlesView() {
  return `
    <canvas id="particleCanvas"></canvas>
    <div id="particleControls">
      <button id="configToggle">particle settings</button>
      <div id="controlsContent">
        <h2>Particle Settings</h2>
        <div class="controls-grid">
          <label>
            particle count
            <span class="value-display" id="particleCountValue">1200</span>
            <input type="range" id="particleCount" min="13" max="2000" step="10" value="1200">
          </label>
          <label>
            attraction
            <span class="value-display" id="attractConstantValue">-900</span>
            <input type="range" id="attractConstant" min="-2000" max="2000" step="10" value="-900">
          </label>
          <label>
            interaction radius
            <span class="value-display" id="interactionRadiusValue">100</span>
            <input type="range" id="interactionRadius" min="10" max="200" step="1" value="100">
          </label>
          <label>
            connection opacity
            <span class="value-display" id="connectionOpacityValue">0.3</span>
            <input type="range" id="connectionOpacity" min="0" max="1" step="0.01" value="0.3">
          </label>
          <label>
            trail opacity
            <span class="value-display" id="trailOpacityValue">0.1</span>
            <input type="range" id="trailOpacity" min="0" max="0.3" step="0.01" value="0.1">
          </label>
          <label class="checkbox-label">
            enable trails
            <input type="checkbox" id="trailEnabled" checked>
          </label>
        </div>
        <details>
          <summary>Advanced Settings</summary>
          <div class="controls-grid">
            <label>
              gravity
              <span class="value-display" id="gravityValue">0</span>
              <input type="range" id="gravity" min="-300" max="300" step="1" value="0">
            </label>
            <label>
              drag
              <span class="value-display" id="dragConstantValue">0.13</span>
              <input type="range" id="dragConstant" min="0" max="1" step="0.01" value="0.13">
            </label>
            <label>
              elasticity
              <span class="value-display" id="elasticityValue">0.3</span>
              <input type="range" id="elasticity" min="0" max="1" step="0.01" value="0.3">
            </label>
            <label>
              initial velocity
              <span class="value-display" id="initialVelocityValue">2</span>
              <input type="range" id="initialVelocity" min="0" max="10" step="0.1" value="2">
            </label>
          </div>
        </details>
      </div>
    </div>
    <script type="module">
      import { ParticleSystem } from '/static/js/particles/mod.js';
      
      function initParticleSystem() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        });

        const system = new ParticleSystem(canvas);
        system.animate();

        // Settings UI
        const configToggle = document.getElementById('configToggle');
        const controlsContent = document.getElementById('controlsContent');
        
        if (configToggle && controlsContent) {
          configToggle.addEventListener('click', () => {
            controlsContent.style.display = 
              controlsContent.style.display === 'none' ? 'block' : 'none';
          });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
          if (e.key === 'p' || e.key === 'P') {
            configToggle?.click();
          }
        });
      }

      // Initialize when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParticleSystem);
      } else {
        initParticleSystem();
      }
    </script>
  `;
} 