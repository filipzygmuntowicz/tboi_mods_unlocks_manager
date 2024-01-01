//console.log(characters.find((char) => char.name == "Isaac"));

window.onload = async () => {
    console.log(await window.electronAPI.getJson())
    characters = await window.electronAPI.getJson()
    window.characters = characters

    let charactersDiv = document.getElementById("characters")

    characters.forEach((character, characterIndex) => {
        let innerDiv = document.createElement("div")
        innerDiv.className = "character"
        innerDiv.addEventListener("click", function(){selectCharacter(this, character, characterIndex)});
        
        let imageDiv = document.createElement("div")
        
        imageDiv.style.width = "47px"
        imageDiv.style.height = "47px"
        imageDiv.style.background = `url('./static/charactermenualt.png') -${character.x}px -${character.y}px`
        
        let characterNameParagraph = document.createElement("p")
        characterNameParagraph.textContent = character.name.replace("blueBaby", "???").toUpperCase()
        
        innerDiv.appendChild(imageDiv)
        innerDiv.appendChild(characterNameParagraph)
        charactersDiv.appendChild(innerDiv)
    })
}


document.getElementById("buttonReset").addEventListener("click", function(){resetUnlocks()});
document.getElementById("buttonUpdate").addEventListener("click", function(){updateUnlocks()});

function resetUnlocks() {
    if (!confirm("Are you sure you want to lock every unlock? This will NOT influence your game, only the manager.")) {
        return false
    }
    window.characters.forEach(character => {
        unlocks.forEach(unlock => {
            character[unlock].status = 0; 
        })
    })
    if (currentlySelectedCharacter.characterDiv) {
        currentlySelectedCharacter.characterDiv.click()
    }
    save()
}

function updateUnlocks() {
    alert("placeholder")
}

let currentlySelectedCharacter = {
    character: null,
    characterDiv: null
}
let unlocks = [
    "unlocked",
    "heart",
    "bossRush",
    "satan",
    "isaac",
    "blueBaby",
    "greedier",
    "all"
]
let unlocksToDescription = {
    "unlocked": "Unlock the character",
    "heart": "Defeat Mom's Heart",
    "bossRush": "Complete Boss Rush",
    "satan": "Defeat Satan",
    "isaac": "Defeat Isaac",
    "blueBaby": "Defeat ???",
    "greedier": "Defeat Ultra Greed",
    "all": "Earn all repentance marks with the character"
}

function save() {
    window.electronAPI.saveJson(window.characters)
}

function editData(unlock, characterIndex) {
    let checkmark = document.getElementById(unlock)
    if (window.characters[characterIndex][unlock].status == 1) {
        window.characters[characterIndex][unlock].status = 0
        if (checkmark) {
            checkmark.style.display = "none"
        }
    } else {
        window.characters[characterIndex][unlock].status = 1
        if (checkmark) {
            checkmark.style.display = "block"
        }
    }
    save()
}

function drawUnlocks(character, characterIndex) {
    //completion = document.getElementById("completion")
    
    document.getElementById("characterName").innerText = character.name.replace("blueBaby", "???").toUpperCase()
    let unlockMarksUl = document.createElement("ul")
    unlockMarksUl.id = "unlockMarksUl"
    unlocks.forEach(unlock => {
        //unlockDiv = document.getElementById(unlock)
        let unlockLi = document.createElement("li")
        unlockLi.innerHTML = `<input type="checkbox"><p>${unlocksToDescription[unlock]} <em>(${character[unlock].item})</em></p>`
        unlockLi.childNodes[0].addEventListener("change", function(){editData(unlock, characterIndex)})
        if (character[unlock].status == 1) {
            let unlockDiv = document.getElementById(unlock)
            if (unlockDiv) {
                unlockDiv.style.display = "block"
            }
            unlockLi.childNodes[0].checked = true
        }
        else {
            unlockLi.childNodes[0].checked = false
        }
        
        unlockMarksUl.appendChild(unlockLi)
    })
    document.getElementById("right-side").appendChild(unlockMarksUl)
}

function selectCharacter(characterDiv, character, characterIndex) {
    const unlockMarksUl = document.getElementById("unlockMarksUl")
    if (unlockMarksUl) {
        unlockMarksUl.remove()
        unlocks.forEach(unlock => {
            let checkmark = document.getElementById(unlock)
            if (checkmark) {
                checkmark.style.display = "none"
            }
        })
    }
    if (currentlySelectedCharacter.characterDiv != characterDiv) {
        if (currentlySelectedCharacter.characterDiv) {
            currentlySelectedCharacter.characterDiv.style.backgroundColor = ""
        }
        currentlySelectedCharacter.characterDiv = characterDiv
    }
    if (characterDiv.style.backgroundColor === "grey") {
        characterDiv.style.backgroundColor = ""
        currentlySelectedCharacter = {
            character: null,
            characterDiv: null
        }
    }
    else {
        characterDiv.style.backgroundColor = "grey"
        drawUnlocks(character, characterIndex)
    }
    if (currentlySelectedCharacter.characterDiv) {
        document.getElementById("unlocksDiv").style.display = "block"
    }
    else {
        document.getElementById("unlocksDiv").style.display = "none"
    }
}
