

let songs;
let currFolder;

let currentSong = new Audio()
// currentSong.src=songs[0]
function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    // Pad with leading zero if needed
    mins = mins < 10 ? "0" + mins : mins;
    secs = secs < 10 ? "0" + secs : secs;

    return `${mins}:${secs}`;
}


async function getsongs(folder) {

    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    // console.log(response);
    // storing it in HTML element as we cannot acess inner elements using variables.
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    let songUL = document.querySelector(".songlist ul")
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="images/music.svg" alt="" srcset="" height="30px">
                            <div class="info">
                                <div>${song.replaceAll()}</div>
                                <div>Harsh</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="images/play.svg" alt="" srcset="" height="30px">
                            </div></li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e);
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })

    return songs;
}



const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "images/pause.svg"
    } else {
        play.src = "images/play.svg"
    }

    // currentSong.play();
    // play.src = "images/pause.svg"
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer");
    // console.log(anchors)
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
    if (e.href.includes("/songs/")) {
        // console.log(e.href)
        let folder = e.href.split("/").slice(-1)[0]
        // get the metadata of the folder
        let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
        let response = await a.json();
        console.log(response)
        cardContainer.innerHTML = cardContainer.innerHTML + `
              <div data-folder="${folder}" class="card rounded ">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="black">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.png" alt="card">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>
                    `
    }
}

Array.from(document.getElementsByClassName("card")).forEach(e => {
    // console.log(e);
    e.addEventListener("click", async item => {
        // console.log(item.currentTarget,item.currtarget.dataset.folder); 
        songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
        playMusic(songs[0]);
    })
})

}
async function main() {
    await getsongs("songs/cs");
    // console.log(songs);
    playMusic(songs[0], true);
    displayAlbums()

    // Display all the albums on the page

    // var audio = new Audio(songs[0]);
    // audio.play();

    // document.getElementById("playBtn").addEventListener("click", async () => {
    //     let songs = await getsongs();
    //     let audio = new Audio(songs[0]);
    //     audio.play();
    // });

    //  audio.addEventListener("loadedata", () => {
    // //   let duration = audio.duration;
    //   console.log(audio.duration,audio.currentSrc,audio.currentTime);
    //   // The duration variable now holds the duration (in seconds) of the audio clip
    //  });

    // Attach an event listner to each song

    // Attch an event listner to play,next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "images/pause.svg"

        } else {
            currentSong.pause()
            play.src = "images/play.svg"
        }
    })

    //listen for timeUpdate
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML = (`${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`)
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    // Add an event listner to seek seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // add an event for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    document.querySelector("#previous").addEventListener("click", () => {
        console.log("previous")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
        else {
            playMusic(songs[songs.length - 1]);
        }
    })
    document.querySelector("#next").addEventListener("click", () => {
        // console.log("next")
        // console.log(currentSong)

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        //    currentSong.src.split("/").slice(-1)[0]

        console.log(songs);
        console.log(index);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
        else {
            playMusic(songs[0]);
        }

    })
    // document.querySelector(".volume").addEventListener("click",()=>{
    //     document.querySelector(".range").style.display="block";
    // })

    //event to volume

    // console.log(currentSong.volume); // 1
    // currentSong.volume = 0.9;

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {

        currentSong.volume = parseInt(e.target.value) / 100;
    })

    // .target is used to target exact pointer location and triggers the event!
    // .current target gives the target on which event is applied
    // load the playlist when card is clicked

    // to mute when click volume icon

    

    document.querySelector(".volume img").addEventListener("click",(e)=>{
        // console.log(e.target.src);
        if(e.target.src.includes("volume.svg")){
              currentSong.volume=0;
              e.target.src=e.target.src.replace("volume.svg","mute.svg");
               document.querySelector(".range").getElementsByTagName("input")[0].value=0;
            //   console.log(e.target.src);
        }else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg");
            currentSong.volume=0.5;
             document.querySelector(".range").getElementsByTagName("input")[0].value=10;
        }
       
    })

}
main()  