/**********************************************
 *  COUNTDOWN
 **********************************************/
const countdownEl = document.getElementById("countdown");
const launchDate = new Date("2025-07-30T12:00:00+05:30").getTime();


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

/**********************************************
 *  FIREBASE COMPAT INIT
 **********************************************/
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

/**********************************************
 *  WAITLIST COUNT LISTENER
 **********************************************/
const peopleEl = document.getElementById("people");

counterRef.onSnapshot((docSnap) => {
  if (docSnap.exists) {
    peopleEl.textContent = docSnap.data().count.toLocaleString();
  } else {
    counterRef.set({ count: 0 });
  }
});

/**********************************************
 *  SUBSCRIBE BUTTON
 **********************************************/
document.getElementById("subscribe-btn").addEventListener("click", async () => {
  try {
    await db.runTransaction(async (transaction) => {
      const snap = await transaction.get(counterRef);
      const current = snap.data()?.count ?? 0;
      transaction.update(counterRef, { count: current + 1 });
    });
await Swal.fire({
  title: "You're on the list! 🎉",
  html: `
    <p style="font-size:1.05rem; margin-bottom: 0.75rem;">
      Thanks for supporting <strong>Projenius</strong>!
    </p>
    <p style="font-size:0.95rem; color:#aaa;">
      We’ll let you know the moment we go live.
    </p>
  `,
  icon: "success",
  confirmButtonText: "Can't wait!",
  backdrop: "rgba(0, 0, 0, 0.85)",
});
  } catch (err) {
    console.error("Transaction failed: ", err);
  }
});
