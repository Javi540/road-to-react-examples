import React from 'react'

class Clock extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      time: new Date().toLocaleTimeString()
    };

  }

  tick(){
    this.setState({
      time: new Date().toLocaleTimeString()
    });
  }

  componentDidMount(){
    console.log('Hola')
    this.intervalID = setInterval(()=>this.tick(),1000);
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }
  render(){
    return(
    <p className="App-clock">
      The Time is {this.state.time}
    </p>
    );
  }
}

export default Clock;