<template>
<main class="container" :class="{'center': !emailValid} ">
    <h1 class="title">
        <svg width="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M4 9C4.41421 9 4.75 9.33579 4.75 9.75V10.75C4.75 14.7541 7.99594 18 12 18C16.0041 18 19.25 14.7541 19.25 10.75V9.75C19.25 9.33579 19.5858 9 20 9C20.4142 9 20.75 9.33579 20.75 9.75V10.75C20.75 15.3298 17.2314 19.0879 12.75 19.4683V21.75C12.75 22.1642 12.4142 22.5 12 22.5C11.5858 22.5 11.25 22.1642 11.25 21.75V19.4683C6.7686 19.0879 3.25 15.3298 3.25 10.75V9.75C3.25 9.33579 3.58579 9 4 9Z" fill="#1C274C"></path> <path opacity="0.5" d="M9.75 7.75C9.75 7.33579 9.41421 7 9 7H7.81597H6.29847C6.66598 4.17873 9.07855 2 12 2C14.9214 2 17.334 4.17873 17.7015 7H16.184L13.5 7C13.0858 7 12.75 7.33579 12.75 7.75C12.75 8.16421 13.0858 8.5 13.5 8.5L16.25 8.5H17.75V10H16.25H13.5C13.0858 10 12.75 10.3358 12.75 10.75C12.75 11.1642 13.0858 11.5 13.5 11.5H16.184H17.7015C17.334 14.3213 14.9214 16.5 12 16.5C9.07855 16.5 6.66598 14.3213 6.29847 11.5H7.81597H9C9.41421 11.5 9.75 11.1642 9.75 10.75C9.75 10.3358 9.41421 10 9 10H7.75H6.25V8.5H7.75H9C9.41421 8.5 9.75 8.16421 9.75 7.75Z" fill="#1C274C"></path> <path d="M12.75 10.75C12.75 11.1642 13.0858 11.5 13.5 11.5H16.184H17.7015L17.75 10H16.25H13.5C13.0858 10 12.75 10.3358 12.75 10.75Z" fill="#1C274C"></path> <path d="M12.75 7.75C12.75 8.16421 13.0858 8.5 13.5 8.5L16.25 8.5H17.75L17.7015 7H16.184L13.5 7C13.0858 7 12.75 7.33579 12.75 7.75Z" fill="#1C274C"></path> <path d="M9.75 7.75C9.75 7.33579 9.41421 7 9 7H7.81597H6.29847L6.25 8.5H7.75H9C9.41421 8.5 9.75 8.16421 9.75 7.75Z" fill="#1C274C"></path> <path d="M9.75 10.75C9.75 10.3358 9.41421 10 9 10H7.75H6.25L6.29847 11.5H7.81597H9C9.41421 11.5 9.75 11.1642 9.75 10.75Z" fill="#1C274C"></path> </g></svg>
        Chibata FM.
    </h1>

    <div class="card email-verify" v-if="!emailValid">
        <input
        v-model="email"
        @keyup.enter="checkEmail"
        type="email"
        placeholder="✉️ Digite seu e-mail"
        class="text-field"
        />
        <button
        @click="checkEmail"
        :disabled="!email.trim()"
        class="btn"
        >
            <div v-if="searching" class="radio-loader">
                <span class="wave wave1"></span>
                <span class="wave wave2"></span>
                <span class="wave wave3"></span>
            </div>
            <span v-else>Verificar</span>
        </button>
        <p v-if="emailError" class="msg-error">
            ❌ {{ emailError }}
        </p>
    </div>

    <div v-else>

        <div class="tabs">
            <button
            :class="{ active: activeTab === 'search' }"
            @click="activeTab = 'search'"
            >
                🎧 Adicionar Música
            </button>
            <button
            :class="{ active: activeTab === 'playlist' }"
            @click="activeTab = 'playlist'"
            >
                🔥 Chama na Playlist
            </button>
        </div>


        <section v-show="activeTab === 'search'" class="tab-content">
            <div class="card">
                <input
                v-model="input"
                @keyup.enter="searchSongs"
                type="text"
                placeholder="🔍 Qual é a música, Lombardi?"
                class="text-field"
                />
                <button
                @click="searchSongs"
                :disabled="searching || !input.trim()"
                class="btn"
                >
                    <div v-if="searching" class="radio-loader">
                        <span class="wave wave1"></span>
                        <span class="wave wave2"></span>
                        <span class="wave wave3"></span>
                    </div>
                    <span v-else>Buscar</span>
                </button>
            </div>

            <div v-if="results.length" class="preview-grid">
                <div
                v-for="song in results"
                :key="song.videoId"
                class="preview-item"
                @click="!song.duplicate && addSong(song.videoId)"
                :class="{ 'disabled': song.duplicate || adding }"
                >
                    <img :src="song.thumbnail" alt="thumb" />
                    <p class="preview-title">🎶 {{ song.title }}</p>
                    <span v-if="song.duplicate" class="badge">✔️ Já adicionada</span>
                </div>
            </div>

            <p v-if="message" :class="{'msg-error': isError, 'msg-success': !isError}">
                {{ isError ? '❌ ' : '✅ ' }}{{ message }}
            </p>
        </section>


        <section v-show="activeTab === 'playlist'" class="playlist-section card">
            <ul class="playlist-list">
                <li
                v-for="item in playlist"
                :key="item.playlistItemId"
                class="playlist-item"
                >
                    <img
                    :src="item.thumbnail"
                    alt="thumb"
                    class="item-thumb"
                    />
                    <span class="item-title">{{ item.title }}</span>
                    <button
                    class="delete-btn"
                    @click="deleteSong(item)"
                    :disabled="deleting[item.playlistItemId]"
                    >
                        <span v-if="deleting[item.playlistItemId]">⏳</span>
                        <span v-else>🗑️</span>
                    </button>
                </li>
            </ul>
            <p v-if="!playlist.length" class="empty-msg">
                Sua playlist ainda está vazia.
            </p>
        </section>
    </div>
    <div id="yt-player" style="display:none;"></div>

    <div v-if="current.title" class="now-playing">
        🎵 Tocando agora: <strong>{{ current.title }}</strong>
    </div>
</main>
<footer class="footer">
    <a href="https://github.com/devinkel/youtube-music-work-app" target="_blank">
        <img width="40" src="./assets/k.svg" alt="logo" />
    </a>
</footer>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            email: '',
            emailValid: false,
            emailError: '',
            input: '',
            results: [],
            playlist: [],
            searching: false,
            adding: false,
            deleting: {},
            message: '',
            isError: false,
            activeTab: 'search',
            player: null,
            current: { videoId: '', title: '' },
        }
    },
    mounted() {
        // this.initPlayer()
    },
    methods: {
        checkEmail() {
            const domain = import.meta.env.VITE_WORK_EMAIL_DOMAIN
            if (this.email.trim().toLowerCase().endsWith(domain)) {
                this.emailValid = true
                this.emailError = ''
                this.fetchPlaylist()
            } else {
                this.emailError = `Ops, parece que você não trabalha aqui`
            }
        },
        initPlayer() {
            if (!window.YT) {
                const tag = document.createElement('script')
                tag.src = 'https://www.youtube.com/iframe_api'
                document.head.appendChild(tag)
            }
            window.onYouTubeIframeAPIReady = () => {
                this.player = new YT.Player('yt-player', {
                    height: '0',
                    width: '0',
                    playerVars: {
                        listType: 'playlist',
                        list: import.meta.env.VITE_PLAYLIST_ID,
                        autoplay: 1,
                        controls: 0,
                        enablejsapi: 1,
                        origin: window.location.origin
                    },
                    events: { onStateChange: this.onPlayerStateChange }
                })
            }
        },
        onPlayerStateChange(event) {
            if (event.data === YT.PlayerState.PLAYING) {
                const info = this.player.getVideoData()
                this.current.videoId = info.video_id
                this.current.title   = info.title
            }
        },
        playVideo(videoId) {
            if (this.player) {
                this.player.loadVideoById(videoId)
            }
        },
        async searchSongs() {
            if (this.searching || !this.input.trim()) return
            this.searching = true
            this.message = ''
            this.results = []
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/preview?query=${encodeURIComponent(this.input.trim())}`
                )
                const json = await res.json()
                if (!res.ok) throw new Error(json.error || 'Falha na busca')
                this.results = json.results
            } catch (err) {
                this.isError = true
                this.message = err.message
            } finally {
                this.searching = false
            }
        },
        async addSong(videoId) {
            if (this.adding) return
            this.adding = true
            this.message = ''
            try {
                const res = await fetch(
                    import.meta.env.VITE_API_URL + '/add-song',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ videoId }),
                    }
                )
                const json = await res.json()
                if (!res.ok) throw new Error(json.message || 'Erro ao adicionar')
                this.isError = false
                this.message = `Música adicionada`
                await this.fetchPlaylist()
            } catch (err) {
                this.isError = true
                this.message = err.message
            } finally {
                this.adding = false
            }
        },
        async fetchPlaylist() {
            try {
                const res = await fetch(import.meta.env.VITE_API_URL + '/queue')
                const json = await res.json()
                if (!res.ok) throw new Error(json.error || 'Falha ao carregar playlist')
                this.playlist = json.items
            } catch (err) {
                console.error(err)
            }
        },
        async deleteSong(item) {
            const id = item.playlistItemId
            this.deleting[id] = true
            try {
                const res = await fetch(
                    import.meta.env.VITE_API_URL + '/delete-song',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ playlistItemId: id }),
                    }
                )
                const json = await res.json()
                if (!res.ok) throw new Error(json.error || 'Erro ao excluir')
                this.playlist = this.playlist.filter(p => p.playlistItemId !== id)
            } catch (err) {
                console.error(err)
            } finally {
                this.deleting[id] = false
            }
        },
    },
}
</script>

<style src="./style.css"></style>
