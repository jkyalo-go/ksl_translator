stnTab = document.getElementById("stn")
ntsTab = document.getElementById("nts")
ntsTab.click()
let xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function () {
    if(this.readyState===4 && this.status ===200)   {
        document.getElementById('video_source').src = this.responseText
    }
}
function switchTranslation(tab) {
    if(tab===1) {
        ntsTab.classList.remove('active')
        document.getElementById("ntsContent").style.display = "none"
        stnTab.classList.add('active')
        document.getElementById("stnContent").style.display = "grid"
    }else if (tab===0){
        stnTab.classList.remove('active')
        document.getElementById("stnContent").style.display = "none"
        ntsTab.classList.add('active')
        document.getElementById("ntsContent").style.display = "grid"
    }
}

let transcription = ''
let recognising = false
xhttp.open('POST', "localhost:8000")
if ('webkitSpeechRecognition' in window)  {
    const recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = function () {
            recognising=true
        }
        recognition.onresult = function (event) {
            let intermediate_transcription = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal)   {
                    transcription +=event.results[i][0].transcript;
                    document.getElementById("text_out").textContent = intermediate_transcription
                    //Post request to be made
                }else {
                    intermediate_transcription += event.results[i][0].transcript;
                    xhttp.send(intermediate_transcription)
                }
            }
            document.getElementById("text_out").textContent = transcription
        }
        recognition.onerror = function (event) {

        }
        recognition.onend = function () {
        }

        function startRecognition() {
            if (recognising===true)    {
                recognition.stop();
            }else {
                transcription = '';
                recognition.lang = "en"
                recognition.start();
            }
        }
}




function sendPicShot() {
    let video_tag = document.getElementById('stn_video')
    let imageCanvas = document.createElement('canvas');
    let imageCtx = imageCanvas.getContext("2d");
    imageCanvas.width = video_tag.videoWidth
    imageCanvas.height = video_tag.videoHeight

    imageCtx.drawImage(video_tag, 0, 0, video_tag.videoWidth, video_tag.videoHeight, 0, 0, video_tag.videoWidth, video_tag.videoHeight)
    imageCanvas.toBlob(postFile, 'image/jpeg')
}

function postFile(file) {
    //Set options as form data
    let formdata = new FormData();
    formdata.append("image", file);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', window.location.origin + '/image/', true);
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200)  {
            let res = JSON.parse(xhr.responseText)
        console.log(xhr.responseText)
            document.getElementById('text_out_stream').textContent=res.response
        }
    }
    xhr.send(formdata)
}

function startSTN() {
    console.log("here we go ...")
    getMedia({audio: false, video: true}).then(function (stream) {
        let video_stream = document.getElementById('stn_video')
        video_stream.srcObject = stream
        let interval
        video_stream.onloadedmetadata = function (event) {
            video_stream.play()
        }
        video_stream.onplaying  = function (event) {
            interval = setInterval(sendPicShot, 2000)
        }
        video_stream.onpause = function (event) {
            clearInterval(interval)
        }
    })
 }
document.getElementById('stn_video').addEventListener('click', startSTN)

function getMedia(constraints) {
  let stream = null;

  try {
    stream = navigator.mediaDevices.getUserMedia(constraints);
    /* use the stream */
      return stream
  } catch(err) {
    /* handle the error */
      console.log(err.toString())
  }
}