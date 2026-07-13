const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Use the service role key for storage uploads — it bypasses RLS and is safe
// to use here because this file only runs server-side, never in the browser.
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET = 'media';

/**
 * Upload a file buffer to Supabase Storage.
 * @param {Buffer} buffer - File contents
 * @param {string} filename - e.g. 'avatar-123.png'
 * @param {string} mimetype - e.g. 'image/png'
 * @returns {Promise<string>} Public URL of the uploaded file
 */
const uploadFile = async (buffer, filename, mimetype) => {
    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filename, buffer, { contentType: mimetype, upsert: true });

    if (error) throw new Error('Storage upload failed: ' + error.message);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
    return data.publicUrl;
};

module.exports = { uploadFile };
