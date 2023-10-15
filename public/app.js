class App extends React.Component {
  constructor() {
      super();
      this.state = {
          pdfFile: null,
      };
  }

  handleFileChange = (event) => {
      const file = event.target.files[0];
      this.setState({ pdfFile: file });
  };

  render() {
      return (
          <div>
              <h1>PDF Uploader</h1>
              <input type="file" accept=".pdf" onChange={this.handleFileChange} />
              {this.state.pdfFile && (
                  <embed src={URL.createObjectURL(this.state.pdfFile)} width="800" height="600" />
              )}
          </div>
      );
  }
}

class Chat extends React.Component {
  constructor() {
      super();
      this.state = {
          messages: [],
          newMessage: '',
      };
  }

  handleInputChange = (event) => {
      this.setState({ newMessage: event.target.value });
  };

  handleSendMessage = () => {
      const { newMessage, messages } = this.state;
      if (newMessage) {
          const updatedMessages = [...messages, newMessage];
          this.setState({ messages: updatedMessages, newMessage: '' });
      }
  };

  render() {
      return (
          <div>
              <h1>Chat Interface</h1>
              <div className="chat-container">
                  <div className="messages">
                      {this.state.messages.map((message, index) => (
                          <div key={index} className="message">
                              {message}
                          </div>
                      ))}
                  </div>
                  <div className="input-container">
                      <input
                          type="text"
                          placeholder="Type your message..."
                          value={this.state.newMessage}
                          onChange={this.handleInputChange}
                      />
                      <button onClick={this.handleSendMessage}>Send</button>
                  </div>
              </div>
          </div>
      );
  }
}

ReactDOM.render(
  <div>
      <App />
      <Chat />
  </div>,
  document.getElementById("root")
);
