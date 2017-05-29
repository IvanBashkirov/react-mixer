import React, { Component } from 'react';
import './App.css';
import buzz from 'buzz';

class App extends Component {
  render() {
    return (
      <Mixer />
    );
  }
}

class Mixer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      play: false,
      soloedChannels: 0
    }
    this.toggleSoloMode = this.toggleSoloMode.bind(this);
    this.playMusic = this.playMusic.bind(this);
  }

  toggleSoloMode(s) {
    const ch = this.state.soloedChannels + ((s) ? 1 : -1)
    this.setState({
      soloedChannels: ch
    });
  }

  playMusic() {
    this.setState((prevState) => ({play: !prevState.play}));
  }

  render() {
    return (
      <div>
        <div className="mixer">
          <Channel soundSource="voice.mp3" soloMode={Boolean(this.state.soloedChannels)} toggleSoloMode={this.toggleSoloMode} play={this.state.play}/>
          <Channel  soundSource="bass.mp3" soloMode={Boolean(this.state.soloedChannels)} toggleSoloMode={this.toggleSoloMode} play={this.state.play}/>
          <Channel  soundSource="drums.mp3" soloMode={Boolean(this.state.soloedChannels)} toggleSoloMode={this.toggleSoloMode} play={this.state.play}/>
          <Channel soundSource="choir.mp3" soloMode={Boolean(this.state.soloedChannels)} toggleSoloMode={this.toggleSoloMode} play={this.state.play}/>
        </div>
        <MixerToggleButton color="yellow" on={this.state.play} onButtonPress={this.playMusic} />
      </div>
    );
  }
}

class Channel extends Component {
  constructor(props) {
    super(props);
    this.volumeChange = this.volumeChange.bind(this);
    this.soloChannelToggle = this.soloChannelToggle.bind(this);
    this.muteChannelToggle= this.muteChannelToggle.bind(this);
    this.toggleMuteIfNeeded = this.toggleMuteIfNeeded.bind(this);
    this.togglePlayIfNeeded = this.togglePlayIfNeeded.bind(this);
    this.state = {
      isChannelMuted: false,
      isChannelSoloed: false,
      volume: 30
    };
  }

  componentWillMount() {
    this.sound = new buzz.sound(this.props.soundSource).loop();
    this.sound.setVolume(this.state.volume);
    this.toggleMuteIfNeeded();
    this.togglePlayIfNeeded();
  }

  toggleMuteIfNeeded() {
    (this.props.soloMode || this.state.isChannelMuted) && !this.state.isChannelSoloed ? this.sound.mute() : this.sound.unmute();
  }

  togglePlayIfNeeded() {
    (this.props.play) ? this.sound.play() : this.sound.stop();
  }

  muteChannelToggle() {
    this.setState(
      (prevState) => ({isChannelMuted: !prevState.isChannelMuted}),
      this.toggleMuteIfNeeded
    )
  }

  soloChannelToggle() {
    const soloed = !this.state.isChannelSoloed
    this.setState(
      {isChannelSoloed: soloed},
      () => {
        this.props.toggleSoloMode(soloed);
        this.toggleMuteIfNeeded();
      }
    );
  }

  volumeChange(v) {
    this.setState(
      {volume: v},
      () => this.sound.setVolume(v)
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.soloMode !== this.props.soloMode) this.toggleMuteIfNeeded();
    if (prevProps.play !== this.props.play) this.togglePlayIfNeeded();
  }

  render() {
    return (
      <div className="channel" >
        <MixerSlider sliderValue={this.state.volume} onSliderMove={this.volumeChange}/>
        <MixerToggleButton color='red' on={this.state.isChannelMuted} onButtonPress={this.muteChannelToggle}/>
        <MixerToggleButton color='springgreen' on={this.state.isChannelSoloed} onButtonPress={this.soloChannelToggle}/>
      </div>
    );
  }
}


class MixerToggleButton extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.defaultColor = {backgroundColor: 'grey'};
  }

  handleChange() {
    this.props.onButtonPress();
  }

  render() {
    const buttonStyle = {backgroundColor: this.props.color};
    return (
      <button style={this.props.on ? buttonStyle : this.defaultColor} onClick={this.handleChange}/>
    );
  }
}


class MixerSlider extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onSliderMove(e.target.value);
  }

  render() {
    return (
      <div className="volume-fader" >
      <input type="range" value={this.props.sliderValue} onChange={this.handleChange}/>
      <label>{this.props.sliderValue}</label>
      </div>
    );
  }
}


export default App;
