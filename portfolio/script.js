function changeName() {
  const nameElement = document.querySelector('.name-title');
  if (nameElement) {
    nameElement.textContent = nameElement.textContent === 'KhennJhay' ? 'Whiteisbluu' : 'KhennJhay';
  }
}

function togglePanel(targetId) {
  const panels = document.querySelectorAll('.expand-panel');
  panels.forEach(panel => {
    if (panel.id === targetId) {
      panel.classList.toggle('open');
    } else {
      panel.classList.remove('open');
    }
  });
}

window.changeName = changeName;
window.togglePanel = togglePanel;

const nameTitleBtn = document.getElementById('nameTitleBtn');
if (nameTitleBtn) {
  nameTitleBtn.addEventListener('click', changeName);
}

document.querySelectorAll('.open-modal-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-panel');
    if (target) togglePanel(target);
  });
});

const settingsBtn = document.getElementById('settingsBtn');
const dashboard = document.getElementById('dashboard');
const dashboardOverlay = document.getElementById('dashboardOverlay');
const pageItems = document.querySelectorAll('.page-item');

function openDashboard() {
  dashboard.classList.add('open');
  dashboardOverlay.classList.add('open');
  settingsBtn.classList.add('open');
  document.body.classList.add('sheet-lock');
}

function closeDashboard() {
  dashboard.classList.remove('open');
  dashboardOverlay.classList.remove('open');
  settingsBtn.classList.remove('open');
  document.body.classList.remove('sheet-lock');
}

if (settingsBtn) {
  settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (dashboard.classList.contains('open')) {
      closeDashboard();
    } else {
      openDashboard();
    }
  });
}

if (dashboardOverlay) {
  dashboardOverlay.addEventListener('click', closeDashboard);
}

pageItems.forEach(item => {
  item.addEventListener('click', () => {
    const targetId = item.getAttribute('data-target');
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      pageItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      document.documentElement.classList.add('menu-navigating');
      window.scrollTo({
        top: targetSection.offsetTop,
        behavior: 'smooth'
      });
      setTimeout(() => {
        document.documentElement.classList.remove('menu-navigating');
      }, 700);
      setTimeout(closeDashboard, 150);
    }
  });
});

const sections = document.querySelectorAll('.part');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.id;
        pageItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('data-target') === currentId) {
            item.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(section => observer.observe(section));
}

const songs = [
  { id: 'LBhcqYqeu0U', title: 'Lemonade', artist: 'aespa' },
  { id: 'fyk6vjwI3wc', title: 'Supernova Love', artist: 'IVE' },
  { id: 'zhHB4dZTChw', title: '404 (New Era)', artist: 'KiiiKiii' }
];

const nowPlaying = document.getElementById('nowPlaying');
const npArt = document.getElementById('npArt');
const npTitle = document.getElementById('npTitle');
const npArtist = document.getElementById('npArtist');
const npPlay = document.getElementById('npPlay');
const npNext = document.getElementById('npNext');
const npPrev = document.getElementById('npPrev');
const npQueue = document.getElementById('npQueue');
const queuePanel = document.getElementById('queuePanel');
const queueList = document.getElementById('queueList');
const loader = document.getElementById('loader');

let ytPlayer;
let musicPlaying = false;
let userClickedEnter = false;
let currentSongIndex = Math.floor(Math.random() * songs.length);
let previousSongIndex = -1;

function updateNowPlaying(song) {
  if (npTitle) npTitle.textContent = song.title;
  if (npArtist) npArtist.textContent = song.artist;
  if (npArt) npArt.src = `https://i.ytimg.com/vi/${song.id}/mqdefault.jpg`;
  updateQueue();
}

function updateQueue() {
  if (!queueList) return;
  queueList.innerHTML = '';
  songs.forEach((song, index) => {
    const item = document.createElement('div');
    item.className = 'queue-item' + (index === currentSongIndex ? ' active' : '');
    item.innerHTML = `
      <span class="queue-item-index">${index + 1}</span>
      <img class="queue-item-art" src="https://i.ytimg.com/vi/${song.id}/mqdefault.jpg" alt="">
      <div class="queue-item-info">
        <div class="queue-item-title">${song.title}</div>
        <div class="queue-item-artist">${song.artist}</div>
      </div>
    `;
    item.addEventListener('click', () => {
      loadSong(index);
      if (!musicPlaying) {
        musicPlaying = true;
        nowPlaying.classList.add('playing');
        if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
          ytPlayer.playVideo();
        }
      }
    });
    queueList.appendChild(item);
  });
}

function loadSong(index) {
  previousSongIndex = currentSongIndex;
  currentSongIndex = index;
  const song = songs[currentSongIndex];
  updateNowPlaying(song);
  if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
    ytPlayer.loadVideoById(song.id);
  }
}

function nextSong() {
  let nextIndex;
  if (songs.length > 1) {
    do {
      nextIndex = Math.floor(Math.random() * songs.length);
    } while (nextIndex === currentSongIndex);
  } else {
    nextIndex = 0;
  }
  loadSong(nextIndex);
}

function prevSong() {
  if (previousSongIndex >= 0 && previousSongIndex !== currentSongIndex) {
    loadSong(previousSongIndex);
  } else {
    let prevIndex;
    if (songs.length > 1) {
      do {
        prevIndex = Math.floor(Math.random() * songs.length);
      } while (prevIndex === currentSongIndex);
    } else {
      prevIndex = 0;
    }
    loadSong(prevIndex);
  }
}

setTimeout(() => {
  if (loader) loader.classList.add('ready');
}, 500);

if (loader) {
  loader.addEventListener('click', () => {
    if (!loader.classList.contains('ready')) return;

    loader.classList.add('hidden');
    userClickedEnter = true;
    musicPlaying = true;
    if (nowPlaying) nowPlaying.classList.add('playing');

    if (ytPlayer && typeof ytPlayer.unMute === 'function') {
      ytPlayer.unMute();
    }

    if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
      ytPlayer.playVideo();
    }
  });
}

window.onYouTubeIframeAPIReady = function () {
  const startSong = songs[currentSongIndex];
  updateNowPlaying(startSong);

  ytPlayer = new YT.Player('ytplayer', {
    width: '500',
    height: '500',
    videoId: startSong.id,
    playerVars: {
      autoplay: 0,
      controls: 0,
      playsinline: 1
    },
    events: {
      onReady: function(event) {
        event.target.setVolume(50);
        if (userClickedEnter) {
          event.target.playVideo();
        }
      },
      onStateChange: function(event) {
        if (event.data === YT.PlayerState.ENDED) {
          nextSong();
        }
        if (event.data === YT.PlayerState.PLAYING) {
          musicPlaying = true;
          if (nowPlaying) nowPlaying.classList.add('playing');
        } else if (event.data === YT.PlayerState.PAUSED) {
          musicPlaying = false;
          if (nowPlaying) nowPlaying.classList.remove('playing');
        }
      }
    }
  });
};

if (npPlay) {
  npPlay.addEventListener('click', () => {
    musicPlaying = !musicPlaying;
    nowPlaying.classList.toggle('playing', musicPlaying);
    
    if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
      if (musicPlaying) {
        ytPlayer.playVideo();
      } else {
        ytPlayer.pauseVideo();
      }
    }
  });
}

if (npNext) npNext.addEventListener('click', nextSong);
if (npPrev) npPrev.addEventListener('click', prevSong);

if (npQueue) {
  npQueue.addEventListener('click', (e) => {
    e.stopPropagation();
    if (queuePanel) queuePanel.classList.toggle('open');
  });
}

document.addEventListener('click', (e) => {
  if (queuePanel && npQueue && !queuePanel.contains(e.target) && !npQueue.contains(e.target)) {
    queuePanel.classList.remove('open');
  }
});

const NP_IDLE_TIME = 7000;
let npIdleTimer = null;
const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

function npScheduleIdle() {
  clearTimeout(npIdleTimer);

  npIdleTimer = setTimeout(() => {
    if (nowPlaying) nowPlaying.classList.add('idle');
    if (queuePanel) queuePanel.classList.remove('open');
  }, NP_IDLE_TIME);
}

function npActivatePlayer() {
  clearTimeout(npIdleTimer);
  if (nowPlaying) nowPlaying.classList.remove('idle');
  npScheduleIdle();
}

if (nowPlaying) {
  nowPlaying.classList.add('idle');
  npScheduleIdle();
}

function npShouldWake(target) {
  if (loader && !loader.classList.contains('hidden')) return false;
  if (!isTouchDevice) return true;

  return (nowPlaying && nowPlaying.contains(target)) ||
         (queuePanel && queuePanel.contains(target)) ||
         (loader && loader.contains(target));
}

['click', 'keydown', 'touchstart'].forEach(evt => {
  document.addEventListener(evt, (e) => {
    if (evt === 'keydown') {
      if (loader && !loader.classList.contains('hidden')) return;
      npActivatePlayer();
      return;
    }

    if (!npShouldWake(e.target)) return;
    npActivatePlayer();
  });
});

if (nowPlaying) {
  nowPlaying.addEventListener('click', () => {
    if (loader && !loader.classList.contains('hidden')) return;
    npActivatePlayer();
  });
}

const tapeDivider = document.querySelector('.tape-divider');
const lyricsTape = document.querySelector('.lyrics-tape');
if (tapeDivider && lyricsTape) {
  tapeDivider.appendChild(lyricsTape);
}

document.querySelectorAll('.tape-seq span').forEach(lyric => {
  lyric.textContent = lyric.textContent.replace(/\s*◆\s*/g, ' ');
});

const tapeLink = document.querySelector('.tape-divider .lyrics-tape');
if (tapeLink) {
  tapeLink.addEventListener('click', () => {
    window.open('https://shop-us.aespa.com', '_blank', 'noopener,noreferrer');
  });
}

const commissionsBtn = document.getElementById('commissionsBtn');
const commissionsMsg = document.getElementById('commissionsMsg');

if (commissionsBtn && commissionsMsg) {
  commissionsBtn.addEventListener('click', () => {
    commissionsMsg.classList.add('show');
    setTimeout(() => {
      commissionsMsg.classList.remove('show');
    }, 2000);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const cucumberFooter = document.getElementById('cucumberFooter');
  const catOverlay = document.getElementById('catOverlay');

  if (cucumberFooter && catOverlay) {
    cucumberFooter.addEventListener('click', () => {
      catOverlay.classList.add('show');
    });

    catOverlay.addEventListener('click', () => {
      catOverlay.classList.remove('show');
    });
  }
});

const splitTabs = document.querySelectorAll('.split-tab');
const splitPage = document.getElementById('splitPage');

if (splitPage) {
  splitTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      splitTabs.forEach(item => item.classList.remove('active'));
      tab.classList.add('active');
      splitPage.classList.toggle('show-arts', tab.getAttribute('data-split') === 'arts');
    });
  });
}

const sheetHandle = document.getElementById('sheetHandle');

if (sheetHandle && dashboard) {
  let sheetStartY = 0;
  let sheetCurrentY = 0;
  let sheetDragging = false;

  sheetHandle.addEventListener('touchstart', (e) => {
    sheetDragging = true;
    sheetStartY = e.touches[0].clientY;
    sheetCurrentY = 0;
    dashboard.style.transition = 'none';
  }, { passive: true });

  sheetHandle.addEventListener('touchmove', (e) => {
    if (!sheetDragging) return;
    sheetCurrentY = Math.max(0, e.touches[0].clientY - sheetStartY);
    dashboard.style.transform = 'translateY(' + sheetCurrentY + 'px)';
  }, { passive: true });

  sheetHandle.addEventListener('touchend', () => {
    if (!sheetDragging) return;
    sheetDragging = false;
    dashboard.style.transition = '';
    dashboard.style.transform = '';

    if (sheetCurrentY > 120) {
      closeDashboard();
    }

    sheetCurrentY = 0;
  });
}