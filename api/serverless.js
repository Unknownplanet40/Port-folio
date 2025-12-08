export default function handler(req, res) {
  const allowedOrigin = 'https://port-folio-seven-flax.vercel.app';
  const origin = req.headers.origin;

  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  
  const dataType = requestUrl.searchParams.get('data'); 

  switch (dataType) {
    case 'aboutme':
      return res.status(200).json({ ok: true, endpoint: "AboutMe" });

    default:
      return res.status(404).json({ ok: false, message: 'Endpoint not found.' });
  }
}