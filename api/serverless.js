export default async function handler(req, res) {
  const allowedOrigin = "https://unknownplanet40.github.io";
  const origin = req.headers.origin;

  if (origin !== allowedOrigin) {
    return res.status(403).json({ ok: false, message: "Access Denied: Unauthorized origin." });
  }

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const dataType = requestUrl.searchParams.get("data");

  switch (dataType) {
    case "currentLocation":
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        const ip = ipData.ip;

        const locationResponse = await fetch(`http://ip-api.com/json/${ip}`);
        const locationData = await locationResponse.json();

        return res.status(200).json({
          ip: ip,
          endpoint: "CurrentLocation",
          data: locationData,
        });
      } catch (error) {
        return res.status(500).json({
          ip: null,
          message: "Error fetching location data",
          error: error.message,
        });
      }
    case "githubRepo":
      break;
    default:
      return res.status(404).json({
        ok: false,
        message: "Endpoint not found or invalid parameter.",
      });
  }
}
