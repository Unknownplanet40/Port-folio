export default function handler(req, res) {
  const allowedOrigin = 'https://unknownplanet40.github.io'; 

  const origin = req.headers.origin;

  if (origin !== allowedOrigin) {
    return res.status(403).json({ ok: false, message: 'Access Denied: Unauthorized origin.' });
  }

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const dataType = requestUrl.searchParams.get('data'); 

  switch (dataType) {
    case 'userdata':
      return res.status(200).json({
        ok: true,
        endpoint: "UserData",
        data: { user: "Caps", message: "User data loaded from secure API." }
      });

    case 'aboutme':
      return res.status(200).json({
        ok: true,
        endpoint: "AboutMe",
        data: { bio: "My developer bio is loading securely.", version: 1.0 }
      });
    
    default:
      return res.status(404).json({
        ok: false,
        message: 'Endpoint not found or invalid parameter.'
      });
  }
}