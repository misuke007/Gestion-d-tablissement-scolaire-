

const filesInput = document.querySelector('.filesInput')
const prevImageUser = document.querySelector('.prevImage')
const cameraInputFile = document.querySelector('.camera-input-file')


filesInput.addEventListener('change' , (event) => {

	let image = event.target.files[0]
	let imgUrl = window.URL.createObjectURL(image)

    cameraInputFile.style.display = 'none'
	prevImageUser.style.backgroundImage =  `url(${imgUrl})`


})
