const track = document.querySelector('.areas-track');
const nextBtn = document.querySelector('.areas-arrow.next');
const prevBtn = document.querySelector('.areas-arrow.prev');

const originalItems = Array.from(track.children);
originalItems.forEach(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
});

let index = 0;
let isTransitioning = false;
let autoSlide;
let resumeTimeout;

function getMoveDistance() {
    const firstCard = track.querySelector('.areas-card');
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.gap) || 0;
    return firstCard.offsetWidth + gap;
}

function moveCarousel() {
    const distance = getMoveDistance();
    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(-${index * distance}px)`;
}

function nextSlide() {
    if (isTransitioning) return;
    const totalOriginal = originalItems.length;
    index++;
    moveCarousel();

    if (index >= totalOriginal) {
        isTransitioning = true;
        setTimeout(() => {
            track.style.transition = 'none';
            index = 0;
            track.style.transform = 'translateX(0)';
            isTransitioning = false;
        }, 500);
    }
}

function prevSlide() {
    if (isTransitioning) return;
    const totalOriginal = originalItems.length;
    const distance = getMoveDistance();

    if (index <= 0) {
        track.style.transition = 'none';
        index = totalOriginal;
        track.style.transform = `translateX(-${index * distance}px)`;
    }

    setTimeout(() => {
        index--;
        moveCarousel();
    }, 20);
}

function startAutoSlide() {
    autoSlide = setInterval(nextSlide, 3000);
}

function resetAuto() {
    clearInterval(autoSlide);
    clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(startAutoSlide, 10000);
}

nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAuto();
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAuto();
});

track.addEventListener('touchstart', () => {
    resetAuto();
}, { passive: true });

window.addEventListener('resize', () => {
    track.style.transition = 'none';
    moveCarousel();
});

startAutoSlide();