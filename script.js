// Initialize Supabase client from globals set in index.html
const SUPABASE_URL = "https://hpzmzppvfqsgirdxblmh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwem16cHB2ZnFzZ2lyZHhibG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTA5MjEsImV4cCI6MjA3MDcyNjkyMX0.b8_jIVUniTjSiZJfQ7HVYqsgmiYyqLL3wVkJWDtN8rs";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('service-form');
  const message = document.getElementById('message');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      message.textContent = '';

      const formData = new FormData(form);
      const payload = {
        name: formData.get('name')?.trim(),
        category: formData.get('category')?.trim(),
        description: formData.get('description')?.trim(),
        price: formData.get('price')?.trim() || null,
        contact: formData.get('contact')?.trim(),
      };

      // Basic client-side validation
      if (!payload.name || !payload.category || !payload.description || !payload.contact) {
        message.style.color = 'crimson';
        message.textContent = 'Please fill in all required fields.';
        return;
      }

      // Insert into Supabase
      const { error } = await supabase.from('services').insert(payload);

      if (error) {
        console.error(error);
        message.style.color = 'crimson';
        message.textContent = 'Could not submit your service. Please try again.';
        return;
      }

      message.style.color = 'green';
      message.textContent = 'Thanks! Your service has been added.';
      form.reset();

      // Optionally refresh the list if you unhide it later
      // loadServices();
    });
  }

  // Optional: fetching services when you unhide the gallery
  // document.getElementById('services-list')?.hidden === false && loadServices();
});

// Optional: display services as cards (used if/when you unhide the section)
async function loadServices() {
  const container = document.getElementById('services');
  if (!container) return;

  container.innerHTML = 'Loading…';

  const { data, error } = await supabase
    .from('services')
    .select('id, name, category, description, price, contact, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    container.innerHTML = '<p>Could not load services.</p>';
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = '<p>No services yet.</p>';
    return;
  }

  container.innerHTML = '';
  data.forEach(svc => {
    const card = document.createElement('div');
    card.className = 'service-card';
    const priceRow = svc.price ? `<p class="service-meta">Price: ${escapeHtml(svc.price)}</p>` : '';
    const contactRow = svc.contact ? `<p class="service-meta">Contact: ${escapeHtml(svc.contact)}</p>` : '';
    card.innerHTML = `
      <h3>${escapeHtml(svc.category)}</h3>
      <p>${escapeHtml(svc.description)}</p>
      ${priceRow}
      <p class="service-meta">Offered by: ${escapeHtml(svc.name)}</p>
      ${contactRow}
    `;
    container.appendChild(card);
  });
}

// Basic HTML escaper to avoid rendering issues
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
