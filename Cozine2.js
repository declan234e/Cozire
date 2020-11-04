if (typeof Cozine !== 'undefined') {
    if (Cozine === null) {
        delete Cozine;
    } else throw new Error('Cozine mod already loaded.');
}
var Cozine = {
    OG: {}, // Original Game Data
    Game: { // Our overrides
        UpdateMenu: () => {
            Cozine.OG.UpdateMenu();
            if (Game.onMenu == 'prefs') {
                let fragment = document.createDocumentFragment();
                fragment.appendChild(Cozine.Menu.subheading('Infinite Stuff'));
                fragment.appendChild(Cozine.Menu.toggleButton('infiniteCookies','Infinite Cookies','Causes your cookies to constantly regenerate.'));
                fragment.appendChild(Cozine.Menu.toggleButton('infiniteMagic','Infinite Magic','Causes your Grimoire magic to recharge almost instantly'));
                fragment.appendChild(Cozine.Menu.toggleButton('infiniteSwaps','Infinite Swaps','Causes your Pantheon swaps to regenerate almost instantly.'));
                fragment.appendChild(Cozine.Menu.heading('Cozine Actions'));
                fragment.appendChild(Cozine.Menu.subheading('Spawning'));
                fragment.appendChild(Cozine.Menu.actionButton('spawnGolden','Spawn a Golden Cookie','Spawns a golden cookie.', Crustulum.Actions.spawnGolden));
                fragment.appendChild(Cozine.Menu.actionButton('spawnGoldenFrenzy','Spawn a Frenzy Cookie','Spawns a golden cookie that will cause a frenzy.', Crustulum.Actions.spawnGolden));
                fragment.appendChild(Cozine.Menu.actionButton('spawnGoldenDragonflight','Spawn a Dragonflight Cookie','Spawns a golden cookie that will cause a dragonflight.', Crustulum.Actions.spawnGoldenDragonflight));
                fragment.appendChild(Cozine.Menu.actionButton('giveCookies','Give Cookies','Gives you the most cookies you can have without getting the cheated cookies achievement.', Crustulum.Actions.giveCookies));
                fragment.appendChild(Cozine.Menu.subheading('Misc'));
                fragment.appendChild(Cozine.Menu.actionButton('removeCheatedCookies','Remove Cheat Achievement','Remove \'Cheated cookies taste awful\' achievement', Crustulum.Actions.removeCheatedCookies));

        
                l('menu').childNodes[2].insertBefore(fragment, l('menu').childNodes[2].childNodes[l('menu').childNodes[2].childNodes.length - 1]);
            }
        },
    },
    Actions: { // Our action library
        spawnGolden: () => {
            Game.shimmerTypes.golden.time = Game.shimmerTypes.golden.maxTime;
        },
        spawnGoldenFrenzy: ()=>Cozine.Actions.spawnGoldenFixed('frenzy'),
        spawnGoldenDragonflight: ()=>Cozine.Actions.spawnGoldenFixed('dragonflight'),
        spawnGoldenFixed: (type) => {
            let newShimmer = new Game.shimmer('golden',{noWrath:true});
            newShimmer.dur = 10000;
            newShimmer.life = Math.ceil(Game.fps*newShimmer.dur);
            newShimmer.force = type;
            newShimmer.sizeMult = 2;
            return newShimmer;
        },
        removeCheatedCookies: ()=>Game.RemoveAchiev('Cheated cookies taste awful'),
        giveCookies: ()=>{
            Game.cookies = Game.cookiesEarned;
        },
        unloadCozine: ()=>{
            Object.keys(Cozine.ticks).forEach((tickThis) => {
                let tick = Cozine.ticks[tickThis];
                if (tick.intervalId) {
                    clearInterval(tick.intervalId);
                    tick.intervalId = 0;
                }
            });
            Cozine.Liberate.Game();
            Game.UpdateMenu();
            setTimeout(() => Cozine = null, 100);
        },
    },
    ConfigDefaults: { // The default value for the configs
        'infiniteCookies': false,
        'infiniteMagic': false,
        'infiniteSwaps': false,
    },
    Config: {}, // User settings
    Init: () => { // Initialize the add-on.
        if (!Game || !Game.version || !Game.updateLog) {
            alert('The game isn\'t loaded yet or this isn\'t the game.');
            return;
        }
        Cozine.Hijack.Game();
        Cozine.loadConfig();
        Cozine.initTicks();
        Game.Win('Third-party');
    },
    Menu: {
        toggleButton: (configParam, text, description) => {
            let div = document.createElement('div'), a = document.createElement('a'), label = document.createElement('label');
            if (!Cozine.getConfig(configParam)) a.className = 'option off';
            else a.className = 'option';
            a.id = `cozine-${configParam}`;
            a.onclick = ()=>Cozine.toggleConfig(configParam);
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
            a.id = `cozine-${configParam}`;
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
            let subheading = Cozine.Menu.heading(text);
            subheading.style.fontSize = '17px';
            return subheading;
        },
    },
    saveConfig: () => {
        localStorage.setItem('Cozine', JSON.stringify(Cozine.Config));
    },
    loadConfig: () => {
        let config = localStorage.getItem('Cozine');
        if (config) {
            config = JSON.parse(config);
            Object.keys(config).forEach((key) => {
                Cozine.setConfig(key, config[key]);
            });
        }
    },
    getConfig: (configParam) => {
        if (typeof Cozine.Config[configParam] === 'undefined')
            return Cozine.ConfigDefaults[configParam];
        else return Cozine.Config[configParam];
    },
    setConfig: (configParam, configValue) => {
        if (configValue === Cozine.ConfigDefaults[configParam])
            delete Cozine.Config[configParam];
        else Cozine.Config[configParam] = configValue;
        Cozine.saveConfig();
        return Cozine.getConfig(configParam);
    },
    toggleConfig: (configParam) => {
        let val = Cozine.setConfig(configParam, !Cozine.getConfig(configParam));
        Cozine.updateMenuView(configParam);
        return val;
    },
    updateMenuView: (configParam) => {
        if (!Cozine.getConfig(configParam))
            l(`cozine-${configParam}`).className = 'option off';
        else
            l(`cozine-${configParam}`).className = 'option';
}}