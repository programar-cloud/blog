const promisify = require('util').promisify;
const EventEmitter = require('events');

const lgtv = require('lgtv');

const execAsync = promisify(require('child_process').exec);
const spawn = require('child_process').spawn;

const TV_RETRY_TIMEOUT = 20;
const showFloatAsync = promisify(lgtv.show_float);
const connectAsync = promisify(lgtv.connect);
const channelListAsync = promisify(lgtv.channellist);
const setChannelAsync = promisify(lgtv.set_channel);
const powerOffAsync = promisify(lgtv.turn_off);

const PowerStates = Object.freeze(
  {UNKNOWN : 'unknown', STANDBY : 'standby', ON : 'on'});

const TvEvents = Object.freeze(
  {ACTIVE_CHANNEL_CHANGED : 'activeChannelChanged'});

class LgTV extends EventEmitter  {

  constructor(options) {
    super();
    this.channels = {};
    this.name = options ? options.name : 'tv';
    this.tvip = options ? options.tvip : null;
  }

  /**
   * returns on, standby or unknown
   */
  async getPowerState() {
    const stdout = await this._invokeHdmi('pow');
    const idx = stdout.indexOf('power status: ');
    if (idx === -1) throw stdout;
    const stateString = stdout.substring(idx + 'power status: '.length);
    return stateString;
  }
  
  async setPowerState(state) {
    if (state === PowerStates.ON) {
      const stdout = await this._invokeHdmi('on');
    } else if (state === PowerStates.STANDBY) {
      const stdout = await this._invokeHdmi('standby');
    }
  }

  findIP() {
    return new Promise((resolve, reject) => {
      console.info('Looking for LG tv.');
      lgtv.discover_ip(TV_RETRY_TIMEOUT, function(err, tvip) {
        if (err) {
          reject("Failed to find TV IP address on the LAN. Verify that TV is on, and that you are on the same LAN/Wifi.");
        } else {
          console.info(`LG tv found at addres ${tvip}.`);
          resolve(tvip);
        }
      });
    });
  }

  showMessage(message) {
    this._ensureConnection();
    return showFloatAsync(message);
  }

  async setChannel(number) {
    console.log(`Setting ${number}  as active channel.`);
    await this._updateChannelList();
    const channel = this.channels[number];
    if (!channel) {
      this.showMessage(`Channel ${number} not found, sorry.`);
      super.emit(TvEvents.ACTIVE_CHANNEL_CHANGE_ERROR, number);
    } else {
      await setChannelAsync(this.channels[number].id);
      console.log(`New channel selected (${this.channels[number].name}).`);
      super.emit(TvEvents.ACTIVE_CHANNEL_CHANGED, this.channels[number]);
    }
  }

  async _ensureConnection() {
    if (!this.tvip) {
      console.log('No TV IP found in environment. Trying to find the device.');
      this.tvip = await this.findIP();
      console.log(`IP of the TV found: ${this.tvip}.`);
    }
    console.log('Connecting to the tv.');
    await connectAsync(this.tvip);
    console.log('TV connection established.');
  }

  async _updateChannelList() {
    await this._ensureConnection();
    const lgChannels = JSON.parse(await channelListAsync());
    this.channels = lgChannels.channels.reduce((result, channel, index, array) => {
      result[channel.number] = channel;
      return result;
    });
  }

  _invokeHdmi(command) {
    const promise = new Promise(async function(resolve, reject) {
      console.log(`Executing hdmi command ${command}.`);
      const { stdout, stderr } = await execAsync(`echo "${command} 0" | cec-client -s -d 1`);
      if (stderr) reject(stderr) 
      else resolve(stdout);
    });
    return promise;
  }
}

module.exports.PowerStates = PowerStates;
module.exports.TvEvents = TvEvents;
module.exports.LgTV = LgTV;
