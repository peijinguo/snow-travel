export default function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({
      ok: false,
      error: "Method Not Allowed",
    });
  }

  response.setHeader("Cache-Control", "no-store");
  return response.status(200).json({
    ok: true,
    service: "snow-travel-api",
  });
}
