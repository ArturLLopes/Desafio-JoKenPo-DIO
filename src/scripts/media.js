const video = document.querySelector('.bg-video .video');
const breakpoint = 768; // Ajuste conforme necessário

window.addEventListener('resize', () => {
  if (window.innerWidth <= breakpoint) {
    video.classList.add('hidden');
  } else {
    video.classList.remove('hidden');
  }
});