import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors())

async function getAccessToken(env) {
	const res = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: env.CLIENT_ID,
			client_secret: env.CLIENT_SECRET,
			refresh_token: env.REFRESH_TOKEN,
			grant_type: 'refresh_token'
		})
	})
	const data = await res.json()
	if (!data.access_token) {
		console.error('Token response:', data)
		throw new Error('Falha ao obter access_token')
	}
	return data.access_token
}

async function searchVideos(env, query, maxResults = 6) {
	const token = await getAccessToken(env)
	const url = new URL('https://www.googleapis.com/youtube/v3/search')
	url.search = new URLSearchParams({
		part: 'snippet',
		q: query,
		type: 'video',
		maxResults: String(maxResults)
	}).toString()
	const res = await fetch(url.toString(), {
		headers: { Authorization: `Bearer ${token}` }
	})
	const data = await res.json()
	return (data.items || []).map(item => ({
		videoId: item.id.videoId,
		title: item.snippet.title,
		thumbnail: item.snippet.thumbnails.default.url
	}))
}

async function isVideoInPlaylist(env, videoId) {
	const token = await getAccessToken(env)
	let pageToken = ''
	do {
		const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
		url.search = new URLSearchParams({
			part: 'snippet',
			playlistId: env.PLAYLIST_ID,
			maxResults: '50',
			pageToken
		}).toString()
		const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } })
		const data = await res.json()
		if (data.items?.some(item => item.snippet.resourceId.videoId === videoId)) {
			return true
		}
		pageToken = data.nextPageToken || ''
	} while (pageToken)
	return false
}

async function insertToPlaylist(env, videoId) {
	const token = await getAccessToken(env)
	const res = await fetch(
		'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				snippet: {
					playlistId: env.PLAYLIST_ID,
					resourceId: { kind: 'youtube#video', videoId }
				}
			})
		}
	)
	const data = await res.json()
	if (!res.ok) {
		console.error('Insert error:', data)
		throw new Error(data.error?.message || 'Falha ao inserir na playlist')
	}
	return data.id
}

// --- Rotas ---

// Health check
app.get('/', c => c.text('Chama na Chibata!'))

app.get('/preview', async c => {
	const query = c.req.query('query') || ''
	if (!query.trim()) {
		return c.json({ error: 'query é obrigatório' }, 400)
	}
	try {
		const results = await searchVideos(c.env, query, 5)
		return c.json({ results })
	} catch (err) {
		console.error(err)
		return c.json({ error: err.message }, 500)
	}
})

app.post('/add-song', async c => {
	const { videoId: rawInput } = await c.req.json()
	if (!rawInput) {
		return c.json({ error: 'videoId é obrigatório' }, 400)
	}

	const videoId = rawInput.trim()
	try {
  if (await isVideoInPlaylist(c.env, videoId)) {
   return c.json({ success: false, message: 'Vídeo já está na playlist', duplicate: true }, 409)
  }
		const playlistItemId = await insertToPlaylist(c.env, videoId)
		return c.json({ success: true, addedVideoId: videoId, playlistItemId })
	} catch (err) {
		console.error(err)
		return c.json({ error: err.message }, 500)
	}
})

app.get('/queue', async c => {
	const token = await getAccessToken(c.env)
	let items = []
	let pageToken = ''
	do {
		const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
		url.search = new URLSearchParams({
			part: 'snippet',
			playlistId: c.env.PLAYLIST_ID,
			maxResults: '99',
			pageToken
		}).toString()
		const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } })
		const data = await res.json()
		items.push(...(data.items || []))
		pageToken = data.nextPageToken || ''
	} while (pageToken)
	// Retorna apenas os campos necessários
	const formatted = items.map(i => ({
		playlistItemId: i.id,
		videoId: i.snippet.resourceId.videoId,
		title: i.snippet.title,
		thumbnail: i.snippet.thumbnails.default.url
	}))
	return c.json({ items: formatted })
})

// POST /delete-song
app.post('/delete-song', async c => {
	const { playlistItemId } = await c.req.json()
	if (!playlistItemId) return c.json({ error: 'playlistItemId é obrigatório' }, 400)
	try {
		const token = await getAccessToken(c.env)
		await fetch(
			`https://www.googleapis.com/youtube/v3/playlistItems?id=${playlistItemId}`,
			{ method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
		)
		return c.json({ success: true })
	} catch (err) {
		return c.json({ error: err.message }, 500)
	}
})

export default app
