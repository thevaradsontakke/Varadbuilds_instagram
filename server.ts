import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

// Default items used if Database file is missing/not-yet-created
import { INITIAL_PROFILE, INITIAL_LINKS, generateMockAnalyticsEvents } from './src/data';

const app = express();
const PORT = 3000;

// support larger payload sizes for user's custom base64-encoded avatar images
app.use(express.json({ limit: '12mb' }));

const dbDir = path.join(process.cwd(), 'src');
const dbPath = path.join(dbDir, 'database.json');

// Ensure the directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database with default profile, links & generated events if not existing
function getOrCreateDatabase() {
  try {
    if (fs.existsSync(dbPath)) {
      const content = fs.readFileSync(dbPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading database file, using fallback defaults', err);
  }

  // Generate initial database structure
  const initialDb = {
    profile: INITIAL_PROFILE,
    links: INITIAL_LINKS,
    events: generateMockAnalyticsEvents(),
  };

  try {
    fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error creating initial database file', err);
  }

  return initialDb;
}

// API endpoint to fetch all dynamic creator portfolio state
app.get('/api/data', (req, res) => {
  const dbData = getOrCreateDatabase();
  res.json(dbData);
});

// API endpoint to update state (profile and links)
app.post('/api/save', (req, res) => {
  try {
    const { profile, links } = req.body;
    const dbData = getOrCreateDatabase();

    if (profile) dbData.profile = profile;
    if (links) dbData.links = links;

    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
    res.json({ success: true, message: 'Changes persisted live to server database! Dynamic across devices.' });
  } catch (error) {
    console.error('Failed to save to database', error);
    res.status(500).json({ success: false, error: 'Database save error' });
  }
});

// API endpoint to track single view or click event instantly on server
app.post('/api/event', (req, res) => {
  try {
    const { event } = req.body;
    if (!event) {
      return res.status(400).json({ success: false, error: 'Event body required' });
    }

    const dbData = getOrCreateDatabase();
    
    // Add event to history
    dbData.events.unshift(event);

    // If it's a link click, increment that specific link counter in-db as well
    const isSocialSuffix = event.linkId.endsWith('-profile');
    if (!isSocialSuffix && event.linkId !== 'profile-view') {
      dbData.links = dbData.links.map((link: any) => {
        if (link.id === event.linkId) {
          return { ...link, clicks: (link.clicks || 0) + 1 };
        }
        return link;
      });
    }

    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to register server-side click tracking event', error);
    res.status(500).json({ success: false, error: 'Database event register error' });
  }
});

// Simulate visitor traffic increments directly on the server
app.post('/api/simulate-traffic', (req, res) => {
  try {
    const { simulatedEvents, updatedLinks } = req.body;
    const dbData = getOrCreateDatabase();

    if (simulatedEvents) {
      dbData.events = [...simulatedEvents, ...dbData.events];
    }
    if (updatedLinks) {
      dbData.links = updatedLinks;
    }

    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to save simulated traffic models on server', err);
    res.status(500).json({ success: false });
  }
});

// API endpoint to clear analytics telemetry history securely
app.post('/api/reset-analytics', (req, res) => {
  try {
    const dbData = getOrCreateDatabase();
    dbData.events = [];
    dbData.links = dbData.links.map((link: any) => ({
      ...link,
      clicks: 0,
      views: 0,
    }));

    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to clear database logs', error);
    res.status(500).json({ success: false });
  }
});

// Vite Middleware integration or Static production server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server loaded; Listening on port http://localhost:${PORT}`);
  });
}

startServer();
