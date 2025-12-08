export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    user: "Caps",
    message: "API working"
  });
}