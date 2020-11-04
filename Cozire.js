if (typeof Cozire !== 'undefined') {
    if (Cozire === null) {
        delete Cozire;
    } else throw new Error('Cozire already loaded.');
}
var Cozire = {
    OG: {}, // Original Game Data
    Game: { // Our overrides
        UpdateMenu: () => {
            Cozire.OG.UpdateMenu();
            if (Game.onMenu == 'prefs') {
                let fragment = document.createDocumentFragment();
                fragment.appendChild(Cozire.Menu.heading('Cozire Toggleables'));
                fragment.appendChild(Cozire.Menu.subheading('Auto Clickers'));
                fragment.appendChild(Cozire.Menu.toggleButton('autoClicker','Auto Click Big Cookie','Clicks the big cookie for you.'));
                fragment.appendChild(Cozire.Menu.toggleButton('autoGolden','Auto Click Golden Cookies','Clicks any golden cookies for you.'));
                fragment.appendChild(Cozire.Menu.toggleButton('autoReindeer','Auto Click Reindeer','Clicks on reindeer for you'));
                fragment.appendChild(Cozire.Menu.toggleButton('autoNews','Auto Click News','Clicks on the news ticker for you.'));
                fragment.appendChild(Cozire.Menu.subheading('Golden Cookies'));
                fragment.appendChild(Cozire.Menu.toggleButton('blockWrath','Block Wrath Cookies','Prevents wrath cookies from spawning.'));
                fragment.appendChild(Cozire.Menu.subheading('Infinite Stuff'));
                fragment.appendChild(Cozire.Menu.toggleButton('infiniteCookies','Infinite Cookies','Causes your cookies to constantly regenerate.'));
                fragment.appendChild(Cozire.Menu.toggleButton('infiniteMagic','Infinite Magic','Causes your Grimoire magic to recharge almost instantly'));
                fragment.appendChild(Cozire.Menu.toggleButton('infiniteSwaps','Infinite Swaps','Causes your Pantheon swaps to regenerate almost instantly.'));
                fragment.appendChild(Cozire.Menu.subheading('Mini-game Enhancers'));
                fragment.appendChild(Cozire.Menu.toggleButton('miracleSpells','Miracle Spell™','Grimoire spells will never fail.'));
                fragment.appendChild(Cozire.Menu.toggleButton('immortalPlants','Make Plants Immortal','Makes it so plants never wither. Does not affect weeds or fungi.'));
                fragment.appendChild(Cozire.Menu.toggleButton('neverWeeds','Never Weed™','Makes it so weeds never spawn on their own. You can still plant them and they still may spread.'));
                fragment.appendChild(Cozire.Menu.toggleButton('allGodsActive','Pantheon \'R Us','All Pantheon gods except for Cyclius will be active in slot one.'));
                fragment.appendChild(Cozire.Menu.toggleButton('allGodsSlotOne','Power Of The Gods','All Pantheon gods will behave as if they are in slot 1 regardless of which slot they are in.'));
                fragment.appendChild(Cozire.Menu.heading('Cozire Actions'));
                fragment.appendChild(Cozire.Menu.subheading('Spawning'));
                fragment.appendChild(Cozire.Menu.actionButton('spawnGolden','Spawn a Golden Cookie','Spawns a golden cookie.', Cozire.Actions.spawnGolden));
                fragment.appendChild(Cozire.Menu.actionButton('spawnGoldenFrenzy','Spawn a Frenzy Cookie','Spawns a golden cookie that will cause a frenzy.', Cozire.Actions.spawnGolden));
                fragment.appendChild(Cozire.Menu.actionButton('spawnGoldenDragonflight','Spawn a Dragonflight Cookie','Spawns a golden cookie that will cause a dragonflight.', Cozire.Actions.spawnGoldenDragonflight));
                fragment.appendChild(Cozire.Menu.actionButton('giveSugarLump','Give Sugar Lump','Gives you a sugar limp.', Cozire.Actions.giveSugarLump));
                fragment.appendChild(Cozire.Menu.actionButton('giveCookies','Give Cookies','Gives you the most cookies you can have without getting the cheated cookies achievement.', Cozire.Actions.giveCookies));
                fragment.appendChild(Cozire.Menu.subheading('Mini-games'));
                fragment.appendChild(Cozire.Menu.actionButton('refillMagic','Refill Magic','Refill all of your Grimoire\'s magic.', Cozire.Actions.refillMagic));
                fragment.appendChild(Cozire.Menu.actionButton('refillSwaps','Refill Swaps','Refill all of your Pantheon\'s swaps', Cozire.Actions.refillSwaps));
                fragment.appendChild(Cozire.Menu.subheading('Unlock Things'));
                fragment.appendChild(Cozire.Menu.actionButton('unlockAllSeeds','Unlock Plant Seeds','Unlocks all the plant seeds for your Garden. Does not unlock weeds or fungi.', Cozire.Actions.unlockAllSeeds));
                fragment.appendChild(Cozire.Menu.actionButton('unlockAllWeedFungusSeeds','Unlock Weed and Fungi Seeds','Unlocks all the weed and fungus seeds for the Garden.', Cozire.Actions.unlockAllWeedFungusSeeds));
                fragment.appendChild(Cozire.Menu.actionButton('lockAllSeeds','Lock All Seeds','Locks all the seeds for the Garden except for the starting seed.', Cozire.Actions.lockAllSeeds));
                fragment.appendChild(Cozire.Menu.subheading('Misc'));
                fragment.appendChild(Cozire.Menu.actionButton('removeCheatedCookies','Remove Cheat Achievement','Remove \'Cheated cookies taste awful\' achievement', Cozire.Actions.removeCheatedCookies));

                // Unload Cozire button. Doesn't work if you loaded other add-ons first. We check only for Cookie Monster.
                if (typeof CM === 'undefined' || Cozire.cookieMonsterLoaded) fragment.appendChild(Cozire.Menu.actionButton('unloadCozire','Unload Cozire','Unloads Cozire and disabled all of it\'s features.', Cozire.Actions.unloadCozire));

                Cozire.PluginHooks.UpdateMenu(fragment);
        
                l('menu').childNodes[2].insertBefore(fragment, l('menu').childNodes[2].childNodes[l('menu').childNodes[2].childNodes.length - 1]);
            }
        },
    },
    Actions: { // Our action library
        spawnGolden: () => {
            Game.shimmerTypes.golden.time = Game.shimmerTypes.golden.maxTime;
        },
        spawnGoldenFrenzy: ()=>Cozire.Actions.spawnGoldenFixed('frenzy'),
        spawnGoldenDragonflight: ()=>Cozire.Actions.spawnGoldenFixed('dragonflight'),
        spawnGoldenFixed: (type) => {
            let newShimmer = new Game.shimmer('golden',{noWrath:true});
            newShimmer.dur = 10000;
            newShimmer.life = Math.ceil(Game.fps*newShimmer.dur);
            newShimmer.force = type;
            newShimmer.sizeMult = 2;
            return newShimmer;
        },
        removeCheatedCookies: ()=>Game.RemoveAchiev('Cheated cookies taste awful'),
        refillMagic: ()=>{
            if (Game.Objects['Wizard tower'].minigameLoaded && Game.Objects['Wizard tower'].minigame.magicM)
                Game.Objects['Wizard tower'].minigame.magic = Game.Objects['Wizard tower'].minigame.magicM;
        },
        refillSwaps: ()=>{
            if (Game.Objects['Temple'].minigameLoaded && Game.Objects['Temple'].minigame.gods) {
                Game.Objects['Temple'].minigame.swaps=3;
                Game.Objects['Temple'].minigame.swapT=Date.now();
                Game.Objects['Temple'].minigame.lastSwapT=0;
            }
        },
        giveSugarLump: ()=>{
            Game.gainLumps(1);
        },
        giveCookies: ()=>{
            Game.cookies = Game.cookiesEarned;
        },
        unlockAllSeeds: ()=>{
            if(Game.Objects['Farm'].minigameLoaded && Game.Objects['Farm'].minigame.plants) {
                Object.keys(Game.Objects['Farm'].minigame.plants).forEach((plantName) => {
                    let plant = Game.Objects['Farm'].minigame.plants[plantName];
                    if (plant.unlocked) return;
                    if (plant.weed || plant.fungus) return;
                    Game.Objects['Farm'].minigame.unlockSeed(plant);
                });
            }
        },
        unlockAllWeedFungusSeeds: ()=>{
            if(Game.Objects['Farm'].minigameLoaded && Game.Objects['Farm'].minigame.plants) {
                Object.keys(Game.Objects['Farm'].minigame.plants).forEach((plantName) => {
                    let plant = Game.Objects['Farm'].minigame.plants[plantName];
                    if (plant.unlocked) return;
                    if (!plant.weed && !plant.fungus) return;
                    Game.Objects['Farm'].minigame.unlockSeed(plant);
                });
            }
        },
        lockAllSeeds: ()=>{
            if(Game.Objects['Farm'].minigameLoaded && Game.Objects['Farm'].minigame.plants) {
                Object.keys(Game.Objects['Farm'].minigame.plants).forEach((plantName) => {
                    let plant = Game.Objects['Farm'].minigame.plants[plantName];
                    if (plant.unlocked) Game.Objects['Farm'].minigame.lockSeed(plant);
                });
                Game.Objects['Farm'].minigame.unlockSeed(Game.Objects['Farm'].minigame.plants['bakerWheat']);
            }
        },
        unloadCozire: ()=>{
            Object.keys(Cozire.ticks).forEach((tickThis) => {
                let tick = Cozire.ticks[tickThis];
                if (tick.intervalId) {
                    clearInterval(tick.intervalId);
                    tick.intervalId = 0;
                }
            });
            Cozire.Liberate.Game();
            Cozire.PluginHooks.UnloadPlugins();
            Game.UpdateMenu();
            setTimeout(() => Cozire = null, 100);
        },
    },
    ConfigDefaults: { // The default value for the configs
        'autoClicker': false,
        'autoGolden': false,
        'autoReindeer': false,
        'autoNews': false,
        'infiniteCookies': false,
        'infiniteMagic': false,
        'infiniteSwaps': false,
        'blockWrath': false,
        'immortalPlants': false,
        'neverWeeds': false,
        'miracleSpells': false,
        'allGodsActive': false,
        'allGodsSlotOne': false,
    },
    Config: {}, // User settings
    Init: () => { // Initialize the add-on.
        if (!Game || !Game.version || !Game.updateLog) {
            alert('The game isn\'t loaded yet or this isn\'t the game.');
            return;
        }
        Cozire.Hijack.Game();
        Cozire.loadConfig();
        Cozire.initTicks();
        Game.Win('Third-party');
        if (typeof CM === 'object' && typeof Queue !== 'undefined' && typeof jscolor !== 'undefined') Cozire.cookieMonsterLoaded = true;
        Cozire.PluginHooks.Init();
    },
    cookieMonsterLoaded: false,
    Menu: {
        toggleButton: (configParam, text, description) => {
            let div = document.createElement('div'), a = document.createElement('a'), label = document.createElement('label');
            if (!Cozire.getConfig(configParam)) a.className = 'option off';
            else a.className = 'option';
            a.id = `Cozire-${configParam}`;
            a.onclick = ()=>Cozire.toggleConfig(configParam);
            a.textContent = text;
            label.textContent = description;
            div.className = 'listing';
            div.appendChild(a);
            div.appendChild(label);
            return div;
        },
        actionButton: (configParam, text, description, action) => {
            let div = document.createElement('div'), a = document.createElement('a'), label = document.createElement('label');
            a.className = 'option';
            a.id = `Cozire-${configParam}`;
            a.onclick = action;
            a.textContent = text;
            label.textContent = description;
            div.className = 'listing';
            div.appendChild(a);
            div.appendChild(label);
            return div;
        },
        heading: (text) => {
            let heading = document.createElement('div');
            heading.className = 'title';
            heading.textContent = text;
            return heading;
        },
        subheading: (text) => {
            let subheading = Cozire.Menu.heading(text);
            subheading.style.fontSize = '17px';
            return subheading;
        },
    },
    saveConfig: () => {
        localStorage.setItem('Cozire', JSON.stringify(Cozire.Config));
    },
    loadConfig: () => {
        let config = localStorage.getItem('Cozire');
        if (config) {
            config = JSON.parse(config);
            Object.keys(config).forEach((key) => {
                Cozire.setConfig(key, config[key]);
            });
        }
    },
    getConfig: (configParam) => {
        if (typeof Cozire.Config[configParam] === 'undefined')
            return Cozire.ConfigDefaults[configParam];
        else return Cozire.Config[configParam];
    },
    setConfig: (configParam, configValue) => {
        if (configValue === Cozire.ConfigDefaults[configParam])
            delete Cozire.Config[configParam];
        else Cozire.Config[configParam] = configValue;
        Cozire.saveConfig();
        return Cozire.getConfig(configParam);
    },
    toggleConfig: (configParam) => {
        let val = Cozire.setConfig(configParam, !Cozire.getConfig(configParam));
        Cozire.updateMenuView(configParam);
        return val;
    },
    updateMenuView: (configParam) => {
        if (!Cozire.getConfig(configParam))
            l(`Cozire-${configParam}`).className = 'option off';
        else
            l(`Cozire-${configParam}`).className = 'option';
    },
    Liberate: {
        Game: () => {
            if (Cozire.OG.UpdateMenu) Game.UpdateMenu = Cozire.OG.UpdateMenu;
            if (Cozire.OG.shimmerPrototypeInit) Game.shimmer.prototype.init = function() {
                Game.shimmerTypes[this.type].initFunc(this);
            };
            if (Game.hasGod) Cozire.Liberate.hasGod();
            Cozire.Liberate.miniGames();
        },
        miniGames: () => {
            if(Game.Objects['Farm'].minigameLoaded && Game.Objects['Farm'].minigame.plants && Game.Objects['Farm'].minigame.soils) {
                if (Cozire.OG.gardenPlantsMortality) Object.keys(Game.Objects['Farm'].minigame.plants).forEach((plantName) => {
                    let plant = Game.Objects['Farm'].minigame.plants[plantName];
                    if (!plant.weed && !plant.fungus) Object.defineProperty(plant, 'immortal', {value:Cozire.OG.gardenPlantsMortality[plantName],configurable: true});
                });
        
                if (Cozire.OG.gardenSoilWeed) Object.keys(Game.Objects['Farm'].minigame.soils).forEach((soilName) => {
                    let soil = Game.Objects['Farm'].minigame.soils[soilName];
                    Object.defineProperty(soil, 'weedMult', {value:Cozire.OG.gardenSoilWeed[soilName],configurable: true});
                });
            }
            if(Game.Objects['Wizard tower'].minigameLoaded && Game.Objects['Wizard tower'].minigame.getFailChance) {
                if (Cozire.OG.grimoireFailChance) Game.Objects['Wizard tower'].minigame.getFailChance = Cozire.OG.grimoireFailChance;
            }
        },
        hasGod: () => {
            if(Game.Objects['Temple'].minigameLoaded && Game.Objects['Temple'].minigame.gods && Cozire.OG.hasGod && Game.hasGod) Game.hasGod = Cozire.OG.hasGod;
            else delete Game.hasGod;
        },
    },
    Hijack: {
        Game: () => {
            if (!Cozire.OG.UpdateMenu) {
                Cozire.OG.UpdateMenu = Game.UpdateMenu;
                Game.UpdateMenu = Cozire.Game.UpdateMenu;
            }
            if (!Cozire.OG.shimmerPrototypeInit) {
                Cozire.OG.shimmerPrototypeInit = true;
                Game.shimmer.prototype.init = function() {
                    if (Cozire.getConfig('blockWrath')) {
                        this.forceObj = {'noWrath':true};
                        Game.shimmerTypes[this.type].initFunc(this);
                    } else {
                        Game.shimmerTypes[this.type].initFunc(this);
                    }
                }
            }
            if (!Cozire.OG.hasGod) Cozire.Hijack.hasGod();
        
            Cozire.Hijack.miniGames();
        },
        miniGames: () => {
            if (!Cozire) return;
            retry = false;
        
            if(!Game.Objects['Farm'].minigameLoaded || !Game.Objects['Farm'].minigame.plants || !Game.Objects['Farm'].minigame.soils) {
                retry = true;
            } else {
                if (!Cozire.OG.gardenPlantsMortality) {
                    Cozire.OG.gardenPlantsMortality = {};
                    Object.keys(Game.Objects['Farm'].minigame.plants).forEach((plantName) => {
                        let plant = Game.Objects['Farm'].minigame.plants[plantName];
                        if (!plant.weed && !plant.fungus) {
                            Cozire.OG.gardenPlantsMortality[plantName] = plant.immortal;
                            Object.defineProperty(plant, 'immortal', {get:()=>{return (Cozire.getConfig('immortalPlants')?true:Cozire.OG.gardenPlantsMortality[plantName])},configurable: true});
                        }
                    });
                }
        
                if (!Cozire.OG.gardenSoilWeed) {
                    Cozire.OG.gardenSoilWeed = {};
                    Object.keys(Game.Objects['Farm'].minigame.soils).forEach((soilName) => {
                        let soil = Game.Objects['Farm'].minigame.soils[soilName];
                        Cozire.OG.gardenSoilWeed[soilName] = soil.weedMult;
                        Object.defineProperty(soil, 'weedMult',{get:()=>{return (Cozire.getConfig('neverWeeds')?0:Cozire.OG.gardenSoilWeed[soilName])},configurable: true});
                    });
                }
            }
        
            if(!Game.Objects['Wizard tower'].minigameLoaded || !Game.Objects['Wizard tower'].minigame.getFailChance) {
                retry = true;
            } else {
                if (!Cozire.OG.grimoireFailChance) {
                    Cozire.OG.grimoireFailChance = Game.Objects['Wizard tower'].minigame.getFailChance;
                    Game.Objects['Wizard tower'].minigame.getFailChance = (spell)=>(Cozire.getConfig('miracleSpells')?0:Cozire.OG.grimoireFailChance(spell));
                }
            }
        
            if (retry) setTimeout(Cozire.Hijack.miniGames, 1000);
        },
        hasGod: () => {
            if (!Cozire) return;
            if(!Game.Objects['Temple'].minigameLoaded || !Game.Objects['Temple'].minigame.gods) {
                setTimeout(Cozire.Hijack.hasGod, 1000); // We keep running this until we get the real Game.hasGod()
            } else if (!Cozire.OG.hasGod && Game.hasGod) {
                Cozire.OG.hasGod = Game.hasGod;
            }
            Game.hasGod = function(what) {
                if (Cozire.getConfig('allGodsActive')) {
                    if (['ages'].includes(what)) return false; // Add gods to this if you want to skip them
                    return 1;
                } else if (Cozire.getConfig('allGodsSlotOne')) {
                    if(!Game.Objects['Temple'].minigameLoaded || !Game.Objects['Temple'].minigame.gods) return false; // Don't run if minigame isn't loaded (errors otherwise)
                    let god = Game.Objects['Temple'].minigame.gods[what];
                    for (let i=0;i<3;i++)
                        if (Game.Objects['Temple'].minigame.slot[i]==god.id) return 1;
                    return false;
                } else {
                    if (Cozire.OG.hasGod) return Cozire.OG.hasGod(what);
                    else return false;
                }
            }
        },
    },
    initTicks: () => {
        Object.keys(Cozire.ticks).forEach((tickThis) => {
            let tick = Cozire.ticks[tickThis];
            if (!tick.intervalId) tick.intervalId = setInterval(tick.onTick, tick.rate);
        });
    },
    ticks: {
        'autoClicker': {
            'intervalId': null,
            'rate': 50,
            'onTick': ()=>{
                if (!Cozire.getConfig('autoClicker')) return;
                Game.ClickCookie();
            },
        },
        'autoGolden': {
            'intervalId': null,
            'rate': 500,
            'onTick': ()=>{
                if (!Cozire.getConfig('autoGolden')) return;
                Game.shimmers.forEach(function(shimmer) {
                    if (shimmer.type == "golden") { shimmer.pop() }
                })
            },
        },
        'autoReindeer': {
            'intervalId': null,
            'rate': 500,
            'onTick': ()=>{
                if (!Cozire.getConfig('autoReindeer')) return;
                Game.shimmers.forEach(function(shimmer) {
                    if (shimmer.type == 'reindeer') { shimmer.pop() }
                })
            },
        },
        'autoNews': {
            'intervalId': null,
            'rate': 3000,
            'onTick': ()=>{
                if (!Cozire.getConfig('autoNews')) return;
                if (Game.TickerEffect && Game.TickerEffect.type == 'fortune') Game.tickerL.click();
            },
        },
        'infiniteCookies': {
            'intervalId': null,
            'rate': 100,
            'onTick': ()=>{
                if (!Cozire.getConfig('infiniteCookies')) return;
                Game.cookies = Game.cookiesEarned;
            },
        },
        'infiniteMagic': {
            'intervalId': null,
            'rate': 1000,
            'onTick': ()=>{
                if (!Cozire.getConfig('infiniteMagic')) return;
                if (Game.Objects['Wizard tower'].minigameLoaded && Game.Objects['Wizard tower'].minigame.magicM)
                    Game.Objects['Wizard tower'].minigame.magic = Game.Objects['Wizard tower'].minigame.magicM;
            },
        },
        'infiniteSwaps': {
            'intervalId': null,
            'rate': 1000,
            'onTick': ()=>{
                if (!Cozire.getConfig('infiniteSwaps')) return;
                if(!Game.Objects['Temple'].minigameLoaded || !Game.Objects['Temple'].minigame.gods) return;
                Game.Objects['Temple'].minigame.swaps=3;
                Game.Objects['Temple'].minigame.swapT=Date.now();
                Game.Objects['Temple'].minigame.lastSwapT=0;
            },
        },
    },
    PluginHooks: {
        Init: () => {
            Object.keys(Cozire.Plugins).forEach((key) => {
                let plugin = Cozire.Plugins[key];
                if (typeof plugin['Init'] === 'function') plugin['Init']();
            });
        },
        UnloadPlugins: () => {
            Object.keys(Cozire.Plugins).forEach((key) => {
                let plugin = Cozire.Plugins[key];
                if (typeof plugin['Unload'] === 'function') plugin['Unload']();
            });
        },
        UpdateMenu: (fragment) => {
            Object.keys(Cozire.Plugins).forEach((key) => {
                let plugin = Cozire.Plugins[key];
                if (typeof plugin['Game'] === 'object' && typeof plugin['Game']['UpdateMenu'] === 'function') plugin['Game']['UpdateMenu'](fragment);
            });
        },
    },
    Plugins: {}, // Plugins
};

// You can setup `CozirePlugins` (object) with your custom plugins before loading this script
if (typeof CozirePlugins === 'object') {
    Object.keys(CozirePlugins).forEach((key) => {
        let plugin = CozirePlugins[key];
        if (typeof plugin === 'object') {
            Cozire.Plugins[key] = plugin;
            if (typeof Cozire.Plugins[key]['Loaded'] === 'function') Cozire.Plugins[key].Loaded();
        } else if (typeof plugin === 'function') {
            Cozire.Plugins[key] = plugin;
            Cozire.Plugins[key]();
        }
    });
}

// Alternatively, you can set CozireInit to false to prevent the Init and set up your plugins after loading the script, remember to call `Cozire.Init()` afterwards.
if (typeof CozireInit === 'undefined' || CozireInit) Cozire.Init();

/* cSpell:ignore Cozire, Toggleables, prefs, minigame, Mult, grimoire, grimoire's, grimoire\'s, Cyclius, dragonflight, Achiev, jscolor */
