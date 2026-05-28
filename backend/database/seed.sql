-- Seed data for MrVilz (run after schema.sql)
USE mrvilzdb;

-- Admin user is created automatically on server start (see backend/.env.example).

-- Hero & about content (JSON)
INSERT INTO site_content (content_key, content_json) VALUES
('hero', JSON_OBJECT(
  'eyebrow', 'Protecting Sri Lanka''s marine future',
  'title', 'Mr Vilz',
  'subtitle', 'We are striving to protect the marine environment of Sri Lanka.',
  'primaryAction', JSON_OBJECT('label', 'Be Involved', 'href', '#projects'),
  'secondaryAction', JSON_OBJECT('label', 'About Us', 'href', '#about'),
  'mediaType', 'image',
  'mediaUrl', '/images/background.png',
  'mediaAlt', 'Mr Vilz hero background'
)),
('about', JSON_OBJECT(
  'title', 'What Mr Vilz Does',
  'paragraphs', JSON_ARRAY(
    'Mr Vilz is a Sri Lankan youth-led environmental and creative media organization combining conservation action, entertainment storytelling, and community campaigns across beaches, forests, and wildlife protection.',
    'We believe small actions can create a big change. Through our projects and social media, we inspire people to protect Sri Lanka''s beaches, forests, wildlife, and natural beauty.',
    'Our team consists of passionate individuals and volunteers who are committed to making a positive impact on nature and society.',
    'Would you like to be a part of making Sri Lanka cleaner, greener, and more beautiful?'
  )
))
ON DUPLICATE KEY UPDATE content_key = content_key;

INSERT INTO site_stats (stat_key, label, value, suffix, sort_order) VALUES
('volunteers', 'Volunteers', 120, '+', 1),
('cleanups', 'Beach Cleanups', 24, '', 2),
('trees', 'Trees Planted', 8500, '+', 3),
('followers', 'Community Reach', 50000, '+', 4)
ON DUPLICATE KEY UPDATE stat_key = stat_key;

INSERT INTO social_links (platform, label, url, icon, sort_order) VALUES
('facebook', 'Facebook', 'https://www.facebook.com/', 'facebook', 1),
('instagram', 'Instagram', 'https://www.instagram.com/', 'instagram', 2),
('youtube', 'YouTube', 'https://www.youtube.com/', 'youtube', 3),
('tiktok', 'TikTok', 'https://www.tiktok.com/', 'tiktok', 4)
ON DUPLICATE KEY UPDATE platform = platform;

INSERT INTO team_members (name, slug, position, bio, image_url, sort_order) VALUES
(
  'Nadeesha D Shalom',
  'nadeesha',
  'Founder, Presenter & Full-Stack Developer',
  'Founder of Mr Vilz and BSc (Hons) Software Engineering undergraduate at SLIIT — full-stack development, AI engineering, travel media, and nature storytelling for conservation campaigns across Sri Lanka.',
  '/images/nadeesha1.JPG',
  1
),
(
  'Chamidu',
  'chamidu',
  'Co-Founder & Head of Media Production',
  'Co-Founder and Head of Media Production at Mr Vilz — videography and photography for beach cleanups, events, field work, and conservation storytelling across Sri Lanka.',
  '/images/chamidu.jpeg',
  2
),
(
  'Pabodha Nuwangi',
  'pabodha',
  'Creative Producer & Brand Partnerships',
  'Creative Producer and Brand Partnerships lead at Mr Vilz — AI-focused IT undergraduate driving content creation, brand partnerships, and environmental campaigns with strong community engagement.',
  '/images/paboda.jpeg',
  3
),
(
  'Nethmina',
  'nethmina',
  'Co-Host & Head of Creative Director',
  'Shapes creative direction and co-hosts Mr Vilz content with a focus on bold visual storytelling and audience engagement.',
  '/images/nethmina.JPG',
  4
)
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO projects (title, summary, progress, image_url, visual_layout, highlights, sort_order) VALUES
(
  'Clean Panadura Beach Sri Lanka',
  'A coastal cleanup effort focused on reducing waste, protecting the shoreline, and building stronger community action around a cleaner beach environment.',
  46,
  '/images/beach.PNG',
  'landscape',
  JSON_ARRAY('Beach cleanup', 'Volunteer action', 'Coastal protection'),
  1
),
(
  'Plants Donation Campaign',
  'A greening campaign that encourages communities to plant, nurture, and protect young trees for a healthier and cleaner future.',
  2,
  '/images/plant.PNG',
  'portrait',
  JSON_ARRAY('Plant today', 'Nurture growth', 'Protect nature'),
  2
)
ON DUPLICATE KEY UPDATE title = title;
