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
      play: true,
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

  playMusic(p) {
    this.setState({
      play: p
    })
  }

  render() {
    return (
      <div>
        <div>
          <Channel soundSource="voice.mp3" soloMode={this.state.soloedChannels} toggleSoloMode={this.toggleSoloMode} play={this.state.play}/>
          <Channel soundSource="bass.mp3" soloMode={this.state.soloedChannels} toggleSoloMode={this.toggleSoloMode} play={this.state.play}/>
          <Channel soundSource="drums.mp3" soloMode={this.state.soloedChannels} toggleSoloMode={this.toggleSoloMode} play={this.state.play}/>
          <Channel soundSource="choir.mp3" soloMode={this.state.soloedChannels} toggleSoloMode={this.toggleSoloMode} play={this.state.play}/>
        </div>
        <div>

        </div>
      </div>
    );
  }
}

// class MixerControls extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//         play
//     }
//   }
// }

class Channel extends Component {
  constructor(props) {
    super(props);
    this.volumeChange = this.volumeChange.bind(this);
    this.soloChannelToggle = this.soloChannelToggle.bind(this);
    this.muteChannelToggle= this.muteChannelToggle.bind(this);
    this.state = {
      isChannelMuted: false,
      isChannelSoloed: false,
      volume: 30
    };
  }

  componentWillMount() {
    this.sound = new buzz.sound(this.props.soundSource).loop();
    this.sound.setVolume(this.state.volume);
    (this.props.soloMode || this.state.isChannelMuted) && !this.state.isChannelSoloed ? this.sound.mute() : this.sound.unmute();
    (this.props.play) ? this.sound.play() : this.sound.stop();
  }

  componentWillUnmount() {
    this.sound = null;
  }

  muteChannelToggle() {
    this.setState((prevState) => ({
      isChannelMuted: !prevState.isChannelMuted
    }))
  }

  soloChannelToggle() {
    const soloed = !this.state.isChannelSoloed
    this.setState(
      {isChannelSoloed: soloed},
      () => this.props.toggleSoloMode(soloed)
    )
  }

  volumeChange(v) {
    this.setState(
      {volume: v},
      () => this.sound.setVolume(v)
    )
  }

  componentDidUpdate(prevState, prevProps) {

    if (prevState.isChannelMuted !== this.state.isChannelMuted ||
        prevState.isChannelSoloed !== this.state.isChannelSoloed ||
        prevProps.soloMode !== this.props.soloMode) {
      (this.props.soloMode || this.state.isChannelMuted) && !this.state.isChannelSoloed ? this.sound.mute() : this.sound.unmute();
    }

    if (prevProps.play !== this.props.play) {
      (this.props.play) ? this.sound.play() : this.sound.stop();
    }
  }

  render() {
    return (
      <div>
        <MixerToggleButton color='red' on={this.state.isChannelMuted} onButtonPress={this.muteChannelToggle}/>
        <MixerToggleButton color='green' on={this.state.isChannelSoloed} onButtonPress={this.soloChannelToggle}/>
        <MixerSlider sliderValue={this.state.volume} onSliderMove={this.volumeChange}/>
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
      <div>
      <input type="range" value={this.props.sliderValue} onChange={this.handleChange}/>{this.props.sliderValue}
      </div>
    );
  }
}




export default App;
