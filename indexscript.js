const countdownEl = document.getElementById("countdown");
const launchDate = new Date("2025-07-22T17:30:00+05:30").getTime();

function updateCountdown() {
  const now = Date.now();
  const diff = launchDate - now;

  if (diff <= 0) {
    countdownEl.textContent = "We’re Live!";
    clearInterval(timer);
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  countdownEl.textContent = `${d}d ${h}h ${m}m ${s}s`;
}
const timer = setInterval(updateCountdown, 1000);
updateCountdown();
function confettiBurst() {
  const duration = 3 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}


const firebaseConfig = {
  apiKey: "AIzaSyDe0S5ZwZb-Kc2ZIdiPk03R2p41CJMSLwc",
  authDomain: "projenius-landing.firebaseapp.com",
  projectId: "projenius-landing",
  storageBucket: "projenius-landing.firebasestorage.app",
  messagingSenderId: "883830264781",
  appId: "1:883830264781:web:b341f715c1e3961d3aaa84",
  measurementId: "G-0NXF7243Y8"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const counterRef = db.collection("meta").doc("waitlistCount");

const peopleEl = document.getElementById("people");

counterRef.onSnapshot((docSnap) => {
  if (docSnap.exists) {
    peopleEl.textContent = docSnap.data().count.toLocaleString();
  } else {
    counterRef.set({ count: 0 });
  }
});

document.getElementById("subscribe-btn").addEventListener("click", async () => {
  try {
    await db.runTransaction(async (transaction) => {
      const snap = await transaction.get(counterRef);
      const current = snap.data()?.count ?? 0;
      transaction.update(counterRef, { count: current + 1 });
    });

    // Animate button pulse
    const btn = document.getElementById("subscribe-btn");
    btn.classList.add("pulse");
    setTimeout(() => btn.classList.remove("pulse"), 800);

    // Fancy SweetAlert2 popup
    await Swal.fire({
  title: `<span class="swal-title-glow">🎉 You're In!</span>`,
  html: `
    <p style="font-size:1.05rem; margin-bottom: 0.75rem;">
      Thanks for joining <strong style="color:#00fff2;">Projenius</strong>!
    </p>
    <p style="font-size:0.95rem; color:#aaa;">
      We'll notify you as soon as we go live. 🚀
    </p>
  `,
  icon: "success",
  confirmButtonText: "❤️ You're In!",
  customClass: {
 popup: 'glass-popup',
  },
  backdrop: `rgba(0,0,0,0.85)`,
  didOpen: () => {
    confettiBurst();  // Fire the celebration effect
  },

  // Confetti again when button is clicked
  preConfirm: () => {
    confettiBurst(); // Trigger again on confirmation
  },
});
  } catch (err) {
    console.error("Transaction failed: ", err);
  }
});

function confetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    confettiEffect({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confettiEffect({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// Alias for canvas-confetti
const confettiEffect = window.confetti;
