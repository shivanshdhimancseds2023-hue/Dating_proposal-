(function () {
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const card = document.querySelector('.proposal-card');
  const finalScreen = document.querySelector('.final-screen');

  let dodgeCount = 0;
  const noTexts = [
    'No',
    'Are you sure?',
    'Really?',
    'Think again!',
    'Surbhi, please 🥺',
    'Last chance!',
    'Pretty please?',
    "You're breaking my heart 💔",
    'Just say Yes!',
    "I'll keep asking...",
  ];

  function moveNoButton() {
    dodgeCount++;
    const rect = noBtn.getBoundingClientRect();

    if (noBtn.style.position !== 'fixed') {
      noBtn.style.position = 'fixed';
      noBtn.style.left = rect.left + 'px';
      noBtn.style.top = rect.top + 'px';
      noBtn.style.margin = '0';
      // force reflow so the browser registers the starting position
      void noBtn.offsetWidth;
    }

    requestAnimationFrame(() => {
      const padding = 20;
      const maxX = Math.max(padding, window.innerWidth - rect.width - padding);
      const maxY = Math.max(padding, window.innerHeight - rect.height - padding);
      const newX = padding + Math.random() * (maxX - padding);
      const newY = padding + Math.random() * (maxY - padding);
      noBtn.style.left = newX + 'px';
      noBtn.style.top = newY + 'px';
    });

    noBtn.textContent = noTexts[Math.min(dodgeCount, noTexts.length - 1)];

    const scale = Math.min(1 + dodgeCount * 0.08, 2.2);
    yesBtn.style.transform = `scale(${scale})`;
  }

  noBtn.addEventListener('mouseenter', moveNoButton);
  noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
  });
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
  }, { passive: false });

  function launchConfetti() {
    const colors = ['#ff4d79', '#ff8fa3', '#ffe0eb', '#ff2e63', '#ffffff'];
    const bursts = [
      { particleCount: 120, spread: 100, origin: { y: 0.6 } },
      { particleCount: 80, angle: 60, spread: 70, origin: { x: 0 } },
      { particleCount: 80, angle: 120, spread: 70, origin: { x: 1 } },
    ];
    bursts.forEach((opts, i) => {
      setTimeout(() => {
        confetti(Object.assign({ colors }, opts));
      }, i * 250);
    });
  }

  yesBtn.addEventListener('click', () => {
    card.classList.add('hidden');
    finalScreen.classList.add('visible');
    launchConfetti();
    if (typeof window.triggerHeartBurst === 'function') {
      window.triggerHeartBurst();
    }
  });
})();
