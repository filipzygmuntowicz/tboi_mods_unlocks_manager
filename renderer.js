window.onload = async () => {
    let characters = await window.electronAPI.getJson()
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
document.getElementById("buttonUnlockAll").addEventListener("click", function(){unlockAll()});
document.getElementById("buttonUpdate").addEventListener("click", function(){applyToMod()});

function resetUnlocks() {
    if (!confirm("Are you sure?")) {
        return false
    }
    window.characters.forEach(character => {
        let characterUnlocks = unlocks
        if (character.name == "Special") {
            characterUnlocks = specialUnlocks
        }
        characterUnlocks.forEach(unlock => {
            character[unlock].status = 0; 
        })
    })
    if (currentlySelectedCharacter.characterDiv) {
        currentlySelectedCharacter.characterDiv.click()
    }
    save()
}

function unlockAll() {
    if (!confirm("Are you sure?")) {
        return false
    }
    window.characters.forEach(character => {
        let characterUnlocks = unlocks
        if (character.name == "Special") {
            characterUnlocks = specialUnlocks
        }
        characterUnlocks.forEach(unlock => {
            character[unlock].status = 1; 
        })
    })
    if (currentlySelectedCharacter.characterDiv) {
        currentlySelectedCharacter.characterDiv.click()
    }
    save()
}

function applyToMod() {
    if (!confirm("Are you sure?")) {
        return false
    }
    window.electronAPI.applyToMod(window.characters)
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

let specialUnlocks = [
    "Stargazer",
    "Coffin", 
    "Flesh Chest", 
    "Scarlet Chest", 
    "Black Chest", 
    "Birth Certificate"
]

let unlocksToDescription = {
    "unlocked": "Unlock the character",
    "heart": "Defeat Mom's Heart",
    "bossRush": "Complete Boss Rush",
    "satan": "Defeat Satan",
    "isaac": "Defeat Isaac",
    "blueBaby": "Defeat ???",
    "greedier": "Defeat Ultra Greed",
    "all": "Earn all repentance marks with the character",
    "Stargazer": "Enter a Planetarium 3 times",
    "Coffin": "Enter a Secret Room 10 times",
    "Flesh Chest": "Enter a Curse Room 10 times",
    "Scarlet Chest": "Enter an Ultra Secret Room 3 times",
    "Black Chest": "Enter a Devil Room 5 times",
    "Birth Certificate": "Earn all other Repentance Plus unlocks"
}

function save() {
    window.electronAPI.saveJson(window.characters)
}

function changeInput(input) {
    if (input.checked) {
        input.checked = false
    } else {
        input.checked = true
    }
}
function editData(event, unlock, characterIndex) {
    if (event.target.tagName == "P") {
        changeInput(event.target.parentElement.childNodes[0])
    } else if (event.target.tagName == "EM") {
        return false
    }
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

function parseItems(items) {
    itemsString = ""
    for (let [index, item] of items.entries()){
        if (index != 0) {
            itemsString = itemsString + ", "
        }
        if (index == 3) {
            itemsString = itemsString + "..."
            break;
        }
        itemsString = itemsString + item
    }
    return itemsString
}
function drawUnlocks(character, characterIndex) {
    //completion = document.getElementById("completion")
    
    document.getElementById("characterName").innerText = character.name.replace("blueBaby", "???").toUpperCase()
    let unlockMarksUl = document.createElement("ul")
    unlockMarksUl.id = "unlockMarksUl"
    let characterUnlocks = unlocks
    if (character.name == "Special") {
        characterUnlocks = specialUnlocks
        document.getElementById("unlocksDiv").style.display = "none"
    }
    characterUnlocks.forEach(unlock => {
        console.log(unlock)
        //unlockDiv = document.getElementById(unlock)
        let unlockLi = document.createElement("li")
        //console.log(character[unlock].item)
        unlockLi.innerHTML = `<input type="checkbox"><p id="checkboxText">${unlocksToDescription[unlock]} <em>(${parseItems(character[unlock].item)})</em></p>`
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

        unlockLi.childNodes[0].addEventListener('change', (event) => editData(event, unlock, characterIndex));
        unlockLi.childNodes[1].addEventListener('click', (event) => editData(event, unlock, characterIndex));
        
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
