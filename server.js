const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.use(express.static("public"));

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Optional: insert default quote if table is empty
async function insertDefaultQuote() {
  const { data, error } = await supabase
    .from('quote')
    .select('*');
  
  if (error) {
    console.error('Error checking default quote:', error.message);
    return;
  }

  if (data.length === 0) {
    await supabase
      .from('quote')
      .insert([{ text: 'Job your love', updated_at: new Date().toISOString() }]);
    console.log('Inserted default quote');
  }
}
insertDefaultQuote();

// Get current quote
app.get('/api/quote', async (req, res) => {
  const { data, error } = await supabase
    .from('quote')
    .select('text, updated_at')
    .order('id', { ascending: false })
    .limit(1);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// Update quote
app.post('/api/quote', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Quote text required' });

  const updatedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from('quote')
    .insert([{ text, updated_at: updatedAt }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
  console.log(`Inserted new quote ${text} at ${updatedAt}`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});