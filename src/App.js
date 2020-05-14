import React, {useEffect} from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
// import "socket.io"

// import {useRef} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

// const io = require('socket.io')();
// import openSocket from 'socket.io-client';
// let myURL = "localhost:5000";
// const socket = require('socket.io').connect(myURL);

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      word: "",
      entryMessage: "",
      convertText: "",
      changed: false,
      lastNumRequests: null,
      ableToLoadMore: false,
      currNumRequest: 0,
    };
    this.url = "https://608dev-2.net/sandbox/sc/ralcanta/crazy_typing/server.py";
  }
  handleChange = (event)=>{
    this.setState({word: event.target.value});
    event.preventDefault();
  }
  changeCase = (letter) => {
    return (letter === letter.toUpperCase()) ? letter.toLowerCase() : letter.toUpperCase();
  }
  handleSubmit = (e) =>{
    let convertText = this.convertText(this.state.word);
    console.log(convertText);
    // document.getElementById("crazy_output").innerText = convertText;
    this.setState({
      changed: true,
      convertText: convertText
    });
    this.addAnEntry();
    e.preventDefault();

  }
  convertText = (word) => {
    let result = "";
    for (let i = 0; i < word.length; i++){
      let changedOrNot = Math.random() < 0.5 ? word[i] : this.changeCase(word[i]);
      result += changedOrNot;
    }
    return result;
  }
  getNumberOfEntries = () =>{
    fetch(this.url)
    .then(res => res.json())
    .then(res => {
      this.setState({ //every time we can get the request, we save it in current
        currNumRequest: res,
        lastNumRequests: res,
        ableToLoadMore: true,
      });
    },
    (error) => {
        this.setState({
          ableToLoadMore: false,
        });
      }
    )
  }
  addAnEntry = () =>{
    // io.emit('new_entry');
    let postParams = {
      headers: {
        "content-type": "applications/jsons; charset=UTF-8"
      },
      method:"POST"
    }
    fetch(this.url, postParams)
    .then(data => data.json)
    .then(res => console.log(res))
  }
  componentDidMount = () =>{
    this.getNumberOfEntries();
    // console.log(response);
    let entryMessage = "Why not type like this?";
    this.setState({
      entryMessage: this.convertText(entryMessage)
    });

    this.timer = setInterval(() => {
      console.log("Trying to get...");
      this.getNumberOfEntries();
    }, 1000);

    // this.setupSocketClient();
  }
  // setupSocketClient = () =>{
  //   // var io = socket.connect("http://localhost:5000/");
  //   // io.on('connect', ()=>{
  //   //   console.log("socked succesfully connected!");
  //   // })

  // }
  componentWillUnmount(){
    console.log("clearing timer...");
    clearInterval(this.timer);
  }
  resetWord = () =>{
    this.setState({
      word: "",
      convertText: "",
      changed: false,
    });
  }
  render(){
    let numRequests = this.state.ableToLoadMore ? this.state.currNumRequest: this.state.lastNumRequests;
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Bored of normal typing?
          </p>
          <h1 className="title"> {this.state.entryMessage}</h1>
          <Form onSubmit ={this.handleSubmit}>
            <p>Try typing <i>anything</i> (even code!) and see it <i>CHaNGeD</i></p>
            <Form.Control as="textarea"  value = {this.state.word} onChange= {this.handleChange}/>
            <Button variant="primary" type="submit" className="separated">
              ChAnGe It
            </Button>

            <Button variant="danger" onClick = {this.resetWord}>
              Reset
            </Button>
          </Form>
          {
          this.state.changed && 
          <Col md={5} className = "output">
            <i>Output:</i>
            <Form.Control disabled={true} as="textarea"  value = {this.state.convertText}/>
            <CopyToClipboard text ={this.state.convertText}>
              <Button variant="info">
                Copy
              </Button>
            </CopyToClipboard>
          </Col>
          } 
        <p className ="footer">
          Do you think this is useless? Me too! <br></br>
          However, this has been used <i className="num_times">{numRequests} times</i>  already. So, who knows?
        </p>

        </header>
      </div>
    );
  }
}

export default App;
