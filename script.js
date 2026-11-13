/* ==========================================================================
   OUR STORY — THE ANNIVERSARY EXPERIENCE 2026
   Created by Saajim for Mysha (14 November 2023 – 14 November 2026)
   Part 1: Config, State, Initialization, Navigation, Chapter 1 & Chapter 2
   ========================================================================== */

(function () {
  'use strict';

  /* ==========================================================================
     1. CONFIGURATION OBJECT
     ========================================================================== */
  const CONFIG = {
    meta: {
      title: "OUR STORY — THE ANNIVERSARY EXPERIENCE 2026",
      creator: "Saajim",
      recipient: "Mysha",
      startDateISO: "2023-11-14T00:00:00+06:00",
      anniversaryDateDisplay: "14 November 2026",
      storageKey: "our_story_2026_session_v1"
    },
    security: {
      password: "1411",
      hintText: "Hint: The day and month our friendship began (DDMM — 14 November).",
      errorText: "That code doesn’t match our date. Try 1411.",
      unlockSuccessText: "Seal broken. Welcome to Our Story, Mysha.",
      envelopeTransitionDelayMs: 1150
    },
    music: {
      src: "assets/music.mp3",
      defaultVolume: 0.45,
      duckedVolume: 0.12,
      fadeDurationMs: 400,
      labels: {
        playing: "Music On",
        paused: "Music Off",
        unavailable: "Audio Offline"
      }
    },
    voiceMessage: {
      src: "assets/voice-message.mp3",
      title: "A Voice Note From Saajim",
      subtitle: "Background music will gently lower while you listen",
      fallbackMessage: "The voice recording (assets/voice-message.mp3) is resting quietly offline right now, but every word written above carries the exact cadence of my voice."
    },
    chapters: [
      { id: 1, roman: "I", title: "The Invitation", meta: "The sealed threshold" },
      { id: 2, roman: "II", title: "The Beginning", meta: "An introductory letter" },
      { id: 3, roman: "III", title: "Three Years of Us", meta: "Chronicle 2023 – 2026" },
      { id: 4, roman: "IV", title: "Our Little Universe", meta: "Nine captured moments" },
      { id: 5, roman: "V", title: "Letters I Never Sent", meta: "Three quiet confessions & voice" },
      { id: 6, roman: "VI", title: "Two Places, One Story", meta: "Cyprus to Bangladesh" },
      { id: 7, roman: "VII", title: "The Unwritten Truth", meta: "Your private sanctuary" },
      { id: 8, roman: "VIII", title: "Forever Starts Here", meta: "The horizon ahead" }
    ],
    introLetter: {
      dateline: "14 November 2026 • Three Years On",
      stamp: "III YEARS",
      salutation: "Dearest Mysha,",
      paragraphs: [
        "Three years ago, on the fourteenth of November, neither of us knew that an ordinary conversation would quietly turn into the safest harbor either of us had ever known.",
        "Through changing seasons, shifting time zones, unspoken worries, and bursts of laughter that only we understand, you have remained my constant—my truest confidante and my best friend in every sense of the word.",
        "I built this small universe for you so that whenever the world feels too loud or too distant, you have a place to return to—a monument to every memory we have made since 2023, and every chapter still waiting for us."
      ],
      signoffLead: "Always in your corner,",
      signoffName: "Saajim",
      charDelayMs: 22,
      paragraphPauseMs: 280
    },
    locations: {
      cyprus: { name: "Cyprus", person: "Saajim", timeZone: "Asia/Nicosia" },
      bangladesh: { name: "Bangladesh", person: "Mysha", timeZone: "Asia/Dhaka" }
    },
    diary: {
      formspreeEndpoint: "https://formspree.io/f/xvkagwjg",
      privateFormspreeEndpoint: "https://formspree.io/f/xaeonlwp",
      requestTimeoutMs: 15000,
      maxChars: 5000,
      emptyWarning: "Please write a few words in the diary before choosing an action. / অনুগ্রহ করে কিছু লিখুন।",
      sendConfirmTitle: "Send This Page to Saajim?",
      sendConfirmBody: "Your words will be delivered to Saajim through Formspree. Would you like to send this message now?",
      privateConfirmTitle: "Email This Entry to Yourself?",
      privateConfirmBody: "This entry will be sent to your own Gmail through your private diary form. Saajim will not receive a copy. Would you like to continue?",
      sendingStatus: "Sealing and sending your words...",
      sendSuccessStatus: "Delivered to Saajim with care. Thank you for sharing your heart, Mysha.",
      sendErrorStatus: "Could not send the entry right now. Your text is still safe in the box above.",
      privateSuccessStatus: "Your private entry has been emailed to your Gmail.",
      privateErrorStatus: "Could not email your private entry. Your text is still safe in the box above."
    },
    secretLetter: {
      lockedHint: "Visit all eight chapters to unlock the Secret Ninth Envelope hidden between the lines.",
      unlockedHint: "All eight chapters explored! The Secret Ninth Envelope is now unlocked for you."
    }
  };

  /* ==========================================================================
     2. RUNTIME STATE OBJECT
     ========================================================================== */
  const STATE = {
    isUnlocked: false,
    currentChapter: 1,
    visitedChapters: new Set([1]),
    secretUnlocked: false,
    hiddenEndingUnlocked: false,
    bgMusicPlaying: false,
    voiceNotePlaying: false,
    activeGalleryIndex: 0,
    galleryAutoplayId: null,
    typewriterTimerId: null,
    typewriterCompleted: false,
    clockIntervalId: null,
    pendingDiaryAction: null,
    reducedMotion: false
  };

  /* ==========================================================================
     3. DOM ELEMENT CACHE
     ========================================================================== */
  const DOM = {};

  function cacheDOMElements() {
    DOM.appShell = document.getElementById("app-shell");
    DOM.preloader = document.getElementById("preloader");
    DOM.topProgressBar = document.getElementById("top-progress-bar");
    DOM.topProgressFill = document.getElementById("top-progress-fill");
    DOM.globalHeader = document.getElementById("global-header");
    DOM.chapterIndicator = document.getElementById("chapter-indicator");
    DOM.musicToggleBtn = document.getElementById("music-toggle-btn");
    DOM.musicStatusLabel = document.getElementById("music-status-label");
    DOM.chapterNavToggle = document.getElementById("chapter-nav-toggle");
    DOM.chapterNavDrawer = document.getElementById("chapter-nav-drawer");
    DOM.chapterNavList = document.getElementById("chapter-nav-list");
    DOM.bgAudio = document.getElementById("bg-audio");
    DOM.voiceAudio = document.getElementById("voice-audio");
    DOM.toastNotification = document.getElementById("toast-notification");

    // Chapter 1
    DOM.chapter1 = document.getElementById("chapter-1");
    DOM.envelopeStage = document.getElementById("envelope-stage");
    DOM.envelopeSeal = document.getElementById("envelope-seal");
    DOM.passwordForm = document.getElementById("password-form");
    DOM.passwordInput = document.getElementById("password-input");
    DOM.passwordSubmitBtn = document.getElementById("password-submit-btn");
    DOM.passwordHintBtn = document.getElementById("password-hint-btn");
    DOM.passwordFeedback = document.getElementById("password-feedback");

    // Chapter 2
    DOM.chapter2 = document.getElementById("chapter-2");
    DOM.typewriterOutput = document.getElementById("typewriter-output");
    DOM.typewriterCursor = document.getElementById("typewriter-cursor");
    DOM.typewriterSkipBtn = document.getElementById("typewriter-skip-btn");
    DOM.ch2ContinueBtn = document.getElementById("ch2-continue-btn");
DOM.ch3ContinueBtn = document.getElementById("ch3-continue-btn");
    // Chapter 8 & Unlocks
    DOM.chapter8 = document.getElementById("chapter-8");
    DOM.progressChecklist = document.getElementById("progress-checklist");
    DOM.secretLetterLockMsg = document.getElementById("secret-letter-lock-msg");
    DOM.secretLetterTriggerBtn = document.getElementById("secret-letter-trigger-btn");
    DOM.restartJourneyBtn = document.getElementById("restart-journey-btn");
  }

  /* ==========================================================================
     4. APPLICATION INITIALIZATION & REDUCED MOTION
     ========================================================================== */
  document.addEventListener("DOMContentLoaded", initApp);

  function initApp() {
    cacheDOMElements();
    detectReducedMotion();
    restoreSessionState();
    bindCoreEvents();

    // Fade out preloader
    setTimeout(() => {
      if (DOM.preloader) {
        DOM.preloader.classList.add("is-hidden");
      }
    }, 600);
  }

  function detectReducedMotion() {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    STATE.reducedMotion = mediaQuery.matches;
    if (STATE.reducedMotion && DOM.appShell) {
      DOM.appShell.classList.add("reduced-motion");
    }
    mediaQuery.addEventListener("change", (e) => {
      STATE.reducedMotion = e.matches;
      if (DOM.appShell) {
        DOM.appShell.classList.toggle("reduced-motion", STATE.reducedMotion);
      }
    });
  }

  function saveSessionState() {
    try {
      const sessionData = {
        isUnlocked: STATE.isUnlocked,
        currentChapter: STATE.currentChapter,
        visitedChapters: Array.from(STATE.visitedChapters),
        secretUnlocked: STATE.secretUnlocked,
        hiddenEndingUnlocked: STATE.hiddenEndingUnlocked
      };
      sessionStorage.setItem(CONFIG.meta.storageKey, JSON.stringify(sessionData));
    } catch (err) {
      console.warn("Session storage restricted:", err);
    }
  }

  function restoreSessionState() {
    try {
      const raw = sessionStorage.getItem(CONFIG.meta.storageKey);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.isUnlocked) {
        STATE.isUnlocked = true;
        if (DOM.globalHeader) DOM.globalHeader.classList.remove("is-locked");
        if (DOM.envelopeStage) DOM.envelopeStage.classList.add("is-open");
      }
      if (Array.isArray(data.visitedChapters)) {
        STATE.visitedChapters = new Set(data.visitedChapters);
      }
      if (data.currentChapter && data.currentChapter > 1 && STATE.isUnlocked) {
        goToChapter(data.currentChapter, { skipScroll: true });
      }
    } catch (err) {
      console.warn("Could not restore session state:", err);
    }
  }

  function showToast(message, durationMs = 3500) {
    if (!DOM.toastNotification) return;
    DOM.toastNotification.textContent = message;
    DOM.toastNotification.hidden = false;
    clearTimeout(DOM.toastTimeout);
    DOM.toastTimeout = setTimeout(() => {
      DOM.toastNotification.hidden = true;
    }, durationMs);
  }

  /* ==========================================================================
     5. CHAPTER NAVIGATION & PROGRESSION
     ========================================================================== */
  function bindCoreEvents() {
    // Chapter 1 Password & Seal
    if (DOM.passwordForm) {
      DOM.passwordForm.addEventListener("submit", handlePasswordSubmit);
    }
    if (DOM.envelopeSeal) {
      DOM.envelopeSeal.addEventListener("click", () => {
        if (DOM.passwordInput) DOM.passwordInput.focus();
      });
    }
    if (DOM.passwordHintBtn) {
      DOM.passwordHintBtn.addEventListener("click", togglePasswordHint);
    }

    // Chapter 2 Typewriter
    if (DOM.typewriterSkipBtn) {
      DOM.typewriterSkipBtn.addEventListener("click", completeTypewriterInstantly);
    }
    if (DOM.ch2ContinueBtn) {
      DOM.ch2ContinueBtn.addEventListener("click", () => goToChapter(3));
    }
if (DOM.ch3ContinueBtn) {
  DOM.ch3ContinueBtn.addEventListener("click", () => goToChapter(4));
}
    // Nav Drawer Toggle
    if (DOM.chapterNavToggle) {
      DOM.chapterNavToggle.addEventListener("click", () => toggleNavDrawer());
    }
    document.querySelectorAll("[data-close-drawer]").forEach(el => {
      el.addEventListener("click", () => toggleNavDrawer(false));
    });

    // Nav Drawer Chapter Buttons
    document.querySelectorAll("[data-target-chapter]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const targetNum = parseInt(e.currentTarget.getAttribute("data-target-chapter"), 10);
        if (STATE.isUnlocked || targetNum === 1) {
          goToChapter(targetNum);
          toggleNavDrawer(false);
        } else {
          showToast("Please enter the password in Chapter I first.");
        }
      });
    });

    // Global Music Toggle
    if (DOM.musicToggleBtn) {
      DOM.musicToggleBtn.addEventListener("click", toggleBgMusic);
    }

    // Restart Journey
    if (DOM.restartJourneyBtn) {
      DOM.restartJourneyBtn.addEventListener("click", restartExperience);
    }
  }

  function goToChapter(chapterNum, options = {}) {
    if (chapterNum > 1 && !STATE.isUnlocked) {
      showToast("Please unlock Chapter I with the password first.");
      return;
    }

    document.querySelectorAll(".chapter-section").forEach(sec => {
      sec.classList.remove("is-active");
      sec.setAttribute("aria-hidden", "true");
    });

    const targetSection = document.getElementById(`chapter-${chapterNum}`);
    if (!targetSection) return;

    targetSection.classList.add("is-active");
    targetSection.setAttribute("aria-hidden", "false");

    STATE.currentChapter = chapterNum;
    markChapterVisited(chapterNum);
    updateProgressUI();
    saveSessionState();

    if (!options.skipScroll) {
      window.scrollTo({ top: 0, behavior: STATE.reducedMotion ? "auto" : "smooth" });
    }

    // Chapter-specific triggers
    if (chapterNum === 2 && !STATE.typewriterCompleted && !STATE.typewriterStarted) {
      startTypewriter();
    }
  }

  function markChapterVisited(chapterNum) {
    STATE.visitedChapters.add(chapterNum);

    // Update nav drawer item
    const navBtn = document.querySelector(`.chapter-nav-btn[data-target-chapter="${chapterNum}"]`);
    if (navBtn) {
      navBtn.classList.add("is-visited");
      if (!STATE.isUnlocked && chapterNum > 1) {
        navBtn.classList.remove("is-locked");
      }
    }

    // Update Chapter 8 checklist
    const pill = document.querySelector(`.checklist-pill[data-check-chapter="${chapterNum}"]`);
    if (pill) {
      pill.classList.add("is-visited");
    }

    checkSecretUnlockStatus();
  }

  function updateProgressUI() {
    const progressPercent = (STATE.currentChapter / 8) * 100;
    if (DOM.topProgressFill) {
      DOM.topProgressFill.style.width = `${progressPercent}%`;
    }
    if (DOM.topProgressBar) {
      DOM.topProgressBar.setAttribute("aria-valuenow", STATE.currentChapter);
    }
    if (DOM.chapterIndicator) {
      const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
      DOM.chapterIndicator.textContent = `Chapter ${romanNumerals[STATE.currentChapter - 1] || 'I'} / VIII`;
    }

    document.querySelectorAll(".chapter-nav-btn").forEach(btn => {
      const target = parseInt(btn.getAttribute("data-target-chapter"), 10);
      const isActive = target === STATE.currentChapter;
      btn.classList.toggle("is-active", isActive);
      if (isActive) {
        btn.setAttribute("aria-current", "step");
      } else {
        btn.removeAttribute("aria-current");
      }
    });
  }

  function toggleNavDrawer(forceState) {
    const isOpen = typeof forceState === "boolean" ? forceState : !DOM.chapterNavDrawer.classList.contains("is-open");
    DOM.chapterNavDrawer.classList.toggle("is-open", isOpen);
    DOM.chapterNavToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    DOM.chapterNavDrawer.setAttribute("aria-hidden", isOpen ? "false" : "true");
  }

  /* ==========================================================================
     6. PASSWORD VERIFICATION & CHAPTER 1 INVITATION
     ========================================================================== */
  function handlePasswordSubmit(e) {
    e.preventDefault();
    if (!DOM.passwordInput) return;
    const entered = DOM.passwordInput.value.trim();

    if (entered === CONFIG.security.password) {
      unlockExperience();
    } else {
      triggerPasswordError(CONFIG.security.errorText);
    }
  }

  function togglePasswordHint() {
    if (!DOM.passwordFeedback) return;
    const isVisible = DOM.passwordFeedback.textContent === CONFIG.security.hintText;
    DOM.passwordFeedback.textContent = isVisible ? "" : CONFIG.security.hintText;
    DOM.passwordHintBtn.setAttribute("aria-expanded", isVisible ? "false" : "true");
  }

  function triggerPasswordError(msg) {
    if (DOM.passwordFeedback) {
      DOM.passwordFeedback.textContent = msg;
    }
    if (DOM.envelopeStage) {
      DOM.envelopeStage.classList.add("is-error");
      setTimeout(() => DOM.envelopeStage.classList.remove("is-error"), 500);
    }
    if (DOM.passwordInput) {
      DOM.passwordInput.focus();
      DOM.passwordInput.select();
    }
  }

  function unlockExperience() {
    STATE.isUnlocked = true;
    if (DOM.envelopeStage) {
      DOM.envelopeStage.classList.add("is-open");
    }
    if (DOM.passwordFeedback) {
      DOM.passwordFeedback.textContent = CONFIG.security.unlockSuccessText;
    }
    if (DOM.globalHeader) {
      DOM.globalHeader.classList.remove("is-locked");
      DOM.globalHeader.setAttribute("aria-hidden", "false");
    }

    // Unlock all nav buttons
    document.querySelectorAll(".chapter-nav-btn").forEach(btn => {
      btn.classList.remove("is-locked");
    });

    saveSessionState();

    // Automatically start background music if available
    tryStartBgMusic();

    // Advance to Chapter 2 after cinematic envelope animation
    setTimeout(() => {
      goToChapter(2);
    }, CONFIG.security.envelopeTransitionDelayMs);
  }

  function tryStartBgMusic() {
    if (!DOM.bgAudio) return;
    DOM.bgAudio.volume = CONFIG.music.defaultVolume;
    DOM.bgAudio.play().then(() => {
      STATE.bgMusicPlaying = true;
      if (DOM.musicToggleBtn) DOM.musicToggleBtn.classList.add("is-playing");
      if (DOM.musicStatusLabel) DOM.musicStatusLabel.textContent = CONFIG.music.labels.playing;
    }).catch(() => {
      // Browser autoplay policy prevented audio playback; user can click play manually.
      STATE.bgMusicPlaying = false;
      if (DOM.musicStatusLabel) DOM.musicStatusLabel.textContent = CONFIG.music.labels.paused;
    });
  }

  function toggleBgMusic() {
    if (!DOM.bgAudio) return;
    if (STATE.bgMusicPlaying) {
      DOM.bgAudio.pause();
      STATE.bgMusicPlaying = false;
      if (DOM.musicToggleBtn) DOM.musicToggleBtn.classList.remove("is-playing");
      if (DOM.musicStatusLabel) DOM.musicStatusLabel.textContent = CONFIG.music.labels.paused;
    } else {
      DOM.bgAudio.volume = CONFIG.music.defaultVolume;
      DOM.bgAudio.play().then(() => {
        STATE.bgMusicPlaying = true;
        if (DOM.musicToggleBtn) DOM.musicToggleBtn.classList.add("is-playing");
        if (DOM.musicStatusLabel) DOM.musicStatusLabel.textContent = CONFIG.music.labels.playing;
      }).catch(() => {
        showToast("Audio playback unavailable.");
      });
    }
  }

  /* ==========================================================================
     7. TYPEWRITER EFFECT (CHAPTER 2)
     ========================================================================== */
  function startTypewriter() {
    if (!DOM.typewriterOutput) return;
    STATE.typewriterStarted = true;

    // Construct clean HTML from CONFIG.introLetter
    const letter = CONFIG.introLetter;
    let htmlContent = `<p class="letter-salutation">${letter.salutation}</p>`;
    letter.paragraphs.forEach(p => {
      htmlContent += `<p class="typewriter-line" style="opacity: 0; transform: translateY(6px); transition: opacity 0.6s ease, transform 0.6s ease;">${p}</p>`;
    });
    htmlContent += `<p class="letter-signoff" style="opacity: 0; transition: opacity 0.6s ease;">${letter.signoffLead}<br><strong>${letter.signoffName}</strong></p>`;

    DOM.typewriterOutput.innerHTML = htmlContent;

    const lines = DOM.typewriterOutput.querySelectorAll(".typewriter-line, .letter-signoff");
    let lineIdx = 0;

    function revealNextLine() {
      if (lineIdx < lines.length) {
        const line = lines[lineIdx];
        line.style.opacity = "1";
        line.style.transform = "translateY(0)";
        lineIdx++;
        STATE.typewriterTimerId = setTimeout(revealNextLine, CONFIG.introLetter.paragraphPauseMs);
      } else {
        STATE.typewriterCompleted = true;
        if (DOM.typewriterCursor) DOM.typewriterCursor.style.display = "none";
        if (DOM.typewriterSkipBtn) DOM.typewriterSkipBtn.style.display = "none";
      }
    }

    STATE.typewriterTimerId = setTimeout(revealNextLine, 200);
  }

  function completeTypewriterInstantly() {
    if (STATE.typewriterTimerId) clearTimeout(STATE.typewriterTimerId);
    if (!DOM.typewriterOutput) return;

    const letter = CONFIG.introLetter;
    let htmlContent = `<p class="letter-salutation">${letter.salutation}</p>`;
    letter.paragraphs.forEach(p => {
      htmlContent += `<p>${p}</p>`;
    });
    htmlContent += `<p class="letter-signoff">${letter.signoffLead}<br><strong>${letter.signoffName}</strong></p>`;

    DOM.typewriterOutput.innerHTML = htmlContent;
    STATE.typewriterCompleted = true;
    if (DOM.typewriterCursor) DOM.typewriterCursor.style.display = "none";
    if (DOM.typewriterSkipBtn) DOM.typewriterSkipBtn.style.display = "none";
  }

  function checkSecretUnlockStatus() {
    if (STATE.visitedChapters.size >= 8 && !STATE.secretUnlocked) {
      STATE.secretUnlocked = true;
      if (DOM.secretLetterTriggerBtn) {
        DOM.secretLetterTriggerBtn.classList.remove("is-locked");
        DOM.secretLetterTriggerBtn.removeAttribute("disabled");
        DOM.secretLetterTriggerBtn.setAttribute("aria-disabled", "false");
      }
      if (DOM.secretLetterLockMsg) {
        DOM.secretLetterLockMsg.textContent = CONFIG.secretLetter.unlockedHint;
      }
    }
  }


  /* ==========================================================================
     OUR STORY — THE ANNIVERSARY EXPERIENCE 2026
     Part 2: Photo Gallery, Lightbox, Touch Swipe, Audio & Voice Message Player
     ========================================================================== */

  // Extend CONFIG with Gallery and Audio definitions
  if (typeof CONFIG !== 'undefined') {
    CONFIG.gallery = {
      autoplayIntervalMs: 4200,
      photos: [
        { id: 1, src: "assets/1.jpg", indexLabel: "Photograph 01 / 09", fallbackTitle: "Frame One • 2023", alt: "Memory 1: The quiet beginning of our story", caption: "Where the laughter first began to feel like home." },
        { id: 2, src: "assets/2.jpg", indexLabel: "Photograph 02 / 09", fallbackTitle: "Frame Two • Golden Hour", alt: "Memory 2: Golden light and quiet conversations", caption: "Some moments don’t ask for noise—only presence." },
        { id: 3, src: "assets/3.jpg", indexLabel: "Photograph 03 / 09", fallbackTitle: "Frame Three • Unscripted Joy", alt: "Memory 3: Unscripted smiles captured in time", caption: "The kind of smile that makes the heaviest week feel effortless." },
        { id: 4, src: "assets/4.jpg", indexLabel: "Photograph 04 / 09", fallbackTitle: "Frame Four • Changing Seasons", alt: "Memory 4: Shared stories across seasons", caption: "Through every shifting season, the anchor remained the same." },
        { id: 5, src: "assets/5.jpg", indexLabel: "Photograph 05 / 09", fallbackTitle: "Frame Five • Centerpiece", alt: "Memory 5: At the heart of our little universe", caption: "In the middle of chaos, a quiet constellation of two." },
        { id: 6, src: "assets/6.jpg", indexLabel: "Photograph 06 / 09", fallbackTitle: "Frame Six • Parallel Skies", alt: "Memory 6: Miles apart yet side by side in spirit", caption: "Looking up at the same sky from two different corners of the world." },
        { id: 7, src: "assets/7.jpg", indexLabel: "Photograph 07 / 09", fallbackTitle: "Frame Seven • Quiet Strength", alt: "Memory 7: Grace and resilience", caption: "A reminder of how far we have come and everything we have weathered." },
        { id: 8, src: "assets/8.jpg", indexLabel: "Photograph 08 / 09", fallbackTitle: "Frame Eight • Bright Days", alt: "Memory 8: Celebrations big and small", caption: "Every ordinary day turned into an occasion simply by sharing it." },
        { id: 9, src: "assets/9.jpg", indexLabel: "Photograph 09 / 09", fallbackTitle: "Frame Nine • 14 November 2026", alt: "Memory 9: Three years and counting", caption: "Three years behind us, and a lifetime of chapters still ahead." }
      ]
    };
  }

  // Extend STATE for gallery and audio
  if (typeof STATE !== 'undefined') {
    STATE.activeGalleryIndex = 0;
    STATE.galleryAutoplayId = null;
    STATE.voiceNotePlaying = false;
  }

  // Cache additional DOM elements for Gallery, Lightbox, and Audio
  document.addEventListener("DOMContentLoaded", () => {
    DOM.galleryViewport = document.getElementById("gallery-viewport");
    DOM.galleryTrack = document.getElementById("gallery-track");
    DOM.galleryPrevBtn = document.getElementById("gallery-prev-btn");
    DOM.galleryNextBtn = document.getElementById("gallery-next-btn");
    DOM.galleryCounter = document.getElementById("gallery-counter");
    DOM.galleryDots = document.getElementById("gallery-dots");
    DOM.galleryAutoplayBtn = document.getElementById("gallery-autoplay-btn");
    DOM.ch4ContinueBtn = document.getElementById("ch4-continue-btn");

    DOM.lightboxModal = document.getElementById("lightbox-modal");
    DOM.lightboxImg = document.getElementById("lightbox-img");
    DOM.lightboxFallback = document.getElementById("lightbox-fallback");
    DOM.lightboxCaption = document.getElementById("lightbox-caption");
    DOM.lightboxCloseBtn = document.getElementById("lightbox-close-btn");

    DOM.voicePlayBtn = document.getElementById("voice-play-btn");
    DOM.voiceSeekBar = document.getElementById("voice-seek-bar");
    DOM.voiceTimeCurrent = document.getElementById("voice-time-current");
    DOM.voiceTimeTotal = document.getElementById("voice-time-total");
    DOM.voiceErrorFallback = document.getElementById("voice-error-fallback");
    DOM.ch5ContinueBtn = document.getElementById("ch5-continue-btn");

    initGalleryModule();
    initAudioModule();
  });

  /* ==========================================================================
     1. PHOTO GALLERY & LIGHTBOX MODULE
     ========================================================================= */
  function initGalleryModule() {
    if (!DOM.galleryViewport) return;

    // Bind navigation buttons
    if (DOM.galleryPrevBtn) DOM.galleryPrevBtn.addEventListener("click", () => { stopGalleryAutoplay(); prevSlide(); });
    if (DOM.galleryNextBtn) DOM.galleryNextBtn.addEventListener("click", () => { stopGalleryAutoplay(); nextSlide(); });

    // Bind pagination dots
    document.querySelectorAll("[data-slide-to]").forEach(dot => {
      dot.addEventListener("click", (e) => {
        stopGalleryAutoplay();
        const idx = parseInt(e.currentTarget.getAttribute("data-slide-to"), 10);
        goToSlide(idx);
      });
    });

    // Bind autoplay button
    if (DOM.galleryAutoplayBtn) {
      DOM.galleryAutoplayBtn.addEventListener("click", toggleGalleryAutoplay);
    }

    // Bind Lightbox trigger on frames
    document.querySelectorAll(".gallery-frame").forEach(frame => {
      frame.addEventListener("click", (e) => {
        const slide = e.currentTarget.closest(".gallery-slide");
        if (slide) {
          const idx = parseInt(slide.getAttribute("data-slide-index"), 10);
          openLightbox(idx);
        }
      });
      frame.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const slide = e.currentTarget.closest(".gallery-slide");
          if (slide) {
            const idx = parseInt(slide.getAttribute("data-slide-index"), 10);
            openLightbox(idx);
          }
        }
      });
    });

    // Lightbox close events
    if (DOM.lightboxCloseBtn) DOM.lightboxCloseBtn.addEventListener("click", closeLightbox);
    document.querySelectorAll("[data-close-lightbox]").forEach(el => {
      el.addEventListener("click", closeLightbox);
    });

    // Chapter 4 continue button
    if (DOM.ch4ContinueBtn) {
      DOM.ch4ContinueBtn.addEventListener("click", () => goToChapter(5));
    }

    // Bind touch swipe gestures for Android Chrome
    bindGallerySwipeGestures();

    // Setup image error handlers for graceful fallbacks
    setupImageErrorFallbacks();
  }

  function setupImageErrorFallbacks() {
    document.querySelectorAll(".gallery-img").forEach(img => {
      img.addEventListener("error", () => {
        const frame = img.closest(".gallery-frame");
        if (frame) {
          frame.classList.add("asset-missing");
        }
      });
    });
  }

  function goToSlide(index) {
    const slides = document.querySelectorAll(".gallery-slide");
    const dots = document.querySelectorAll(".gallery-dot");
    if (!slides.length) return;

    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    STATE.activeGalleryIndex = index;

    slides.forEach((slide, i) => {
      const isActive = i === index;
      slide.classList.toggle("is-active", isActive);
    });

    dots.forEach((dot, i) => {
      const isActive = i === index;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    if (DOM.galleryCounter) {
      DOM.galleryCounter.textContent = `${index + 1} / ${slides.length}`;
    }
  }

  function nextSlide() {
    goToSlide(STATE.activeGalleryIndex + 1);
  }

  function prevSlide() {
    goToSlide(STATE.activeGalleryIndex - 1);
  }

  function toggleGalleryAutoplay() {
    if (STATE.galleryAutoplayId) {
      stopGalleryAutoplay();
    } else {
      startGalleryAutoplay();
    }
  }

  function startGalleryAutoplay() {
    STATE.galleryAutoplayId = setInterval(() => {
      nextSlide();
    }, CONFIG.gallery.autoplayIntervalMs);

    if (DOM.galleryAutoplayBtn) {
      DOM.galleryAutoplayBtn.classList.add("is-active");
      DOM.galleryAutoplayBtn.setAttribute("aria-pressed", "true");
      DOM.galleryAutoplayBtn.querySelector("span").textContent = "Stop Slideshow";
    }
  }

  function stopGalleryAutoplay() {
    if (STATE.galleryAutoplayId) {
      clearInterval(STATE.galleryAutoplayId);
      STATE.galleryAutoplayId = null;
    }
    if (DOM.galleryAutoplayBtn) {
      DOM.galleryAutoplayBtn.classList.remove("is-active");
      DOM.galleryAutoplayBtn.setAttribute("aria-pressed", "false");
      DOM.galleryAutoplayBtn.querySelector("span").textContent = "Start Slideshow";
    }
  }

  function bindGallerySwipeGestures() {
    if (!DOM.galleryViewport) return;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    DOM.galleryViewport.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    DOM.galleryViewport.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Ensure horizontal swipe is dominant over vertical scroll
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        stopGalleryAutoplay();
        if (diffX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }
  }

  function openLightbox(index) {
    stopGalleryAutoplay();
    const photoData = CONFIG.gallery.photos[index];
    if (!photoData || !DOM.lightboxModal) return;

    if (DOM.lightboxImg) {
      DOM.lightboxImg.src = photoData.src;
      DOM.lightboxImg.alt = photoData.alt;
      DOM.lightboxImg.hidden = false;
    }
    if (DOM.lightboxFallback) {
      DOM.lightboxFallback.hidden = true;
    }
    if (DOM.lightboxCaption) {
      DOM.lightboxCaption.textContent = photoData.caption;
    }

    DOM.lightboxModal.classList.add("is-open");
    DOM.lightboxModal.setAttribute("aria-hidden", "false");

    // Handle image load error inside lightbox
    if (DOM.lightboxImg) {
      DOM.lightboxImg.onerror = () => {
        DOM.lightboxImg.hidden = true;
        if (DOM.lightboxFallback) DOM.lightboxFallback.hidden = false;
      };
    }
  }

  function closeLightbox() {
    if (!DOM.lightboxModal) return;
    DOM.lightboxModal.classList.remove("is-open");
    DOM.lightboxModal.setAttribute("aria-hidden", "true");
  }


  /* ==========================================================================
     2. AUDIO & VOICE MESSAGE PLAYER MODULE
     ========================================================================= */
  function initAudioModule() {
    if (!DOM.bgAudio || !DOM.voiceAudio) return;

    // Background Audio Error Handling
    DOM.bgAudio.addEventListener("error", () => {
      if (DOM.musicStatusLabel) DOM.musicStatusLabel.textContent = CONFIG.music.labels.unavailable;
      if (DOM.musicToggleBtn) DOM.musicToggleBtn.disabled = true;
    });

    // Voice Message Audio Setup & Events
    if (DOM.voicePlayBtn) {
      DOM.voicePlayBtn.addEventListener("click", toggleVoiceMessage);
    }

    if (DOM.voiceSeekBar) {
      DOM.voiceSeekBar.addEventListener("input", handleVoiceSeek);
    }

    DOM.voiceAudio.addEventListener("timeupdate", updateVoiceProgress);
    DOM.voiceAudio.addEventListener("ended", () => {
      STATE.voiceNotePlaying = false;
      if (DOM.voicePlayBtn) {
        DOM.voicePlayBtn.classList.remove("is-playing");
        DOM.voicePlayBtn.innerHTML = '<span class="voice-play-icon" aria-hidden="true">&#9654;</span>';
      }
      // Restore background music volume
      restoreBgMusicVolume();
    });

    DOM.voiceAudio.addEventListener("error", () => {
      if (DOM.voiceErrorFallback) {
        DOM.voiceErrorFallback.hidden = false;
      }
      if (DOM.voicePlayBtn) {
        DOM.voicePlayBtn.disabled = true;
      }
    });

    DOM.voiceAudio.addEventListener("loadedmetadata", () => {
      if (DOM.voiceTimeTotal) {
        DOM.voiceTimeTotal.textContent = formatAudioTime(DOM.voiceAudio.duration);
      }
    });

    // Chapter 5 continue button
    if (DOM.ch5ContinueBtn) {
      DOM.ch5ContinueBtn.addEventListener("click", () => {
        if (STATE.voiceNotePlaying) {
          pauseVoiceMessage();
        }
        goToChapter(6);
      });
    }
  }

  function toggleVoiceMessage() {
    if (!DOM.voiceAudio) return;

    if (STATE.voiceNotePlaying) {
      pauseVoiceMessage();
    } else {
      playVoiceMessage();
    }
  }

  function playVoiceMessage() {
    if (!DOM.voiceAudio) return;

    // Duck background music volume if playing
    duckBgMusicVolume();

    DOM.voiceAudio.play().then(() => {
      STATE.voiceNotePlaying = true;
      if (DOM.voicePlayBtn) {
        DOM.voicePlayBtn.classList.add("is-playing");
        DOM.voicePlayBtn.innerHTML = '<span class="voice-play-icon" aria-hidden="true">&#10074;&#10074;</span>';
      }
    }).catch((err) => {
      console.warn("Voice playback error:", err);
      restoreBgMusicVolume();
      if (DOM.voiceErrorFallback) DOM.voiceErrorFallback.hidden = false;
    });
  }

  function pauseVoiceMessage() {
    if (!DOM.voiceAudio) return;
    DOM.voiceAudio.pause();
    STATE.voiceNotePlaying = false;
    if (DOM.voicePlayBtn) {
      DOM.voicePlayBtn.classList.remove("is-playing");
      DOM.voicePlayBtn.innerHTML = '<span class="voice-play-icon" aria-hidden="true">&#9654;</span>';
    }
    restoreBgMusicVolume();
  }

  function duckBgMusicVolume() {
    if (!DOM.bgAudio || !STATE.bgMusicPlaying) return;
    DOM.bgAudio.volume = CONFIG.music.duckedVolume;
  }

  function restoreBgMusicVolume() {
    if (!DOM.bgAudio || !STATE.bgMusicPlaying) return;
    DOM.bgAudio.volume = CONFIG.music.defaultVolume;
  }

  function handleVoiceSeek() {
    if (!DOM.voiceAudio || isNaN(DOM.voiceAudio.duration)) return;
    const seekPercent = parseFloat(DOM.voiceSeekBar.value);
    DOM.voiceAudio.currentTime = (seekPercent / 100) * DOM.voiceAudio.duration;
  }

  function updateVoiceProgress() {
    if (!DOM.voiceAudio || isNaN(DOM.voiceAudio.duration)) return;
    const current = DOM.voiceAudio.currentTime;
    const duration = DOM.voiceAudio.duration;

    if (DOM.voiceSeekBar) {
      DOM.voiceSeekBar.value = (current / duration) * 100;
    }
    if (DOM.voiceTimeCurrent) {
      DOM.voiceTimeCurrent.textContent = formatAudioTime(current);
    }
  }

  function formatAudioTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  /* ==========================================================================
     OUR STORY — THE ANNIVERSARY EXPERIENCE 2026
     Part 3: Cyprus-Bangladesh Clocks & Elapsed Counter, Unsent Letters, Diary & Formspree / Private Flow
     ========================================================================== */

  // Extend CONFIG with Unsent Letters & Diary definitions if not already present
  if (typeof CONFIG !== 'undefined') {
    if (!CONFIG.unsentLetters) {
      CONFIG.unsentLetters = [
        {
          id: 1,
          numberLabel: "Letter I",
          dateWritten: "Written on a Quiet Midnight",
          title: "For the Days You Doubted Your Own Light",
          excerpt: "“I never said this out loud at the time, because you were busy being strong for everyone else...”",
          paragraphs: [
            "Dearest Mysha,",
            "I never said this out loud at the time, because you were busy being strong for everyone else, carrying weights you rarely let anyone see.",
            "There were days when you questioned whether you were doing enough or becoming enough. If you could borrow my eyes for even five seconds, you would see a person of rare grace, fierce kindness, and unshakeable heart.",
            "Even on the days you feel tired or uncertain, your presence makes the world steadier for the people lucky enough to know you—especially me.",
            "Always proud of you, — Saajim"
          ]
        },
        {
          id: 2,
          numberLabel: "Letter II",
          dateWritten: "Written Across the Miles",
          title: "When Distance Felt Heavy",
          excerpt: "“There were evenings in Cyprus when a single message from you in Bangladesh changed the entire weight of the room...”",
          paragraphs: [
            "Dearest Mysha,",
            "There were evenings in Cyprus when the silence felt miles wide, and a single message or voice note from you in Bangladesh changed the entire weight of the room.",
            "Geography tries to convince people that closeness requires shared streets. Over these three years, we proved the opposite: real loyalty travels across time zones without losing a single degree of warmth.",
            "Thank you for never letting the miles turn us into strangers. No matter where life places us on the map, you are always right here in my daily thoughts.",
            "Across every meridian, — Saajim"
          ]
        },
        {
          id: 3,
          numberLabel: "Letter III",
          dateWritten: "Written for 14 November 2026",
          title: "What Three Years of You Taught Me",
          excerpt: "“If someone had asked me in 2023 what loyalty looked like, I would have given them a textbook answer. Now I know it has a name...”",
          paragraphs: [
            "Dearest Mysha,",
            "If someone had asked me before 14 November 2023 what true friendship looked like, I would have given them a textbook answer. Now I know it has a name, a laugh, and a history.",
            "Three years with you taught me that patience is louder than promises, that honesty is the highest form of care, and that having one person you can trust with your unedited truth is worth more than a crowd.",
            "Thank you for three unforgettable years of best friendship. I wouldn’t trade a single chapter of our journey for anything in this world.",
            "Your best friend, always, — Saajim"
          ]
        }
      ];
    }
  }

  // Cache additional DOM elements for Chapters 6 & 7 and Modals
  document.addEventListener("DOMContentLoaded", () => {
    DOM.clockCyprus = document.getElementById("clock-cyprus");
    DOM.clockBangladesh = document.getElementById("clock-bangladesh");
    DOM.timerYears = document.getElementById("timer-years");
    DOM.timerDays = document.getElementById("timer-days");
    DOM.timerHours = document.getElementById("timer-hours");
    DOM.timerMinutes = document.getElementById("timer-minutes");
    DOM.timerSeconds = document.getElementById("timer-seconds");
    DOM.ch6ContinueBtn = document.getElementById("ch6-continue-btn");

    DOM.diaryForm = document.getElementById("diary-form");
    DOM.diaryTitleInput = document.getElementById("diary-title-input");
    DOM.diaryTextarea = document.getElementById("diary-textarea");
    DOM.diaryCharCount = document.getElementById("diary-char-count");
    DOM.diarySendBtn = document.getElementById("diary-send-btn");
    DOM.diaryPrivateBtn = document.getElementById("diary-private-btn");
    DOM.diaryFeedbackMsg = document.getElementById("diary-feedback-msg");
    DOM.ch7ContinueBtn = document.getElementById("ch7-continue-btn");

    DOM.letterReaderModal = document.getElementById("letter-reader-modal");
    DOM.letterReaderDate = document.getElementById("letter-reader-date");
    DOM.letterReaderTitle = document.getElementById("letter-reader-title");
    DOM.letterReaderBody = document.getElementById("letter-reader-body");
    DOM.letterReaderClose = document.getElementById("letter-reader-close");

    DOM.confirmModal = document.getElementById("confirm-modal");
    DOM.confirmModalTitle = document.getElementById("confirm-modal-title");
    DOM.confirmModalBody = document.getElementById("confirm-modal-body");
    DOM.confirmProceedBtn = document.getElementById("confirm-proceed-btn");
    DOM.confirmCancelBtn = document.getElementById("confirm-cancel-btn");

    initChaptersSixAndSeven();
  });

  /* ==========================================================================
     1. CHAPTER 5: UNSENT LETTERS MODULE
     ========================================================================= */
  function initChaptersSixAndSeven() {
    // Bind Unsent Letter card triggers
    document.querySelectorAll(".open-letter-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const letterId = parseInt(e.currentTarget.getAttribute("data-letter-id"), 10);
        openLetterModal(letterId);
      });
    });

    if (DOM.letterReaderClose) DOM.letterReaderClose.addEventListener("click", closeLetterModal);
    document.querySelectorAll("[data-close-letter]").forEach(el => {
      el.addEventListener("click", closeLetterModal);
    });

    // Start Chapter 6 Live Clocks and Elapsed Timer
    startLiveCounters();

    if (DOM.ch6ContinueBtn) {
      DOM.ch6ContinueBtn.addEventListener("click", () => goToChapter(7));
    }

    // Initialize Chapter 7 Diary form
    initDiaryModule();

    if (DOM.ch7ContinueBtn) {
      DOM.ch7ContinueBtn.addEventListener("click", () => goToChapter(8));
    }
  }

  function openLetterModal(letterId) {
    const letter = CONFIG.unsentLetters.find(l => l.id === letterId);
    if (!letter || !DOM.letterReaderModal) return;

    if (DOM.letterReaderDate) DOM.letterReaderDate.textContent = `${letter.numberLabel} • ${letter.dateWritten}`;
    if (DOM.letterReaderTitle) DOM.letterReaderTitle.textContent = letter.title;
    if (DOM.letterReaderBody) {
      DOM.letterReaderBody.innerHTML = letter.paragraphs.map(p => `<p>${p}</p>`).join("");
    }

    DOM.letterReaderModal.classList.add("is-open");
    DOM.letterReaderModal.setAttribute("aria-hidden", "false");
  }

  function closeLetterModal() {
    if (!DOM.letterReaderModal) return;
    DOM.letterReaderModal.classList.remove("is-open");
    DOM.letterReaderModal.setAttribute("aria-hidden", "true");
  }


  /* ==========================================================================
     2. CHAPTER 6: CYPRUS-BANGLADESH CLOCKS & ACCURATE ELAPSED TIME
     ========================================================================= */
  function startLiveCounters() {
    updateDualClocksAndTimer();
    if (STATE.clockIntervalId) clearInterval(STATE.clockIntervalId);
    STATE.clockIntervalId = setInterval(updateDualClocksAndTimer, 1000);
  }

  function updateDualClocksAndTimer() {
    const now = new Date();

    // Update Cyprus Local Time (Asia/Nicosia)
    if (DOM.clockCyprus) {
      try {
        DOM.clockCyprus.textContent = new Intl.DateTimeFormat('en-GB', {
          timeZone: CONFIG.locations.cyprus.timeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).format(now);
      } catch {
        DOM.clockCyprus.textContent = now.toLocaleTimeString();
      }
    }

    // Update Bangladesh Local Time (Asia/Dhaka)
    if (DOM.clockBangladesh) {
      try {
        DOM.clockBangladesh.textContent = new Intl.DateTimeFormat('en-GB', {
          timeZone: CONFIG.locations.bangladesh.timeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).format(now);
      } catch {
        DOM.clockBangladesh.textContent = now.toLocaleTimeString();
      }
    }

    // Compute exact elapsed time since 14 November 2023 00:00:00 (Bangladesh UTC+6)
    const startDate = new Date(CONFIG.meta.startDateISO);
    let diffMs = now.getTime() - startDate.getTime();
    if (diffMs < 0) diffMs = 0;

    const diffSeconds = Math.floor(diffMs / 1000);
    const seconds = diffSeconds % 60;
    const diffMinutes = Math.floor(diffSeconds / 60);
    const minutes = diffMinutes % 60;
    const diffHours = Math.floor(diffMinutes / 60);
    const hours = diffHours % 24;
    const diffDaysTotal = Math.floor(diffHours / 24);

    // Approximate years and remaining days for display
    const years = Math.floor(diffDaysTotal / 365.25);
    const days = Math.floor(diffDaysTotal % 365.25);

    if (DOM.timerYears) DOM.timerYears.textContent = years;
    if (DOM.timerDays) DOM.timerDays.textContent = days;
    if (DOM.timerHours) DOM.timerHours.textContent = String(hours).padStart(2, '0');
    if (DOM.timerMinutes) DOM.timerMinutes.textContent = String(minutes).padStart(2, '0');
    if (DOM.timerSeconds) DOM.timerSeconds.textContent = String(seconds).padStart(2, '0');
  }


  /* ==========================================================================
     3. CHAPTER 7: PRIVATE DIARY & FORMSPREE / PRIVATE SUBMISSION FLOW
     ========================================================================= */
  function initDiaryModule() {
    if (!DOM.diaryTextarea) return;

    DOM.diaryTextarea.addEventListener("input", () => {
      if (DOM.diaryTextarea.value.length > CONFIG.diary.maxChars) {
        DOM.diaryTextarea.value = DOM.diaryTextarea.value.slice(0, CONFIG.diary.maxChars);
      }
      const currentLen = DOM.diaryTextarea.value.length;
      if (DOM.diaryCharCount) {
        DOM.diaryCharCount.textContent = `${currentLen} / ${CONFIG.diary.maxChars} characters`;
      }
    });

    if (DOM.diarySendBtn) {
      DOM.diarySendBtn.addEventListener("click", () => requestDiaryAction("SEND"));
    }

    if (DOM.diaryPrivateBtn) {
      DOM.diaryPrivateBtn.addEventListener("click", () => requestDiaryAction("PRIVATE"));
    }

    // Confirmation Modal buttons
    if (DOM.confirmProceedBtn) {
      DOM.confirmProceedBtn.addEventListener("click", executeConfirmedDiaryAction);
    }
    if (DOM.confirmCancelBtn) {
      DOM.confirmCancelBtn.addEventListener("click", closeConfirmModal);
    }
    document.querySelectorAll("[data-close-confirm]").forEach(el => {
      el.addEventListener("click", closeConfirmModal);
    });
  }

  function requestDiaryAction(actionType) {
    if (!DOM.diaryTextarea) return;
    const text = DOM.diaryTextarea.value.trim();
    if (!text) {
      if (DOM.diaryFeedbackMsg) DOM.diaryFeedbackMsg.textContent = CONFIG.diary.emptyWarning;
      showToast(CONFIG.diary.emptyWarning);
      return;
    }

    STATE.pendingDiaryAction = actionType;

    if (DOM.confirmModalTitle && DOM.confirmModalBody && DOM.confirmProceedBtn) {
      if (actionType === "SEND") {
        DOM.confirmModalTitle.textContent = CONFIG.diary.sendConfirmTitle;
        DOM.confirmModalBody.textContent = CONFIG.diary.sendConfirmBody;
        const label = DOM.confirmProceedBtn.querySelector("span");
        if (label) label.textContent = "Yes, Send to Saajim";
      } else if (actionType === "PRIVATE") {
        DOM.confirmModalTitle.textContent = CONFIG.diary.privateConfirmTitle;
        DOM.confirmModalBody.textContent = CONFIG.diary.privateConfirmBody;
        const label = DOM.confirmProceedBtn.querySelector("span");
        if (label) label.textContent = "Yes, Email to My Gmail";
      }
    }

    if (!DOM.confirmModal) {
      showToast("The confirmation window is unavailable. Please refresh and try again.");
      return;
    }
    DOM.confirmModal.classList.add("is-open");
    DOM.confirmModal.setAttribute("aria-hidden", "false");
  }

  function closeConfirmModal() {
    if (!DOM.confirmModal) return;
    DOM.confirmModal.classList.remove("is-open");
    DOM.confirmModal.setAttribute("aria-hidden", "true");
    STATE.pendingDiaryAction = null;
  }

  async function executeConfirmedDiaryAction() {
    const action = STATE.pendingDiaryAction;
    closeConfirmModal();

    if (action === "PRIVATE" || action === "SEND") {
      await submitDiaryToFormspree(action);
    }
  }

  async function submitDiaryToFormspree(actionType) {
    const titleVal = DOM.diaryTitleInput ? DOM.diaryTitleInput.value.trim() : "";
    const messageVal = DOM.diaryTextarea ? DOM.diaryTextarea.value.trim() : "";
    if (!messageVal) return;

    if (STATE.isSubmittingDiary) return;
    STATE.isSubmittingDiary = true;

    if (DOM.diarySendBtn) DOM.diarySendBtn.disabled = true;
    if (DOM.diaryPrivateBtn) DOM.diaryPrivateBtn.disabled = true;

    const isPrivate = actionType === "PRIVATE";
    const endpoint = isPrivate
      ? CONFIG.diary.privateFormspreeEndpoint
      : CONFIG.diary.formspreeEndpoint;
    const sendingStatus = isPrivate
      ? "Sending your private entry to your Gmail..."
      : CONFIG.diary.sendingStatus;
    const successStatus = isPrivate
      ? CONFIG.diary.privateSuccessStatus
      : CONFIG.diary.sendSuccessStatus;
    const errorStatus = isPrivate
      ? CONFIG.diary.privateErrorStatus
      : CONFIG.diary.sendErrorStatus;

    if (!endpoint || endpoint.includes("YOUR_FORM_ID")) {
      STATE.isSubmittingDiary = false;
      if (DOM.diarySendBtn) DOM.diarySendBtn.disabled = false;
      if (DOM.diaryPrivateBtn) DOM.diaryPrivateBtn.disabled = false;
      if (DOM.diaryFeedbackMsg) DOM.diaryFeedbackMsg.textContent = errorStatus;
      showToast(errorStatus);
      return;
    }

    if (DOM.diaryFeedbackMsg) DOM.diaryFeedbackMsg.textContent = sendingStatus;
    showToast(sendingStatus);

    const payload = {
      subject: titleVal
        ? `${isPrivate ? "Private Diary" : "Anniversary Diary"}: ${titleVal}`
        : (isPrivate ? "Private Anniversary Diary Entry" : "Anniversary Diary Entry from Mysha"),
      message: messageVal,
      delivery_choice: isPrivate ? "KEEP_PRIVATE_EMAIL_TO_MYSELF" : "SEND_TO_SAAJIM",
      timestamp: new Date().toISOString()
    };

    let timeoutId;
    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), CONFIG.diary.requestTimeoutMs || 15000);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      if (!response.ok) {
        let detail = "";
        try {
          const result = await response.json();
          detail = result?.errors?.map(item => item.message).join("; ") || "";
        } catch (_) {}
        throw new Error(detail || `Formspree returned HTTP ${response.status}`);
      }

      if (DOM.diaryFeedbackMsg) DOM.diaryFeedbackMsg.textContent = successStatus;
      showToast(successStatus);
      if (DOM.diaryTitleInput) DOM.diaryTitleInput.value = "";
      if (DOM.diaryTextarea) DOM.diaryTextarea.value = "";
      if (DOM.diaryCharCount) DOM.diaryCharCount.textContent = `0 / ${CONFIG.diary.maxChars} characters`;
    } catch (err) {
      console.warn("Formspree submission error:", err);
      if (DOM.diaryFeedbackMsg) DOM.diaryFeedbackMsg.textContent = errorStatus;
      showToast(errorStatus);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      STATE.isSubmittingDiary = false;
      if (DOM.diarySendBtn) DOM.diarySendBtn.disabled = false;
      if (DOM.diaryPrivateBtn) DOM.diaryPrivateBtn.disabled = false;
    }
  }
  /* ==========================================================================
     OUR STORY — THE ANNIVERSARY EXPERIENCE 2026
     Part 4: Secret Letter, Hidden Ending, Chapter 8 Finale, Restart & Final Polish
     ========================================================================== */

  // Cache final DOM elements for Chapter 8, Secret Letter, and Hidden Ending
  document.addEventListener("DOMContentLoaded", () => {
    DOM.chapter8 = document.getElementById("chapter-8");
    DOM.secretLetterTriggerBtn = document.getElementById("secret-letter-trigger-btn");
    DOM.secretLetterModal = document.getElementById("secret-letter-modal");
    DOM.secretLetterCloseBtn = document.getElementById("secret-letter-close-btn");
    DOM.hiddenEndingUnlockBtn = document.getElementById("hidden-ending-unlock-btn");
    DOM.hiddenEndingOverlay = document.getElementById("hidden-ending-overlay");
    DOM.hiddenEndingCloseBtn = document.getElementById("hidden-ending-close-btn");
    DOM.restartJourneyBtn = document.getElementById("restart-journey-btn");

    initFinaleAndUnlocksModule();
  });

  /* ==========================================================================
     1. FINALE, SECRET LETTER & HIDDEN ENDING MODULE
     ========================================================================= */
  function initFinaleAndUnlocksModule() {
    // Secret letter trigger button
    if (DOM.secretLetterTriggerBtn) {
      DOM.secretLetterTriggerBtn.addEventListener("click", () => {
        if (STATE.visitedChapters.size >= 8 || STATE.secretUnlocked) {
          openSecretLetter();
        } else {
          showToast(CONFIG.secretLetter.lockedHint);
        }
      });
    }

    // Close secret letter modal
    if (DOM.secretLetterCloseBtn) {
      DOM.secretLetterCloseBtn.addEventListener("click", closeSecretLetter);
    }
    document.querySelectorAll("[data-close-secret]").forEach(el => {
      el.addEventListener("click", closeSecretLetter);
    });

    // Hidden ending unlock button inside secret letter
    if (DOM.hiddenEndingUnlockBtn) {
      DOM.hiddenEndingUnlockBtn.addEventListener("click", () => {
        closeSecretLetter();
        unlockAndOpenHiddenEnding();
      });
    }

    // Close hidden ending overlay
    if (DOM.hiddenEndingCloseBtn) {
      DOM.hiddenEndingCloseBtn.addEventListener("click", closeHiddenEnding);
    }

    // Restart Journey button
    if (DOM.restartJourneyBtn) {
      DOM.restartJourneyBtn.addEventListener("click", restartExperience);
    }

    // Global keyboard escape listener for modals and drawers
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeLightbox();
        closeLetterModal();
        closeConfirmModal();
        closeSecretLetter();
        closeHiddenEnding();
        toggleNavDrawer(false);
      }
    });

    // Final check on initial load in case state was restored from sessionStorage
    checkSecretUnlockStatusFinal();
  }

  function checkSecretUnlockStatusFinal() {
    if (STATE.visitedChapters.size >= 8 || STATE.secretUnlocked) {
      STATE.secretUnlocked = true;
      if (DOM.secretLetterTriggerBtn) {
        DOM.secretLetterTriggerBtn.classList.remove("is-locked");
        DOM.secretLetterTriggerBtn.removeAttribute("disabled");
        DOM.secretLetterTriggerBtn.setAttribute("aria-disabled", "false");
      }
      if (DOM.secretLetterLockMsg) {
        DOM.secretLetterLockMsg.textContent = CONFIG.secretLetter.unlockedHint;
      }
    }
  }

  function openSecretLetter() {
    if (!DOM.secretLetterModal) return;
    DOM.secretLetterModal.classList.add("is-open");
    DOM.secretLetterModal.setAttribute("aria-hidden", "false");
  }

  function closeSecretLetter() {
    if (!DOM.secretLetterModal) return;
    DOM.secretLetterModal.classList.remove("is-open");
    DOM.secretLetterModal.setAttribute("aria-hidden", "true");
  }

  function unlockAndOpenHiddenEnding() {
    STATE.hiddenEndingUnlocked = true;
    saveSessionStateFinal();

    if (!DOM.hiddenEndingOverlay) return;
    DOM.hiddenEndingOverlay.classList.add("is-open");
    DOM.hiddenEndingOverlay.setAttribute("aria-hidden", "false");
  }

  function closeHiddenEnding() {
    if (!DOM.hiddenEndingOverlay) return;
    DOM.hiddenEndingOverlay.classList.remove("is-open");
    DOM.hiddenEndingOverlay.setAttribute("aria-hidden", "true");
  }

  function saveSessionStateFinal() {
    try {
      const sessionData = {
        isUnlocked: STATE.isUnlocked,
        currentChapter: STATE.currentChapter,
        visitedChapters: Array.from(STATE.visitedChapters),
        secretUnlocked: STATE.secretUnlocked,
        hiddenEndingUnlocked: STATE.hiddenEndingUnlocked
      };
      sessionStorage.setItem(CONFIG.meta.storageKey, JSON.stringify(sessionData));
    } catch (err) {
      console.warn("Session storage save restricted:", err);
    }
  }

  function restartExperience() {
    try {
      sessionStorage.removeItem(CONFIG.meta.storageKey);
    } catch (err) {
      console.warn("Session storage clear restricted:", err);
    }
    window.location.reload();
  }

  /* ==========================================================================
     2. FINAL SAFETY CHECK & GLOBAL ERROR BOUNDARY
     ========================================================================= */

  window.addEventListener("error", (event) => {
    console.warn("Runtime notice:", event.message);
  });

})();
