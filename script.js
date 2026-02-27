// Header scroll effect
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth horizontal scrolling for movie rows
const rows = document.querySelectorAll('.row-slider');

rows.forEach(row => {
    let isDown = false;
    let startX;
    let scrollLeft;

    row.addEventListener('mousedown', (e) => {
        isDown = true;
        row.style.cursor = 'grabbing';
        startX = e.pageX - row.offsetLeft;
        scrollLeft = row.scrollLeft;
    });

    row.addEventListener('mouseleave', () => {
        isDown = false;
        row.style.cursor = 'grab';
    });

    row.addEventListener('mouseup', () => {
        isDown = false;
        row.style.cursor = 'grab';
    });

    row.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - row.offsetLeft;
        const walk = (x - startX) * 2;
        row.scrollLeft = scrollLeft - walk;
    });

    // Add cursor style
    row.style.cursor = 'grab';
});

// Add keyboard navigation for rows
document.addEventListener('keydown', (e) => {
    const focusedRow = document.activeElement.closest('.row-slider');
    if (!focusedRow) return;

    if (e.key === 'ArrowLeft') {
        focusedRow.scrollBy({ left: -320, behavior: 'smooth' });
    } else if (e.key === 'ArrowRight') {
        focusedRow.scrollBy({ left: 320, behavior: 'smooth' });
    }
});

// Movie card click handler
const movieCards = document.querySelectorAll('.movie-card');

movieCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Prevent click if dragging
        if (e.currentTarget.closest('.row-slider').classList.contains('dragging')) {
            return;
        }

        const title = card.dataset.title;
        const year = card.dataset.year;
        const rating = card.dataset.rating;

        // Create modal
        showMovieModal(title, year, rating);
    });
});

// Show movie modal
function showMovieModal(title, year, rating) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.movie-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'movie-modal';
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-hero" style="background: url('https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=1920&q=80') center/cover;">
                <div class="modal-gradient"></div>
                <div class="modal-info">
                    <h1>${title}</h1>
                    <div class="modal-meta">
                        <span class="match">98% Match</span>
                        <span>${year}</span>
                        <span>TV-MA</span>
                        <span>Rating: ${rating}</span>
                    </div>
                    <div class="modal-buttons">
                        <button class="btn btn-play">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                            Play
                        </button>
                        <button class="modal-icon-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 5v14M5 12h14"/>
                            </svg>
                        </button>
                        <button class="modal-icon-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10 9 9 9 8 9"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="modal-details">
                <p class="modal-description">
                    ${generateDescription(title)}
                </p>
                <div class="modal-cast">
                    <p><strong>Cast:</strong> Actor One, Actor Two, Actor Three, Actor Four</p>
                    <p><strong>Genres:</strong> Drama, Thriller, Mystery</p>
                    <p><strong>This show is:</strong> Suspenseful, Dark, Emotional</p>
                </div>
            </div>
        </div>
    `;

    // Add styles for modal
    const style = document.createElement('style');
    style.textContent = `
        .movie-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }

        .modal-content {
            position: relative;
            width: 90%;
            max-width: 850px;
            max-height: 90vh;
            background: var(--netflix-black);
            border-radius: 8px;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .modal-close {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: var(--netflix-black);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s ease;
        }

        .modal-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .modal-hero {
            position: relative;
            height: 400px;
            display: flex;
            align-items: flex-end;
            padding: 40px;
        }

        .modal-gradient {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 200px;
            background: linear-gradient(transparent, var(--netflix-black));
        }

        .modal-info {
            position: relative;
            z-index: 1;
        }

        .modal-info h1 {
            font-size: 3rem;
            margin-bottom: 15px;
        }

        .modal-meta {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
            font-size: 1rem;
        }

        .modal-buttons {
            display: flex;
            gap: 10px;
        }

        .modal-icon-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.5);
            background: rgba(42, 42, 42, 0.6);
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .modal-icon-btn:hover {
            border-color: white;
            background: rgba(255, 255, 255, 0.1);
        }

        .modal-details {
            padding: 40px;
        }

        .modal-description {
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        .modal-cast p {
            margin-bottom: 15px;
            color: var(--netflix-light-gray);
        }

        .modal-content::-webkit-scrollbar {
            width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
            background: var(--netflix-dark);
        }

        .modal-content::-webkit-scrollbar-thumb {
            background: var(--netflix-gray);
            border-radius: 4px;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);

    // Close modal handlers
    const closeBtn = modal.querySelector('.modal-close');
    const backdrop = modal.querySelector('.modal-backdrop');

    const closeModal = () => {
        modal.remove();
        style.remove();
    };

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    // Close on ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// Generate random description
function generateDescription(title) {
    const descriptions = [
        `${title} is a gripping tale that will keep you on the edge of your seat. With stunning performances and breathtaking cinematography, this series has captivated audiences worldwide. Dive into a world where every episode brings new surprises and unforgettable moments.`,
        `Experience the phenomenon that is ${title}. This critically acclaimed series combines masterful storytelling with compelling characters that stay with you long after the credits roll. Join millions of viewers who have made this their must-watch show.`,
        `${title} delivers an unforgettable viewing experience that pushes the boundaries of television. With its innovative approach to storytelling and stellar cast, this series has redefined what quality entertainment means in the streaming era.`
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// Play button handlers
const playButtons = document.querySelectorAll('.btn-play');
playButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPlayMessage();
    });
});

const infoButtons = document.querySelectorAll('.btn-info');
infoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const heroTitle = document.querySelector('.hero-title').textContent;
        showMovieModal(heroTitle, '2016', '8.8');
    });
});

function showPlayMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(229, 9, 20, 0.95);
        color: white;
        padding: 30px 50px;
        border-radius: 8px;
        font-size: 1.5rem;
        font-weight: bold;
        z-index: 100000;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        animation: fadeIn 0.3s ease;
    `;
    message.textContent = '▶ Now Playing...';
    document.body.appendChild(message);

    setTimeout(() => {
        message.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => message.remove(), 300);
    }, 2000);
}

// Add fade out animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(fadeOutStyle);

console.log('%c🎬 Welcome to Netflix!', 'color: #E50914; font-size: 24px; font-weight: bold;');
console.log('%cEnjoy unlimited movies and TV shows!', 'color: #ffffff; font-size: 14px;');
