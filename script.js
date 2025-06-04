// script.js

if (!localStorage.getItem('username')) {
  window.location.href = 'login.html';
}

document.getElementById('welcome').textContent = `Welcome, ${localStorage.getItem('username')}!`;

document.getElementById('logoutBtn').onclick = () => {
  localStorage.removeItem('username');
  window.location.href = 'login.html';
};

const uploadForm = document.getElementById('uploadForm');
const mediaInput = document.getElementById('mediaInput');
const mediaFeed = document.getElementById('mediaFeed');
const errorMsg = document.getElementById('errorMsg');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');

let mediaList = JSON.parse(localStorage.getItem('mediaList')) || [];
renderMedia();

uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const files = mediaInput.files;
  errorMsg.textContent = '';

  if (!files.length) {
    errorMsg.textContent = 'Please choose at least one file.';
    return;
  }

  const validTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm'];

  Array.from(files).forEach(file => {
    if (!validTypes.includes(file.type)) {
      errorMsg.textContent = 'Invalid file type detected. Only JPEG, PNG, MP4, or WebM are allowed.';
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      const mediaObj = {
        id: Date.now() + Math.random(),
        type: file.type,
        name: file.name,
        data: reader.result
      };

      try {
        mediaList.unshift(mediaObj);
        localStorage.setItem('mediaList', JSON.stringify(mediaList));
        renderMedia();
      } catch (e) {
        console.error('Storage error:', e);
        alert('Storage quota exceeded. Large files may not be supported in local storage.');
      }
    };

    reader.readAsDataURL(file);
  });
});

function renderMedia() {
  mediaFeed.innerHTML = '';

  const imageSection = document.createElement('div');
  imageSection.innerHTML = '<h2>Images</h2>';
  const imageGrid = document.createElement('div');
  imageGrid.className = 'media-feed';
  imageSection.appendChild(imageGrid);

  const videoSection = document.createElement('div');
  videoSection.innerHTML = '<h2>Videos</h2>';
  const videoGrid = document.createElement('div');
  videoGrid.className = 'media-feed';
  videoSection.appendChild(videoGrid);

  mediaList.forEach(media => {
    const card = document.createElement('div');
    card.className = 'media-card';

    let content;
    if (media.type.startsWith('image')) {
      content = document.createElement('img');
      content.className = 'media-thumb';
    } else {
      content = document.createElement('video');
      content.className = 'media-thumb';
      content.controls = true;
    }
    content.src = media.data;
    content.title = media.name;
    content.onclick = () => openModal(media);
    card.appendChild(content);

    const info = document.createElement('div');
    info.className = 'media-info';

    const name = document.createElement('span');
    name.textContent = media.name;
    name.style.fontSize = '0.85em';
    name.style.overflow = 'hidden';
    name.style.textOverflow = 'ellipsis';
    name.style.whiteSpace = 'nowrap';
    name.style.flex = '1';
    name.title = media.name;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete-btn';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      mediaList = mediaList.filter(item => item.id !== media.id);
      try {
        localStorage.setItem('mediaList', JSON.stringify(mediaList));
      } catch (err) {
        console.error('Storage error on delete:', err);
      }
      renderMedia();
    };

    info.appendChild(name);
    info.appendChild(delBtn);
    card.appendChild(info);

    if (media.type.startsWith('image')) {
      imageGrid.appendChild(card);
    } else {
      videoGrid.appendChild(card);
    }
  });

  mediaFeed.appendChild(imageSection);
  mediaFeed.appendChild(videoSection);
}

function openModal(media) {
  modal.classList.remove('hidden');
  modalContent.innerHTML = '';
  let content;
  if (media.type.startsWith('image')) {
    content = document.createElement('img');
  } else {
    content = document.createElement('video');
    content.controls = true;
    content.autoplay = true;
  }
  content.src = media.data;
  modalContent.appendChild(content);
}

closeModal.onclick = () => modal.classList.add('hidden');
window.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
};