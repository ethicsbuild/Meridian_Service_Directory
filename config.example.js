// Example configuration file - Copy this to config.js and fill in your values
const config = {
  SUPABASE_URL: "your-project-url.supabase.co",
  SUPABASE_ANON_KEY: "your-anon-key"
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
} else {
  window.config = config;
}