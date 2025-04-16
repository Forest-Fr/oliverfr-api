// api/upload-cover.js
import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';

export const config = {
  api: { bodyParser: false }  // 关闭 Vercel 默认的 body 解析
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // 用 formidable 解析 multipart
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const file = files.file;
    const data = await supabase
      .storage
      .from('articles')
      .upload(`covers/${Date.now()}_${file.originalFilename}`, file.filepath, {
        contentType: file.mimetype
      });
    if (data.error) return res.status(500).json({ error: data.error.message });

    const publicUrl = supabase
      .storage
      .from('articles')
      .getPublicUrl(data.data.path).data.publicUrl;

    res.json({ publicUrl });
  });
}
