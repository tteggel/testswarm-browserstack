/**
 * We need to map the useragent IDs that TestSwarm uses to browser definitions in BrowserStack.
 * TestSwarm useragents.ini: https://github.com/jquery/testswarm/blob/master/config/useragents.ini
 * BrowserStack API: https://github.com/browserstack/api , http://api.browserstack.com/1/browsers
 */
 var map = {
   "Windows|Chrome|19": { version: '19.0', browser: 'chrome', os: 'win' },
   "Windows|Chrome|20": { version: '20.0', browser: 'chrome', os: 'win' },
   "Windows|Chrome|21": { version: '21.0', browser: 'chrome', os: 'win' },
   "Windows|Chrome|22": { version: '22.0', browser: 'chrome', os: 'win' },
   "Windows|Chrome|23": { version: '23.0', browser: 'chrome', os: 'win' },
   "MacOSX|Chrome|18": { version: '18.0', browser: 'chrome', os: 'mac' },
   "MacOSX|Chrome|19": { version: '19.0', browser: 'chrome', os: 'mac' },
   "MacOSX|Chrome|20": { version: '20.0', browser: 'chrome', os: 'mac' },
   "MacOSX|Chrome|21": { version: '21.0', browser: 'chrome', os: 'mac' },
   "MacOSX|Chrome|22": { version: '22.0', browser: 'chrome', os: 'mac' },
   "Windows|Firefox|3|6": { version: '3.6', browser: 'firefox', os: 'win' },
   "Windows|Firefox|14": { version: '14.0', browser: 'firefox', os: 'win' },
   "Windows|Firefox|15": { version: '15.0', browser: 'firefox', os: 'win' },
   "Windows|Firefox|16": { version: '16.0', browser: 'firefox', os: 'win' },
   "MacOSX|Firefox|13": { version: '13.0', browser: 'firefox', os: 'mac' },
   "MacOSX|Firefox|14": { version: '14.0', browser: 'firefox', os: 'mac' },
   "MacOSX|Firefox|15": { version: '15.0', browser: 'firefox', os: 'mac' },
   "MacOSX|Firefox|16": { version: '16.0', browser: 'firefox', os: 'mac' },
   "Windows|IE|8": { version: '8.0', browser: 'ie', os: 'win' },
   "Windows|IE|9": { version: '9.0', browser: 'ie', os: 'win' },
   "Windows|IE|10": { version: '10.0', browser: 'ie', os: 'win' },
   "MacOSX|Safari|5|0": { version: '5.0', browser: 'safari', os: 'mac' },
   "MacOSX|Safari|5|1":  { version: '5.1', browser: 'safari', os: 'mac' },
   "Windows|Safari|5|0":  { version: '5.0', browser: 'safari', os: 'win' },
   "Windows|Safari|5|1":  { version: '5.1', browser: 'safari', os: 'win' },
   "Android|Android|4|0": { device: 'Samsung Galaxy S II', version: '2.3', os: 'android' },
   "iOS|Safari|4|0": { device: 'iPad', version: '3.2', os: 'ios' },
   "iOS|Safari|5|0": { device: 'iPad 2', version: '4.3.2', os: 'ios' }
 };


/*
{
   '': { device: 'iPhone 3GS', version: '3.0', os: 'ios' },
   '': { device: 'iPhone 4', version: '4.0', os: 'ios' },
   '': 
   '': 
   '': { device: 'Samsung Galaxy S', version: '2.1', os: 'android' },
   '': ,
   '': { device: 'Samsung Galaxy Note', version: '2.3', os: 'android' },
   '': { device: 'Samsung Galaxy Nexus', version: '4.0.3', os: 'android' },
   '': { device: 'Motorola Defy Plus', version: '2.3', os: 'android' },
   '': { device: 'Motorola Droid Razr', version: '2.3', os: 'android' },
   '': { device: 'Motorola Droid 4', version: '2.3', os: 'android' },
   '': { device: 'Motorola Droid Bionic', version: '2.3', os: 'android' },
   '': { device: 'Motorola Atrix 2', version: '2.3', os: 'android' },
   '': { device: 'Motorola Photon 4G', version: '2.3', os: 'android' },
   '': { device: 'Motorola Razr', version: '4.0.3', os: 'android' },
   '': { device: 'Motorola Atrix HD', version: '4.0.3', os: 'android' },
   '': { device: 'HTC Hero', version: '1.5', os: 'android' },
   '': { device: 'HTC Wildfire', version: '2.2', os: 'android' },
   '': { device: 'HTC Evo 3D', version: '4.0.3', os: 'android' },
   '': { device: 'Sony Xperia X10', version: '1.6', os: 'android' },
   '': { device: 'LG Optimus 3D', version: '2.2', os: 'android' },
   '': { device: 'Samsung Galaxy Tab 8.9', version: '2.2', os: 'android' },
   '': { device: 'Google Nexus 7', version: '4.1', os: 'android' },
   '': { version: '4.0', browser: 'safari', os: 'mac' },
   '': { version: '5.0', browser: 'safari', os: 'mac' },
   '': { version: '5.1', browser: 'safari', os: 'mac' },
   '': { version: '5.0', browser: 'firefox', os: 'mac' },
   '': { version: '6.0', browser: 'firefox', os: 'mac' },
   '': { version: '7.0', browser: 'firefox', os: 'mac' },
   '': { version: '8.0', browser: 'firefox', os: 'mac' },
   '': { version: '9.0', browser: 'firefox', os: 'mac' },
   '': { version: '10.0', browser: 'firefox', os: 'mac' },
   '': { version: '11.0', browser: 'firefox', os: 'mac' },
   '': { version: '12.0', browser: 'firefox', os: 'mac' },
   '': { version: '13.0', browser: 'firefox', os: 'mac' },
   '': { version: '14.0b', browser: 'firefox', os: 'mac' },
   '': { version: '14.0', browser: 'chrome', os: 'mac' },
   '': { version: '16.0', browser: 'chrome', os: 'mac' },
   '': { version: '17.0', browser: 'chrome', os: 'mac' },
   '': { version: '18.0', browser: 'chrome', os: 'mac' },
   '': { version: '19.0', browser: 'chrome', os: 'mac' },
   '': { version: '20.0b', browser: 'chrome', os: 'mac' },
   '': { version: '11.1', browser: 'opera', os: 'mac' },
   '': { version: '11.6', browser: 'opera', os: 'mac' },
   '': { version: '12.0', browser: 'opera', os: 'mac' },
   '': { version: '4.0', browser: 'safari', os: 'win' },
   '': { version: '5.0', browser: 'safari', os: 'win' },
   '': { version: '5.1', browser: 'safari', os: 'win' },
   '': { version: '3.0', browser: 'firefox', os: 'win' },
   '': { version: '3.6', browser: 'firefox', os: 'win' },
   '': { version: '4.0', browser: 'firefox', os: 'win' },
   '': { version: '5.0', browser: 'firefox', os: 'win' },
   '': { version: '6.0', browser: 'firefox', os: 'win' },
   '': { version: '7.0', browser: 'firefox', os: 'win' },
   '': { version: '8.0', browser: 'firefox', os: 'win' },
   '': { version: '9.0', browser: 'firefox', os: 'win' },
   '': { version: '10.0', browser: 'firefox', os: 'win' },
   '': { version: '11.0', browser: 'firefox', os: 'win' },
   '': { version: '12.0', browser: 'firefox', os: 'win' },
   '': { version: '13.0', browser: 'firefox', os: 'win' },
   '': { version: '14.0', browser: 'firefox', os: 'win' },
   '': { version: '15.0b', browser: 'firefox', os: 'win' },
   '': { version: '14.0', browser: 'chrome', os: 'win' },
   '': { version: '15.0', browser: 'chrome', os: 'win' },
   '': { version: '16.0', browser: 'chrome', os: 'win' },
   '': { version: '17.0', browser: 'chrome', os: 'win' },
   '': { version: '18.0', browser: 'chrome', os: 'win' },
   '': { version: '19.0', browser: 'chrome', os: 'win' },
   '': { version: '20.0', browser: 'chrome', os: 'win' },
   '': { version: '21.0b', browser: 'chrome', os: 'win' },
   '': { version: '22.0d', browser: 'chrome', os: 'win' },
   '': { version: '6.0', browser: 'ie', os: 'win' },
   '': { version: '7.0', browser: 'ie', os: 'win' },
   '': { version: '8.0', browser: 'ie', os: 'win' },
   '': { version: '9.0', browser: 'ie', os: 'win' },
   '': { version: '10.0', browser: 'ie', os: 'win' },
   '': { version: '10.0', browser: 'opera', os: 'win' },
   '': { version: '11.1', browser: 'opera', os: 'win' },
   '': { version: '11.5', browser: 'opera', os: 'win' },
   '': { version: '11.6', browser: 'opera', os: 'win' },
   '': { version: '12.0', browser: 'opera', os: 'win' },
   '': { version: '12.5b', browser: 'opera', os: 'win' },
   '': { device: 'HTC Wildfire', version: '240x320', os: 'opera' },
   '': { device: 'LG Optimus One', version: '320x480', os: 'opera' },
   '': { device: 'Nokia 5800 XpressMusic', version: '360x640', os: 'opera' },
   '': { device: 'Samsung Galaxy S II', version: '480x800', os: 'opera' },
   '': { device: 'Motorola Droid X', version: '480x854', os: 'opera' },
   '': { device: 'Motorola Atrix 4G', version: '540x960', os: 'opera' },
   '': { device: 'Samsung Galaxy Tab', version: '1024x600', os: 'opera' },
   '': { device: 'Samsung Galaxy Tab 10.1', version: '1280x800', os: 'opera' }
};

var omap = {
    'Chrome|17':{
        name:'chrome',
        version:'17.0'
    },
    'Chrome|18':{
        name:'chrome',
        version:'18.0'
    },
    'Chrome|19':{
        name:'chrome',
        version:'19.0'
    },
    'Chrome|20':{
        name:'chrome',
        version:'20.0b'
    },
    // 'Firefox|3|5': Not in browserstack anymore
    'Firefox|3|6':{
        name:'firefox',
        version:'3.6'
    },
    'Firefox|4':{
        name:'firefox',
        version:'4.0'
    },
    'Firefox|5':{
        name:'firefox',
        version:'5.0'
    },
    'Firefox|6':{
        name:'firefox',
        version:'6.0'
    },
    'Firefox|7':{
        name:'firefox',
        version:'7.0'
    },
    'Firefox|8':{
        name:'firefox',
        version:'8.0'
    },
    'Firefox|9':{
        name:'firefox',
        version:'9.0'
    },
    'Firefox|10':{
        name:'firefox',
        version:'10.0'
    },
    'Firefox|11':{
        name:'firefox',
        version:'11.0'
    },
    'Firefox|12':{
        name:'firefox',
        version:'12.0'
    },
    'Firefox|13':{
        name:'firefox',
        version:'13.0'
    },
    'IE|6':{
        name:'ie',
        version:'6.0'
    },
    'IE|7':{
        name:'ie',
        version:'7.0'
    },
    'IE|8':{
        name:'ie',
        version:'8.0'
    },
    'IE|9':{
        name:'ie',
        version:'9.0'
    },
    'IE|10':{
        name:'ie',
        version:'10.0'
    },
    'Opera|11|10':{
        name:'opera',
        version:'11.1'
    },
    'Opera|11|50':{
        name:'opera',
        version:'11.5'
    },
    'Opera|11|60':{
        name:'opera',
        version:'11.6'
    },
    'Opera|12|0':{
        name:'opera',
        version:'12.0'
    },
    // 'Opera|12|0': No browserstack yet
    'Safari|4':{
        name:'safari',
        version:'4.0'
    },
    'Safari|5|0':{
        name:'safari',
        version:'5.0'
    },
    'Safari|5|1':{
        name:'safari',
        version:'5.1'
    }
    // TODO: Need BrowserStack API v2 for other platforms (issue #19)
    // 'Android|1|5': {},
    // 'Android|1|6': {},
    // 'Android|2|1': {},
    // 'Android|2|2': {},
    // 'Android|2|3': {},
    // 'Fennec|4': {},
    // 'iPhone|3|2': {},
    // 'iPhone|4|3': {},
    // 'iPhone|5': {},
    // 'iPad|3|2': {},
    // 'iPad|4|3': {},
    // 'iPad|5': {},
    // 'Opera Mobile': {},
    // 'Opera Mini|2': {},
    // 'Palm Web|1': {},
    // 'Palm Web|2': {},
    // 'IEMobile|7': {},
};
*/

module.exports = {
    map:map
};

