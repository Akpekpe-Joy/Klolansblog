
// cookie popup
const cookieContainer = document.querySelector(".cookie-container");
const acceptBtn = document.querySelector("#acceptBtn");
const declineBtn = document.querySelector("#declineBtn");
const undoBtn = document.querySelector("#undoBtn");
const overlay = document.querySelector('#cookieOverlay');



// On page load

document.addEventListener('DOMContentLoaded', () => {
  const choice = localStorage.getItem("cookieChoice");
  const undoShown = localStorage.getItem("undoShown");

  if (!choice) {
    showPopup();

    undoBtn.style.display = "none"; // no undo until choice
  } else {
    hidePopup();
    

    //  Show Undo only if it hasn't been shown before
    if (!undoShown) {
      undoBtn.style.display = "block";
    } else {
      undoBtn.style.display = "none";
    }
  }
});

// Accept
acceptBtn.addEventListener("click", () => {
  localStorage.setItem("cookieChoice", "accepted");
  hidePopup();
  showUndoOnce();
});

// Decline
declineBtn.addEventListener("click", () => {
  localStorage.setItem("cookieChoice", "declined");
  hidePopup();
  showUndoOnce();
});

// Undo button
undoBtn.addEventListener("click", () => {
  localStorage.removeItem("cookieChoice"); // reset choice
  localStorage.setItem("undoShown", "true"); // mark undo as used
  showPopup();
  undoBtn.style.display = "none";          // hide permanently
});

// Helper: show undo only once
function showUndoOnce() {
  if (!localStorage.getItem("undoShown")) {
    undoBtn.style.display = "block"; // show undo
  }


}

function showPopup(){
  cookieContainer.classList.add('show');
  overlay.classList.add('show');
};
function hidePopup(){
  cookieContainer.classList.remove('show');
  overlay.classList.remove('show');
};
// end of cookie popup







// subscribe button popup
document.addEventListener('DOMContentLoaded', () =>{
  const openModal = document.getElementById('openModal');
  const modal = document.querySelector('.modal-container');
  const closeBtn = document.querySelector('.close-btn');
  const subscribeForm = document.getElementById('subscribeForm');

  if (!openModal || !modal || !closeBtn) return; // safety check

  openModal.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('active');
  });

  closeBtn.addEventListener('click', () =>{
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) =>{
    modal.classList.remove('active');
  });

  // handles subscribe form
  if(subscribeForm){
    subscribeForm.addEventListener('submit', (e) =>{
      e.preventDefault();
      alert('🎉 Thank you for subscribing!');
      subscribeForm.reset();
      modal.classList.remove('active');
    });
  }           

});

// end of subscribe popup




// carousel treding news

document.addEventListener('DOMContentLoaded', () => {

  const carouselBox = document.querySelector('.carousel-box');
  if (!carouselBox) return;

  const carousel = carouselBox.querySelector('.carousel');
  const cardsContainer = carouselBox.querySelector('.cards-box');
  const nextBtn = carouselBox.querySelector('.carousel-btn.next');
  const prevBtn = carouselBox.querySelector('.carousel-btn.prev');
  const dotsContainer = carouselBox.querySelector('.carousel-dots');

  if (!carousel || !cardsContainer || !nextBtn || !prevBtn || !dotsContainer) return;

  let cards = Array.from(cardsContainer.children);
  let visibleCards = 3; // default
  let currentIndex = visibleCards;
  const transitionTime = 300;
  const autoPlayInterval = 2000;
  let autoPlay;

  // --- Responsive visibleCards ---
  function updateVisibleCards() {
    const width = window.innerWidth;
    if (width < 600) visibleCards = 1;
    else if (width < 900) visibleCards = 2;
    else visibleCards = 3;
  }

  updateVisibleCards();
  window.addEventListener('resize', () => {
    const prevVisible = visibleCards;
    updateVisibleCards();
    if (prevVisible !== visibleCards) {
      resetCarousel();
    }
  });

  // --- Clone cards for infinite scroll ---
  function cloneCards() {
    cardsContainer.innerHTML = '';
    const prependClones = cards.slice(-visibleCards).map(c => c.cloneNode(true));
    const appendClones = cards.slice(0, visibleCards).map(c => c.cloneNode(true));
    prependClones.forEach(c => cardsContainer.appendChild(c));
    cards.forEach(c => cardsContainer.appendChild(c.cloneNode(true))); // original cards
    appendClones.forEach(c => cardsContainer.appendChild(c));
    cards = Array.from(cardsContainer.children);
    currentIndex = visibleCards;
  }

  cloneCards();

  // --- Update transform ---
  function updateTransform(animated = true) {
    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(cardsContainer).gap) || 0;
    cardsContainer.style.transition = animated ? `transform ${transitionTime}ms ease` : 'none';
    const move = (cardWidth + gap) * currentIndex;
    cardsContainer.style.transform = `translateX(${-move}px)`;
  }

  // --- Next/Prev ---
  const nextSlide = () => { currentIndex++; updateTransform(true); checkLoop(); };
  const prevSlide = () => { currentIndex--; updateTransform(true); checkLoop(); };

  // --- Looping ---
  function checkLoop() {
    setTimeout(() => {
      const totalCards = cards.length;
      if (currentIndex >= totalCards - visibleCards) currentIndex = visibleCards;
      if (currentIndex < visibleCards) currentIndex = totalCards - visibleCards * 2;
      updateTransform(false);
      updateDots();
    }, transitionTime);
  }

  // --- Dots ---
function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.className = i === 0 ? 'dot active' : 'dot';
        dot.dataset.index = i;
        dot.addEventListener('click', () => {
            const totalRealCards = cards.length - visibleCards * 2;
            const sectionLength = Math.ceil(totalRealCards / 3);
            currentIndex = visibleCards + i * sectionLength;
            updateTransform(true);
            updateDots();
        });
        dotsContainer.appendChild(dot);
    }
}

function updateDots() {
    const dots = dotsContainer.querySelectorAll('.dot');
    const totalRealCards = cards.length - visibleCards * 2;
    const sectionLength = Math.ceil(totalRealCards / 3);

    // determine which dot should be active
    let activeIndex = Math.floor((currentIndex - visibleCards) / sectionLength);
    if (activeIndex >= 3) activeIndex = 2; // ensure max index
    if (activeIndex < 0) activeIndex = 0;

    dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
}


  // --- Buttons ---
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // --- Autoplay ---
  function startAutoPlay() { autoPlay = setInterval(nextSlide, autoPlayInterval); }
  function stopAutoPlay() { clearInterval(autoPlay); }
  startAutoPlay();
  carouselBox.addEventListener('mouseenter', stopAutoPlay);
  carouselBox.addEventListener('mouseleave', startAutoPlay);

  // --- Touch Swipe ---
  let startX = 0, isDragging = false;
  cardsContainer.addEventListener('touchstart', e => { startX = e.touches[0].clientX; isDragging = true; stopAutoPlay(); }, { passive: true });
  cardsContainer.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX;
    const w = cards[0].offsetWidth + (parseFloat(getComputedStyle(cardsContainer).gap) || 0);
    cardsContainer.style.transition = 'none';
    cardsContainer.style.transform = `translateX(${-(w * currentIndex - diff)}px)`;
    if (Math.abs(diff) > 10) e.preventDefault();
  }, { passive: false });
  cardsContainer.addEventListener('touchend', e => {
    if (!isDragging) return;
    isDragging = false;
    const diff = e.changedTouches[0].clientX - startX;
    Math.abs(diff) > 50 ? (diff > 0 ? prevSlide() : nextSlide()) : updateTransform(true);
    startAutoPlay();
  }, { passive: true });

  // --- Reset carousel on resize ---
  function resetCarousel() {
    cloneCards();
    createDots();
    updateTransform(false);
  }

  // --- Initialize ---
  createDots();
  updateTransform(false);

});

// end of carousel








// story filter
document.addEventListener('DOMContentLoaded', ()=>{

    // get the query parameter(i.e the id)
    const params = new URLSearchParams(window.location.search);
    const storyId = params.get('id');

    // hide storie first
    document.querySelectorAll('.story').forEach(story => {
        story.style.display = 'none';
    });

    // show only the selected one
    if(storyId){
        const story = document.getElementById(storyId);
        if(story){
            story.style.display = 'block';
        }else{
            document.querySelector('.post-content').innerHTML = '<p>story not found.</p>'
        }
    }

});
// end of story filter



// chatbot
document.addEventListener('DOMContentLoaded', () => {
    const chat_body = document.querySelector('.chat-body');
    const message_input = document.querySelector('.message-input');
    const sendMessageButton = document.querySelector('#send-message');
    const fileInput = document.querySelector('#file-input');
    const fileUploadWrapper = document.querySelector('.file-upload-wrapper');
    const fileCancelButton = document.querySelector('#file-cancel');
    const chatbotToggler = document.querySelector('#chatbot-toggler');
    const closeChatbot = document.querySelector('#close-chatbot');

    const userData = {
        message: null,
        file: { data: null, mime_type: null }
    }

    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    const initialInputHeight = message_input.scrollHeight;

    // Create message element
    const createMessageElement = (content, ...classes) => {
        const div = document.createElement('div');
        div.classList.add('message', ...classes);
        div.innerHTML = content;
        return div;
    }

    // Restore previous chat
    chatHistory.forEach(msg => {
        const classes = msg.role === 'user' ? ['user-message'] : ['bot-message'];
        let messageContent = `<div class='message-text'>${msg.parts[0].text || ''}</div>`;
        if (msg.parts[0].inline_data) {
            const { data, mime_type } = msg.parts[0].inline_data;
            messageContent += `<img src='data:${mime_type};base64,${data}' class='attachment' />`;
        }
        chat_body.appendChild(createMessageElement(messageContent, ...classes));
    });
    chat_body.scrollTo({ top: chat_body.scrollHeight, behavior: 'smooth' });

    // Generate bot response
    const generateBotResponse = async (incomingMessageDiv) => {
        const messageElement = incomingMessageDiv.querySelector('.message-text');

        try {
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userData.message, file: userData.file })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to get bot response');

            messageElement.innerText = data.reply;

            // Save bot response to chatHistory
            chatHistory.push({
                role: 'model',
                parts: [{ text: data.reply }]
            });
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        } catch (error) {
            console.error(error);
            messageElement.innerText = error.message;
            messageElement.style.color = '#ff0000';
        } finally {
            userData.file = {};
            incomingMessageDiv.classList.remove('thinking');
            chat_body.scrollTo({ top: chat_body.scrollHeight, behavior: 'smooth' });
        }
    }

    // Handle outgoing user message
    const handleOutgoingMessage = (e) => {
        e.preventDefault();
        userData.message = message_input.value.trim();
        if (!userData.message && !userData.file.data) return;

        // Save user message immediately
        chatHistory.push({
            role: 'user',
            parts: [{ text: userData.message }, ...(userData.file.data ? [{ inline_data: userData.file }] : [])]
        });
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

        message_input.value = '';
        fileUploadWrapper.classList.remove('file-uploaded');
        message_input.dispatchEvent(new Event('input'));

        const messageContent = `<div class="message-text">${userData.message}</div>${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}`;
        const outgoingMessageDiv = createMessageElement(messageContent, 'user-message');
        chat_body.appendChild(outgoingMessageDiv);
        chat_body.scrollTo({ top: chat_body.scrollHeight, behavior: 'smooth' });

        // Simulate bot "thinking"
        setTimeout(() => {
            const messageContent = `<img src="../images/chatbot-image/black-chatbot.png" style="width:30px;height:30px;object-fit:contain;">
            <div class="message-text">
                <div class="thinking-indicator">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>    
            </div>`;
            const incomingMessageDiv = createMessageElement(messageContent, 'bot-message', 'thinking');
            chat_body.appendChild(incomingMessageDiv);
            chat_body.scrollTo({ top: chat_body.scrollHeight, behavior: 'smooth' });
            generateBotResponse(incomingMessageDiv);
        }, 300);
    }

    // Input handling
    message_input.addEventListener('keydown', (e) => {
        const userMessage = e.target.value.trim();
        if (e.key === 'Enter' && userMessage && !e.shiftKey && window.innerWidth > 768) {
            handleOutgoingMessage(e);
        }
    });

    message_input.addEventListener('input', () => {
        message_input.style.height = `${initialInputHeight}px`;
        message_input.style.height = `${message_input.scrollHeight}px`;
    });

    // File handling
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            fileUploadWrapper.querySelector('img').src = e.target.result;
            fileUploadWrapper.classList.add('file-uploaded');
            const base64String = e.target.result.split(",")[1];
            userData.file = { data: base64String, mime_type: file.type };
            fileInput.value = "";
        }
        reader.readAsDataURL(file);
    });

    fileCancelButton.addEventListener('click', () => {
        userData.file = {};
        fileUploadWrapper.classList.remove('file-uploaded');
    });

    // Emoji picker
    const picker = new EmojiMart.Picker({
        theme: "light",
        skinTonePosition: "none",
        previewPosition: "none",
        onEmojiSelect: (emoji) => {
            const start = message_input.selectionStart;
            const end = message_input.selectionEnd;
            message_input.setRangeText(emoji.native, start, end, "end");
            message_input.focus();
        },
        onClickOutside: (e) => {
            if (e.target.id === "emoji-picker") {
                document.body.classList.toggle("show-emoji-picker");
            } else {
                document.body.classList.remove("show-emoji-picker");
            }
        }
    });
    document.querySelector('.chat-form').appendChild(picker);

    sendMessageButton.addEventListener('click', handleOutgoingMessage);
    document.querySelector('#file-upload').addEventListener('click', () => fileInput.click());
    chatbotToggler.addEventListener('click', () => document.body.classList.toggle('show-chatbot'));
    closeChatbot.addEventListener('click', () => document.body.classList.remove('show-chatbot'));
});

// end of chat bot