// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFunctions, httpsCallable } from "firebase/functions";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

import React, { Component } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Twitter from "./assets/twitter.svg";

import { Accordion, Button, FormGroup, TextField, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import Logo from "./assets/logopc.png";
import Loader from "react-loaders";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      background: "generic",
      title: "",
      emphasis: "",
      rarities: [],
      rarity: "",
      limit: "",
      prices: false,
      optionsExpanded: false,
    };

    this.triggerTwitterLogin = this.triggerTwitterLogin.bind(this);
    this.triggerGoogleLogin = this.triggerGoogleLogin.bind(this);
    this.generateGraphic = this.generateGraphic.bind(this);
    this.change = this.change.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleOptionExpansion = this.handleOptionExpansion.bind(this);

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyBZjAp5aWnUV9y_AbI0UeN8fMSco9L7U3U",
      authDomain: "pack-collector.firebaseapp.com",
      projectId: "pack-collector",
      storageBucket: "pack-collector.appspot.com",
      messagingSenderId: "935679710199",
      appId: "1:935679710199:web:906c3ac232f7d9fecf54f2",
      measurementId: "G-60T2BG3K5X",
      databaseURL:
        "https://pack-collector-default-rtdb.europe-west1.firebasedatabase.app/",
    };

    const fireApp = initializeApp(firebaseConfig);

    const appCheck = initializeAppCheck(fireApp, {
      provider: new ReCaptchaV3Provider(
        "6Lfj7aAiAAAAAOZtB0a6MNtSRdFFdCxk5hCPkjWC"
      ),
      isTokenAutoRefreshEnabled: true,
    });

    this.appCheck = appCheck;

    this.fireApp = fireApp;

    const functions = getFunctions(fireApp);
    this.functions = functions;

    const analytics = getAnalytics(fireApp);
    this.analytics = analytics;

    this.database = getDatabase(fireApp);

    this.GoogleAuthProvider = new GoogleAuthProvider();

    // this.provider = new TwitterAuthProvider();
    this.auth = getAuth();

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // write user object to local storage
        localStorage.setItem("user", JSON.stringify(user));

        this.setState({ user: user });
      } else {
        // User is signed out
        localStorage.setItem("user", JSON.stringify(user));

        this.setState({ user: false });
      }
    });
  }

  generateGraphic() {
    this.setState({ image: "loading", optionsExpanded: false });

    // call the firebase function
    const scrape = httpsCallable(this.functions, "scrape");

    scrape({
      background: this.state.background,
      title: this.state.title,
      emphasis: this.state.emphasis,
      rarity: this.state.rarity,
      limit: this.state.limit,
      prices: this.state.prices ? "1" : "",
    }).then((result) => {
      // Read result of the Cloud Function.
      console.log(result);

      this.setState({ image: result.data });
    });

    // const generateGraphic = this.functions().httpsCallable("scrape");

    // generateGraphic({ url: "google.com" })
    //   .then((result) => {
    //     // Read result of the Cloud Function.
    //     const sanitizedMessage = result.data.text;
    //     console.log(sanitizedMessage);
    //   }
    // );
  }

  componentDidMount() {
    // get the redirected user
    getRedirectResult(this.auth)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access Google APIs.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;

        // write user object to local storage
        localStorage.setItem("user", JSON.stringify(user));

        this.setState({ user: user });
      })
      .catch((error) => {
        // Handle Errors here.
        // const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorMessage);
      });

    // get the rarities from the database
    axios
      .get(process.env.REACT_APP_AJAXSERVER + "getRarities.php")
      .then((response) => {
        this.setState({ rarities: response.data });
      });
  }

  triggerTwitterLogin() {
    signInWithRedirect(this.auth, this.provider);
  }

  triggerGoogleLogin() {
    signInWithRedirect(this.auth, this.GoogleAuthProvider);
  }

  change(event) {
    this.setState({ background: event.target.value });
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  }

  handleCheckboxChange(event) {
    const { name } = event.target;
    this.setState((prevState) => {
      let oldState = prevState[name];
      return {
        [name]: !oldState,
      };
    });
  }

  handleOptionExpansion() {
    this.setState((prevState) => {
      let oldState = prevState["optionsExpanded"];
      return {
        optionsExpanded: !oldState,
      };
    });
  }

  render() {
    const theme = createTheme({
      typography: {
        fontFamily: "Matroska",
        fontSize: 12,
        color: "#F8EEDE",
      },
      palette: {
        primary: {
          main: '#ff6a00',
        },
        secondary: {
          main: '#edf2ff',
        },
      },
    });

    return (
      <ThemeProvider theme={theme}>
        {!this.state.user && (
          <img
            alt="Google Login"
            onClick={this.triggerGoogleLogin}
            src={
              "https://developers.google.com/static/identity/images/btn_google_signin_dark_normal_web.png"
            }
          />
        )}
        {this.state.user && (
          <div className={"cloudArea"}>
            <div className={"displayName"}>
              Logged in as {this.state.user.displayName}
            </div>
          </div>
        )}

        <div className={"logo"}>
          <img
            className={"logo__img"}
            src={Logo}
            alt="FUT23 Graphics Generator"
          />
          <div className={"logo__twitter"}>
            <a
              href="https://twitter.com/FUTCoder"
              rel="noreferrer"
              target="_blank"
            >
              <img alt="Twitter Logo" src={Twitter} /> FUT Coder
            </a>
            <a
              href="https://twitter.com/Kimpembro"
              rel="noreferrer"
              target="_blank"
            >
              <img alt="Twitter Logo" src={Twitter} /> Kimpembro
            </a>
            <a
              href="https://twitter.com/Fleck_GFX"
              rel="noreferrer"
              target="_blank"
            >
              <img alt="Twitter Logo" src={Twitter} /> Fleck
            </a>
          </div>
        </div>

        <div className={"filter"}>
            <Accordion expanded={this.state.optionsExpanded} onChange={this.handleOptionExpansion}>
              <AccordionSummary>
                <Typography>Please choose your options...</Typography>
              </AccordionSummary>
              <AccordionDetails>
                
              <FormGroup>
              <div class="filter__item">
                <select
                  id="background"
                  onChange={this.change}
                  value={this.state.background}
                >
                  <option value="generic">Generic Fifa 23</option>
                  <option value="totw">TOTW</option>
                  <option value="otw">OTW</option>
                  <option value="uefa">UEFA</option>
                  <option value="rulebreakers">Rulebreakers</option>
                  <option value="icon">Icon</option>
                  <option value="heroes">Heroes</option>
                </select>
                <label for="background">Background</label>
              </div>
              <div class="filter__item">
              {this.state.rarities.length > 0 && (
                <select
                  id="rarity"
                  onChange={this.handleInputChange}
                  name="rarity"
                  value={this.state.rarity}
                >
                  <option key="0" value="">
                    Select Rarity
                  </option>
                  {this.state.rarities.map((rarity) => (
                    <option key={rarity.id} value={rarity.param}>
                      {rarity.name}
                    </option>
                  ))}
                </select>
              )}
              <label for="rarity">Card Type</label>
              </div>
              <div class="filter__item">
              <TextField
                name="title"
                id="title"
                onChange={this.handleInputChange}
                value={this.state.title}
                label="Title"
              />
              </div>
              <div class="filter__item">
              <TextField
                name="emphasis"
                id="emphasis"
                onChange={this.handleInputChange}
                value={this.state.emphasis}
                label="Emphasis"
              />
              </div>
              <div class="filter__item">
              <TextField
                name="limit"
                id="limit"
                onChange={this.handleInputChange}
                value={this.state.limit}
                label="Limit"
              />
              </div>
              <div class="filter__item">
              <input
                type="checkbox"
                checked={this.state.prices}
                onChange={this.handleCheckboxChange}
                name="prices"
                id="prices"
              />
              <label for="prices">Prices</label>
              </div>
              <Button onClick={this.generateGraphic} variant="contained">
                Generate Graphic
              </Button>
            </FormGroup>
              </AccordionDetails>


            </Accordion>
        </div>

        <div className={"graphic-wrapper"}>
          {this.state.image !== "" && this.state.image !== "loading" && (
            <img
              alt="Loader"
              className={"graphic"}
              src={`data:image/png;base64,${this.state.image}`}
            />
          )}
          {this.state.image === "loading" && (
            <Loader type="line-scale" active />
          )}
        </div>
      </ThemeProvider>
    );
  }
}
export default App;
