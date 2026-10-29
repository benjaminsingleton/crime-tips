import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { api } from './api';

const DEFAULT_BRANDING = {
  name: 'Gotham Crime Tips',
  tagline: 'Police tip line',
  logoUrl: null,
  primaryColor: '#102033',
  accentColor: '#b8974a',
};

const BrandingContext = createContext(DEFAULT_BRANDING);

function parseHex(hex) {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return null;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function toHex({ r, g, b }) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')}`;
}

function mix(a, b, t) {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

function shade(rgb, amount) {
  // amount < 0 → darker, > 0 → lighter
  if (amount < 0) {
    return mix(rgb, { r: 0, g: 0, b: 0 }, -amount);
  }
  return mix(rgb, { r: 255, g: 255, b: 255 }, amount);
}

/** Map department primary/accent onto the official navy/gold CSS variables. */
export function applyBrandingColors(branding) {
  const root = document.documentElement;
  const primary = parseHex(branding.primaryColor || DEFAULT_BRANDING.primaryColor);
  const accent = parseHex(branding.accentColor || DEFAULT_BRANDING.accentColor);
  if (primary) {
    root.style.setProperty('--ct-navy-950', toHex(shade(primary, -0.35)));
    root.style.setProperty('--ct-navy-900', toHex(primary));
    root.style.setProperty('--ct-navy-800', toHex(shade(primary, 0.12)));
    root.style.setProperty('--ct-navy-700', toHex(shade(primary, 0.22)));
    root.style.setProperty('--ct-navy-600', toHex(shade(primary, 0.32)));
    root.style.setProperty('--ct-focus', toHex(shade(primary, 0.32)));
    root.style.setProperty('--ct-info', toHex(shade(primary, 0.18)));
  }
  if (accent) {
    root.style.setProperty('--ct-gold', toHex(accent));
    root.style.setProperty('--ct-gold-soft', toHex(shade(accent, 0.28)));
  }
}

export function BrandingProvider({ children }) {
  const [branding, setBranding] = useState(DEFAULT_BRANDING);
  const [ready, setReady] = useState(false);

  const refresh = async () => {
    try {
      const { branding: next } = await api.getBranding();
      const merged = { ...DEFAULT_BRANDING, ...next };
      setBranding(merged);
      applyBrandingColors(merged);
      document.title = merged.name || DEFAULT_BRANDING.name;
      return merged;
    } catch {
      applyBrandingColors(DEFAULT_BRANDING);
      document.title = DEFAULT_BRANDING.name;
      return DEFAULT_BRANDING;
    } finally {
      setReady(true);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await refresh();
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <BrandingContext.Provider value={{ ...branding, ready, refresh }}>
      {children}
    </BrandingContext.Provider>
  );
}

BrandingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useBranding() {
  return useContext(BrandingContext);
}

export { DEFAULT_BRANDING };
