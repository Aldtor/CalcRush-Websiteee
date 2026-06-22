import { AdMob, BannerAdSize, BannerAdPosition, InterstitialAdPluginEvents, MaxAdContentRating } from '@capacitor-community/admob';

export const AD_IDS = {
  // Banner ad unit (ad - 1)
  BANNER: 'ca-app-pub-7524458484163535/7008330893',
  // Interstitial ad unit (ad - 2)  ← was mistakenly used as "reward"; now correctly wired as interstitial
  INTERSTITIAL: 'ca-app-pub-7524458484163535/6203439129',
};

export async function initAdMob() {
  try {
    await AdMob.initialize({
      requestTrackingAuthorization: true,
      initializeForTesting: false,
      // ✅ Families Policy: tag app as child-directed at the SDK level
      tagForChildDirectedTreatment: true,
      tagForUnderAgeOfConsent: true,
    });
  } catch (e) {
    console.error('AdMob Init Error', e);
  }
}

/* ─── Banner ─────────────────────────────────────────────────── */

export async function showBanner() {
  try {
    await AdMob.showBanner({
      adId: AD_IDS.BANNER,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: false,
      // ✅ Families Policy: restrict to child-safe ads only
      tagForChildDirectedTreatment: true,
      tagForUnderAgeOfConsent: true,
      maxAdContentRating: MaxAdContentRating.G,
    });
  } catch (e) {
    console.error('Show Banner Error', e);
  }
}

export async function hideBanner() {
  try {
    await AdMob.hideBanner();
  } catch (e) {
    // Ignore if banner not showing
  }
}

/* ─── Interstitial (shown once before result screen) ─────────── */

let interstitialReady = false;

/**
 * Pre-load the interstitial so it's ready to show instantly.
 * Call this as soon as the quiz finishes (before navigating to result).
 */
export async function prepareInterstitial() {
  interstitialReady = false;
  try {
    await AdMob.prepareInterstitial({
      adId: AD_IDS.INTERSTITIAL,
      isTesting: false,
      // ✅ Families Policy: restrict to child-safe ads only
      tagForChildDirectedTreatment: true,
      tagForUnderAgeOfConsent: true,
      maxAdContentRating: MaxAdContentRating.G,
    });
    interstitialReady = true;
  } catch (e) {
    console.error('Prepare Interstitial Error', e);
  }
}

/**
 * Show the interstitial and resolve when it's dismissed.
 * If the ad wasn't ready (network error, etc.) this resolves immediately
 * so the user is never blocked.
 */
export function showInterstitial() {
  return new Promise((resolve) => {
    if (!interstitialReady) {
      resolve();
      return;
    }
    interstitialReady = false;

    // Listen for dismissal, then resolve
    AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
      resolve();
    }).then((listener) => {
      AdMob.showInterstitial().catch(() => {
        listener.remove();
        resolve();
      });
    }).catch(() => {
      resolve();
    });
  });
}
