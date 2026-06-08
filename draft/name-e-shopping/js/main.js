/* Name-E-Shopping — Main JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initRoleTabs();
  initQuantitySelector();
  initGalleryThumbs();
  initStarRating();
  initUploadArea();
  initCartCount();
  initFormToasts();
  initSmoothScroll();
});

/* Mobile Navigation */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
      toggle.classList.remove('active');
    }
  });
}

/* Role Tabs on Login/Register */
function initRoleTabs() {
  const tabs = document.querySelectorAll('.role-tab');
  const forms = document.querySelectorAll('.role-form');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const role = tab.dataset.role;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      forms.forEach(f => {
        f.style.display = f.dataset.role === role ? 'block' : 'none';
      });
    });
  });
}

/* Quantity +/- Buttons */
function initQuantitySelector() {
  document.querySelectorAll('.quantity-selector').forEach(selector => {
    const input = selector.querySelector('input');
    const minus = selector.querySelector('.qty-minus');
    const plus = selector.querySelector('.qty-plus');
    if (!input) return;

    minus?.addEventListener('click', () => {
      const val = parseInt(input.value) || 1;
      if (val > 1) input.value = val - 1;
    });

    plus?.addEventListener('click', () => {
      const val = parseInt(input.value) || 1;
      input.value = val + 1;
    });
  });
}

/* Product Gallery Thumbnails */
function initGalleryThumbs() {
  const mainImg = document.querySelector('.product-gallery .main-image');
  const thumbs = document.querySelectorAll('.gallery-thumbs img');
  if (!mainImg || !thumbs.length) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      mainImg.src = thumb.src;
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
}

/* Star Rating Input */
function initStarRating() {
  document.querySelectorAll('.star-rating').forEach(container => {
    const stars = container.querySelectorAll('label');
    stars.forEach((star, index) => {
      star.addEventListener('mouseenter', () => highlightStars(stars, index));
      star.addEventListener('click', () => {
        const input = container.querySelector(`#star${5 - index}`);
        if (input) input.checked = true;
        highlightStars(stars, index, true);
      });
    });

    container.addEventListener('mouseleave', () => {
      const checked = container.querySelector('input:checked');
      if (checked) {
        const idx = 4 - parseInt(checked.value);
        highlightStars(stars, idx, true);
      } else {
        stars.forEach(s => s.style.color = '');
      }
    });
  });
}

function highlightStars(stars, upTo, persist) {
  stars.forEach((star, i) => {
    star.style.color = i <= upTo ? '#f59e0b' : '#e2e8f0';
    if (persist) star.dataset.selected = i <= upTo ? 'true' : '';
  });
}

/* Drag & Drop Upload Area */
function initUploadArea() {
  document.querySelectorAll('.upload-area').forEach(area => {
    const input = area.querySelector('input[type="file"]');
    const preview = area.closest('.panel-body, .form-group')?.querySelector('.preview-grid');
    if (!input) return;

    area.addEventListener('click', () => input.click());

    area.addEventListener('dragover', (e) => {
      e.preventDefault();
      area.classList.add('dragover');
    });

    area.addEventListener('dragleave', () => area.classList.remove('dragover'));

    area.addEventListener('drop', (e) => {
      e.preventDefault();
      area.classList.remove('dragover');
      if (e.dataTransfer.files.length) {
        input.files = e.dataTransfer.files;
        showPreview(input.files, preview);
      }
    });

    input.addEventListener('change', () => showPreview(input.files, preview));
  });
}

function showPreview(files, container) {
  if (!container || !files.length) return;
  container.innerHTML = '';

  Array.from(files).forEach((file, i) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const div = document.createElement('div');
      div.className = 'preview-item';
      div.innerHTML = `
        <img src="${e.target.result}" alt="Preview ${i + 1}">
        <button type="button" class="remove-btn" aria-label="Remove">&times;</button>
      `;
      div.querySelector('.remove-btn').addEventListener('click', () => div.remove());
      container.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

/* Cart Counter */
function initCartCount() {
  const badge = document.querySelector('.cart-count');
  if (!badge) return;

  let count = parseInt(localStorage.getItem('cartCount')) || 0;
  badge.textContent = count;

  document.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      count++;
      localStorage.setItem('cartCount', count);
      badge.textContent = count;
      showToast('Added to cart!');
    });
  });
}

/* Form Submit Toasts */
function initFormToasts() {
  document.querySelectorAll('form[data-toast]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.dataset.toast || 'Submitted successfully!';
      showToast(msg);
    });
  });
}

/* Toast Notification */
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* Smooth Scroll for Anchor Links */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
