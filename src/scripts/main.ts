window.onload = function () {
    loadWords()
    document.getElementById("addButton").addEventListener('click', addElement)
    document.getElementById("wordInput").addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            addElement()
        }
    })

    document.getElementById("clearButton").addEventListener('click', clearElements)
}

function removeWord(wordToDelete) {
    chrome.storage.sync.get(['words'], function (result) {
        if (result.words) {
            const newWords = result.words.filter(word => word != wordToDelete)

            chrome.storage.sync.set({
                words: newWords
            }, function () {
                loadWords()
                notify("Deleted!")
            })

        }
    })
}

function addWord(word) {
    chrome.storage.sync.get(['words'], function (result) {

        let newWords = []
        if (result.words) {
            newWords = result.words
        }

        newWords.push(word)

        chrome.storage.sync.set({
            words: newWords
        }, function () {
            loadWords()
            notify("Added!")
        })

    })
}

function loadWords() {
    chrome.storage.sync.get(['words'], function (result) {

        if (!result.words || result.words.length == 0) {
            document.getElementById('words').innerHTML = "Nothing yet..."
        } else {


            let ids = []
            let wordsHtml = "<ul>"

            for (let index = 0; index < result.words.length; index++) {
                const word = result.words[index];
                const wordId = "word-" + index + "-" + Math.random().toString(36).substring(7)

                wordsHtml += `
                <li id="` + wordId + `">
                    <div> ` + word + ` </div>
                    <div style="text-align:right;">
                        <button class="copy btn"> <i class="fa fa-clone"></i> </button>
                        <button class="delete btn"> <i class="fa fa-trash"></i> </button>
                    </div>

                `
                if (index != result.words.length - 1) {
                    wordsHtml += "<hr>"
                }
                wordsHtml += "</li>"

                ids.push({
                    id: wordId,
                    word: word
                })
            }

            wordsHtml += "</ul>"

            document.getElementById('words').innerHTML = wordsHtml

            ids.forEach(el => {
                document.getElementById(el.id).getElementsByClassName("copy")[0].addEventListener('click', () => copyToClipboard(el.word))
                document.getElementById(el.id).getElementsByClassName("delete")[0].addEventListener('click', () => removeWord(el.word))
            })
        }
    })
}


function addElement() {
    const input  = document.getElementById('wordInput') as HTMLInputElement 

    if (input) {
        addWord(input.value)
        input.value = ""
    }
}

function clearElements() {
    chrome.storage.sync.set({
        words: []
    }, function () {
        loadWords()
        notify("Cleared!")
    })
}

function log(message) {
    document.getElementById('messages').innerHTML = '<p class="logMessage">' + message + '</p>'
}

function copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.getElementById("hidden").appendChild(el);
    el.select();
    document.execCommand('copy');
    document.getElementById("hidden").removeChild(el);
    notify("Copied!")
}

function notify(message) {
    if (message) {
        var notif = document.getElementById("notif");
        notif.getElementsByClassName("content")[0].innerHTML = message

        notif.className = "show";

        setTimeout(function () {
            notif.className = notif.className.replace("show", "");
        }, 2000);
    }
}