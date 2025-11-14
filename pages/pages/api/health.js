export default function handler(req, res) {
  res.status(200).json({ status: "OK", time: new Date().toISOString() });
}
