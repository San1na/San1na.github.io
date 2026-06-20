// sky-sync.js
document.addEventListener('DOMContentLoaded', () => {
    const skyGrad = document.getElementById('sky-grad');
    const skyStars = document.getElementById('sky-stars');
    const skyClouds = document.getElementById('sky-clouds');
    const skySun = document.getElementById('sky-sun');
    const skyMoon = document.getElementById('sky-moon');
    const skyGlow = document.getElementById('sky-glow');

    // 10 minute cycle (600 seconds) so it's noticeably dynamic without being too fast
    const CYCLE_DURATION_SEC = 600; 

    function lerpColor(c1, c2, t) {
        const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
        const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
        const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
        return `rgb(${r}, ${g}, ${b})`;
    }

    const COLORS = {
        dayTop: [96, 165, 250],      // #60a5fa
        dayBottom: [186, 230, 253],  // #bae6fd
        sunsetTop: [249, 115, 22],   // #f97316 (orange)
        sunsetBottom: [253, 224, 71], // #fde047 (yellow)
        nightTop: [15, 23, 42],      // #0f172a
        nightBottom: [30, 41, 59]    // #1e293b
    };

    function updateSky() {
        const nowSec = Date.now() / 1000;
        const cyc = (nowSec % CYCLE_DURATION_SEC) / CYCLE_DURATION_SEC; // 0.0 to 1.0

        // Calculate cycle variables
        const o = 2 * Math.PI * cyc;
        const c = Math.cos(o);
        const p = 82;
        const f = 66;

        // Opacity helper
        const getOpacity = (i) => Math.max(0, Math.min(1, (i + 0.06) * 3));

        // Sun
        if (skySun) {
            skySun.style.left = `${50 - 45 * Math.sin(o)}%`;
            skySun.style.top = `${p - c * f}%`;
            skySun.style.opacity = String(getOpacity(c));
        }

        // Moon
        if (skyMoon) {
            const i = -c;
            skyMoon.style.left = `${50 + 45 * Math.sin(o)}%`;
            skyMoon.style.top = `${p - i * f}%`;
            skyMoon.style.opacity = String(getOpacity(i));
        }

        // Gradients and Stars
        let topColor, bottomColor, starOpacity, glowAlpha;
        
        // cyc goes from 0 to 1
        // 0.0 = Noon (c=1)
        // 0.25 = Sunset (c=0)
        // 0.50 = Midnight (c=-1)
        // 0.75 = Sunrise (c=0)

        if (cyc >= 0 && cyc < 0.2) {
            // Day
            topColor = `rgb(${COLORS.dayTop.join(',')})`;
            bottomColor = `rgb(${COLORS.dayBottom.join(',')})`;
            starOpacity = 0; glowAlpha = 0;
        } else if (cyc >= 0.2 && cyc < 0.3) {
            // Sunset
            let t = (cyc - 0.2) / 0.1;
            topColor = lerpColor(COLORS.dayTop, COLORS.sunsetTop, t);
            bottomColor = lerpColor(COLORS.dayBottom, COLORS.sunsetBottom, t);
            starOpacity = t * 0.5;
            glowAlpha = t * 0.8;
        } else if (cyc >= 0.3 && cyc < 0.4) {
            // Dusk -> Night
            let t = (cyc - 0.3) / 0.1;
            topColor = lerpColor(COLORS.sunsetTop, COLORS.nightTop, t);
            bottomColor = lerpColor(COLORS.sunsetBottom, COLORS.nightBottom, t);
            starOpacity = 0.5 + t * 0.5;
            glowAlpha = 0.8 * (1 - t);
        } else if (cyc >= 0.4 && cyc < 0.7) {
            // Night
            topColor = `rgb(${COLORS.nightTop.join(',')})`;
            bottomColor = `rgb(${COLORS.nightBottom.join(',')})`;
            starOpacity = 1; glowAlpha = 0;
        } else if (cyc >= 0.7 && cyc < 0.8) {
            // Night -> Sunrise
            let t = (cyc - 0.7) / 0.1;
            topColor = lerpColor(COLORS.nightTop, COLORS.sunsetTop, t);
            bottomColor = lerpColor(COLORS.nightBottom, COLORS.sunsetBottom, t);
            starOpacity = 1 - t * 0.5;
            glowAlpha = t * 0.8;
        } else if (cyc >= 0.8 && cyc < 0.9) {
            // Sunrise -> Day
            let t = (cyc - 0.8) / 0.1;
            topColor = lerpColor(COLORS.sunsetTop, COLORS.dayTop, t);
            bottomColor = lerpColor(COLORS.sunsetBottom, COLORS.dayBottom, t);
            starOpacity = 0.5 * (1 - t);
            glowAlpha = 0.8 * (1 - t);
        } else {
            // Day
            topColor = `rgb(${COLORS.dayTop.join(',')})`;
            bottomColor = `rgb(${COLORS.dayBottom.join(',')})`;
            starOpacity = 0; glowAlpha = 0;
        }

        if (skyGrad) {
            skyGrad.style.background = `linear-gradient(180deg, ${topColor} 0%, ${bottomColor} 100%)`;
        }
        if (skyStars) {
            skyStars.style.opacity = String(starOpacity);
        }
        if (skyGlow) {
            skyGlow.style.opacity = String(glowAlpha);
        }
        if (skyClouds) {
            // Clouds fade out slightly at night
            skyClouds.style.opacity = String(1 - (starOpacity * 0.6));
        }

        requestAnimationFrame(updateSky);
    }

    // Start cycle
    requestAnimationFrame(updateSky);
});
