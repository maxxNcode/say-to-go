export default async function handler(_req: Request): Promise<Response> {
  const token = process.env.MAPILLARY_TOKEN ?? process.env.VITE_MAPILLARY_TOKEN
  if (!token) {
    return Response.json({ error: 'Mapillary token not configured' }, { status: 500 })
  }
  return Response.json({ token })
}
