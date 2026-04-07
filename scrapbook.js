// scrapbook.js
// Handles adding and displaying scrapbook memories

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('memory-form');
  const grid = document.getElementById('scrapbook-grid');

  // Load memories from localStorage
  let memories = JSON.parse(localStorage.getItem('scrapbookMemories') || '[]');
  renderMemories();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const caption = document.getElementById('caption').value.trim();
    const photoInput = document.getElementById('photo');
    const file = photoInput.files[0];
    if (!caption || !file) return;

    // Read image as data URL
    const reader = new FileReader();
    reader.onload = function(evt) {
      const imageUrl = evt.target.result;
      const memory = { caption, imageUrl };
      memories.unshift(memory); // newest first
      localStorage.setItem('scrapbookMemories', JSON.stringify(memories));
      renderMemories();
      form.reset();
    };
    reader.readAsDataURL(file);
  });

  function renderMemories() {
    grid.innerHTML = '';
    if (memories.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; color: #5f4b8b; text-align:center;">No memories yet. Add your first one! ✨</p>';
      return;
    }
    memories.forEach((mem, idx) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.innerHTML = `
        <img src="${mem.imageUrl}" alt="Memory photo">
        <div class="caption">${escapeHtml(mem.caption)}</div>
        <button class="delete-btn" data-idx="${idx}" title="Delete">🗑️</button>
      `;
      grid.appendChild(card);
    });
    // Attach delete listeners
    grid.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        deleteMemory(idx);
      });
    });
  }

  function deleteMemory(idx) {
    if (confirm('Delete this memory?')) {
      memories.splice(idx, 1);
      localStorage.setItem('scrapbookMemories', JSON.stringify(memories));
      renderMemories();
    }
  }

  // Prevent XSS in captions
  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function(m) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
    });
  }
});
