const video = document.querySelector('video')

const btnSizeMode = document.getElementById('size-mode')
let fullscreen = false

/*
	Fullscreen
*/
btnSizeMode.addEventListener('click', () => {
	if (fullscreen) {
		btnSizeMode.innerHTML = `<i class="fas fa-expand"></i>`
		closeFullscreen()
	} else {
		btnSizeMode.innerHTML = `<i class="fas fa-compress"></i>`
		openFullscreen()
	}
})
video.addEventListener('dblclick', () => {
	if (fullscreen) {
		btnSizeMode.innerHTML = `<i class="fas fa-expand"></i>`
		closeFullscreen()
	} else {
		btnSizeMode.innerHTML = `<i class="fas fa-compress"></i>`
		openFullscreen()
	}
})

document.onfullscreenchange = (e) => {
	fullscreen = !fullscreen
}

/*
	Pause/playing
*/

const btnPausePlay = document.getElementById('pause-play')
btnPausePlay.addEventListener('click', () => {
	if (video.paused || video.ended) {
		video.play()
	} else {
		video.pause()
	}
})
video.addEventListener('click', () => {
	if (video.paused || video.ended) {
		video.play()
	} else {
		video.pause()
	}
})

/*
	Volume
*/

const btnVolume = document.getElementById('volume')
btnVolume.querySelector('.icon').addEventListener('click', () => {
	if (video.muted) {
		video.muted = false
	} else {
		video.muted = true
	}
})
btnVolume.addEventListener('mouseenter', () => {
	btnVolume.querySelector('.volume-popout').classList.add('shown')
})
btnVolume.addEventListener('mouseleave', () => {
	btnVolume.querySelector('.volume-popout').classList.remove('shown')
})

const inputVolume = document.getElementById('volume-slide')
inputVolume.addEventListener('input', (e) => {
	video.volume = e.target.value
})

/*
	Update controls via video event handlers
*/

video.onplay = () => {
	btnPausePlay.innerHTML = `<i class="fas fa-pause"></i>`
}
video.onpause = () => {
	btnPausePlay.innerHTML = `<i class="fas fa-play"></i>`
}
video.onended = () => {
	console.log('ended')
}
video.onvolumechange = () => {
	if (video.muted) {
		btnVolume.querySelector(
			'.icon'
		).innerHTML = `<i class="fas fa-volume-mute"></i>`
	} else {
		btnVolume.querySelector(
			'.icon'
		).innerHTML = `<i class="fas fa-volume-down"></i>`
	}
}

/*
	Seek
*/
const seeker = document.querySelector('.seek')
seeker.addEventListener('click', (e) => seek(e, true))

let holding = false
seeker.addEventListener('mousedown', () => (holding = true))
seeker.addEventListener('mouseup', () => (holding = false))

seeker.addEventListener('mousemove', seek)

function seek(e, overrideHoldCheck = false) {
	if (!holding && !overrideHoldCheck) return
	// Get width of seek element
	const w = seeker.getBoundingClientRect().width
	// Get mouseX of click event relative to seek element
	const x = e.clientX - seeker.getBoundingClientRect().x

	video.currentTime = (x / w) * video.duration

	document.getElementById('progress').style.width = `${(x / w) * 100}%`
}

/*
	When the video is playing, start the playback loop
*/
video.addEventListener('play', playLoop)
function playLoop() {
	video.playbackRate = 2
	if (video.ended || video.paused) return

	// Set the timestamp
	const progressTime = timeIntToString(Math.floor(video.currentTime))
	const fullTime = timeIntToString(Math.floor(video.duration))
	document.getElementById(
		'timestamp'
	).innerHTML = `${progressTime} / ${fullTime}`

	// Set the progress bar via percentage
	const percentageComplete = (video.currentTime / video.duration) * 100
	document.getElementById('progress').style.width = `${percentageComplete}%`

	requestAnimationFrame(playLoop)
}

/*
    Helper functions
*/
function timeIntToString(sec) {
	let hours = Math.max(0, Math.floor(sec / 3600))
	let mins = Math.max(0, Math.floor(sec / 60))
	let secs = sec % 60

	hours = hours === 0 ? (hours = '') : `${hours}:`
	mins = mins === 0 ? (mins = '0:') : `${mins}:`
	secs = secs === 0 ? (secs = '00') : `${secs < 10 ? `0${secs}` : secs}`

	return `${hours}${mins}${secs}`.trim()
}

function openFullscreen() {
	if (document.querySelector('.video-container').requestFullscreen) {
		document.querySelector('.video-container').requestFullscreen()
	} else if (
		document.querySelector('.video-container').webkitRequestFullscreen
	) {
		/* Safari */
		document.querySelector('.video-container').webkitRequestFullscreen()
	} else if (document.querySelector('.video-container').msRequestFullscreen) {
		/* IE11 */
		document.querySelector('.video-container').msRequestFullscreen()
	}
}

function closeFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen()
	} else if (document.webkitExitFullscreen) {
		/* Safari */
		document.webkitExitFullscreen()
	} else if (document.msExitFullscreen) {
		/* IE11 */
		document.msExitFullscreen()
	}
}
