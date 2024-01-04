module.exports = {
    apply: function (characters) {
        const babies = require(`${__dirname}/unlocks_jsons/babies.json`)
        const entities = require(`${__dirname}/unlocks_jsons/entities2.json`)
        const itempools = require(`${__dirname}/unlocks_jsons/itempools.json`)
        const pocketitems = require(`${__dirname}/unlocks_jsons/pocketitems.json`)
        const trinkets = require(`${__dirname}/unlocks_jsons/trinkets.json`)
        const dictionaries = [babies, entities, pocketitems, trinkets]
        const dictionariesNames = ["babies", "entities", "pocketitems", "trinkets"]

        const unlockedBabies = []
        const unlockedEntities = []
        const unlockedTrinkets = []
        const unlockedPocketitems = []

        const unlockedCollectibles = {}
        for (let pool in itempools) {
            unlockedCollectibles[pool] = []
        }
        let marks = [
            "unlocked",
            "heart",
            "bossRush",
            "satan",
            "isaac",
            "blueBaby",
            "greedier",
            "all"
        ]
        let specialMarks = [
            "Stargazer",
            "Coffin", 
            "Flesh Chest", 
            "Scarlet Chest", 
            "Black Chest", 
            "Birth Certificate"
        ]
        for (let character of characters) {
            if (character.name === "Special") {
                marks = specialMarks
            }
            for (let mark of marks) {
                if (character[mark].status === 0) {
                    continue
                }
                let characterUnlocks = character[mark].item
                characterUnlocks.forEach(characterUnlockName => {
                    let isCollectible = true
                    for (let i = 0; i <= 3; i++) {
                        const dictionary = dictionaries[i]

                        for (let unlockName in dictionary) {
                            if (unlockName === characterUnlockName) {
                                const dictionaryName = dictionariesNames[i]
                                const unlock = dictionary[unlockName]
                                unlock.name = unlockName
                                if (dictionaryName === "babies") {
                                    unlockedBabies.push(unlock)
                                } else if (dictionaryName === "entities") {
                                    unlockedEntities.push(unlock)
                                } else if (dictionaryName === "pocketitems") {
                                    unlockedPocketitems.push(unlock)
                                } else if (dictionaryName === "trinkets") { 
                                    unlockedTrinkets.push(unlock)
                                }
                                isCollectible = false
                                break
                            }
                        }
                        if (!isCollectible) {
                            break
                        }
                    }
                    if (isCollectible) {
                        for (let pool in itempools) {
                            const collectibles = itempools[pool]
                            for (let collectible of collectibles) {
                                const collectibleName = collectible.Name
                                if (collectibleName === characterUnlockName) {
                                    unlockedCollectibles[pool].push(collectible)
                                }
                            }
                        }
                    }
                })
            }
        }
        let babiesXMLString = '<babies root="gfx/characters/player2/">\n'
        unlockedBabies.forEach(baby => babiesXMLString += `<baby id="${baby.id}" name="${baby.name}" skin="${baby.skin}" />\n`)
        babiesXMLString +=  '<baby id="1018" name="Edith Baby" skin="18_edithbaby.png" />\n'
        babiesXMLString += '</babies>'

        let entitiesXMLString = '<entities anm2root="gfx/" version="5">\n'
        const enitiesTemplate = fs.readFileSync(`${__dirname}/templates/entities_template.txt`, 'utf8');
        entitiesXMLString += '<entity anm2path="gfx/backdrop/blankanim.anm2" id="1000" name="Animated Item Dummy Entity" variant="3457435" collisionRadius="0" numGridCollisionPoints="0" baseHP="0" boss="0" collisionDamage="0" collisionMass="0" friction="0" shadowSize="0"></entity>\n'
        entitiesXMLString += enitiesTemplate
        unlockedEntities.forEach(entity => entitiesXMLString += `<entity anm2path="${entity.anm2path}" baseHP="${entity.baseHP}" boss="${entity.boss}" champion="${entity.champion}" collisionDamage="${entity.collisionDamage}" collisionMass="${entity.collisionMass}" collisionRadius="${entity.collisionRadius}" friction="${entity.friction}" id="${entity.id}" name="${entity.name}" numGridCollisionPoints="${entity.numGridCollisionPoints}" shadowSize="${entity.shadowSize}" stageHP="${entity.stageHP}" variant="${entity.variant}"></entity>\n`)
        entitiesXMLString += '</entities>'
        
        let pocketitemsXMLString = '<pocketitems>\n'
        unlockedPocketitems.forEach(pocketitem => {
            if (pocketitem.type) {
                if (pocketitem === "Sacrificial Blood") {
                    pocketitemsXMLString += '<card type="object" name="Sacrificial Blood" hud="Sacrificial Blood" mimiccharge="3" description="Feed on their pain" pickup="167" achievement="999" />\n'
                }
                else if (pocketitem.type === "rune") {
                    pocketitemsXMLString += `<rune type="${pocketitem.type}" name="${pocketitem.name}" hud="${pocketitem.hud}" mimiccharge="${pocketitem.mimiccharge}" description="${pocketitem.description}" pickup="${pocketitem.pickup}" />\n`
                }
                else {
                    pocketitemsXMLString += `<card type="${pocketitem.type}" name="${pocketitem.name}" hud="${pocketitem.hud}" mimiccharge="${pocketitem.mimiccharge}" description="${pocketitem.description}" pickup="${pocketitem.pickup}"/>\n`
                }
            }
            else {
                pocketitemsXMLString += `<pilleffect name="${pocketitem.name}" mimiccharge="${pocketitem.mimiccharge}" class="${pocketitem.class}" />\n`
            }
        })
        pocketitemsXMLString += '</pocketitems>'
        
        let trinketsXMLString = '<items gfxroot="gfx/items/" deathanm2="gfx/death_items.anm2" version="1">\n'
        const itemsTemplate = fs.readFileSync(`${__dirname}/templates/items_template.txt`, 'utf8');
        trinketsXMLString += itemsTemplate
        unlockedTrinkets.forEach(trinket => {
            trinketsXMLString += `<trinket name="${trinket.name}"`
            for (let key in trinket) {
                trinketsXMLString += `${key}="${trinket[key]}"`
            }
            trinketsXMLString += '/>\n'
        })
        trinketsXMLString += '</items>'

        let itempoolsXMLString = '<ItemPools>'
        let smallOrBigI
        for (let pool in unlockedCollectibles) {
            itempoolsXMLString += `<Pool Name="${pool}">\n`
            unlockedCollectibles[pool].forEach(collectible => {
                if (collectible.Name === "Tank Boys" || collectible.Name === "Helicopter Boys") {
                    smallOrBigI = 'item'
                }
                else {
                    smallOrBigI = 'Item'
                }
                itempoolsXMLString += `<${smallOrBigI} Name="${collectible.Name}" Weight="${collectible.Weight}" DecreaseBy="${collectible.DecreaseBy}" RemoveOn="${collectible.RemoveOn}" />\n`
            })
            itempoolsXMLString += `</Pool>`
            
        }
        itempoolsXMLString += '</ItemPools>'

        let xmlsPath
        
        if (__dirname.includes('steamapps')) {
            xmlsPath = path.join(__dirname, '..', '..', '..', 'repentanceplus_clean_3056942881', 'content')
        } else {
            xmlsPath = path.join(__dirname, 'tests')
        }
        
        console.log(xmlsPath)
        
        fs.writeFileSync(`${xmlsPath}/babies.xml`, babiesXMLString);
        fs.writeFileSync(`${xmlsPath}/entities2.xml`, entitiesXMLString);
        fs.writeFileSync(`${xmlsPath}/pocketitems.xml`, pocketitemsXMLString);
        fs.writeFileSync(`${xmlsPath}/itempools.xml`, itempoolsXMLString);
        //fs.writeFileSync(`${xmlsPath}/items.xml`, trinketsXMLString);     
    }
  };
  