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
import Select from "react-select";

import {
  Accordion,
  Button,
  FormGroup,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Logo from "./assets/logopc.png";
import GoogleLogin from "./assets/btn_google_signin_dark_normal_web.png";
import Loader from "react-loaders";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      background: "oop",
      title: "",
      emphasis: "",
      rarities: [],
      rarity: "",
      limit: 23,
      scale: 1,
      prices: true,
      optionsExpanded: false,
      min_rating: 0,
      max_rating: 99,
      orderby: "console_price",
      counter: false,
      packable: true,
      promo: "",
      insta: false,
      possibleCardCount: 0,
    };

    this.triggerTwitterLogin = this.triggerTwitterLogin.bind(this);
    this.triggerGoogleLogin = this.triggerGoogleLogin.bind(this);
    this.generateGraphic = this.generateGraphic.bind(this);
    this.change = this.change.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleOptionExpansion = this.handleOptionExpansion.bind(this);
    this.handleSingleSelect = this.handleSingleSelect.bind(this);
    this.calculatePossibleCards = this.calculatePossibleCards.bind(this);
    this.calculateScale = this.calculateScale.bind(this);
    this.handleReactSelect = this.handleReactSelect.bind(this);

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

        // this.setState({ user: user });
      } else {
        // User is signed out
        localStorage.setItem("user", JSON.stringify(user));

        this.setState({ user: false });
      }
    });
  }

  calculatePossibleCards() {
    axios
      .get(
        process.env.REACT_APP_AJAXSERVER +
          "getGraphicCardCount.php?rarity=" +
          this.state.rarity +
          (this.state.packable ? "&packable=1" : "")
      )
      .then((response) => {
        this.setState({ possibleCardCount: response.data });
        if (response.data > 0 && this.state.limit > response.data) {
          this.setState({ limit: response.data }, () => {
            this.calculateScale();
          });
        }
        
      });
  }

  handleReactSelect(event) {
    const rarityArray = Array.from(event, (option) => option.value);
    this.setState({ rarity: rarityArray }, () => {
      this.calculatePossibleCards();
    });
  }

  calculateScale() {
    // if we are dealing with limit, also set scale accordingly
    const value = this.state.limit;
    if (value >= 121) {
      this.setState({ scale: 0.45 });
    } else if (value >= 115) {
      this.setState({ scale: 0.47 });
    } else if (value >= 109) {
      this.setState({ scale: 0.5 });
    } else if (value >= 91) {
      this.setState({ scale: 0.51 });
    } else if (value >= 86) {
      this.setState({ scale: 0.53 });
    } else if (value >= 81) {
      this.setState({ scale: 0.56 });
    } else if (value >= 76) {
      this.setState({ scale: 0.59 });
    } else if (value >= 61) {
      this.setState({ scale: 0.6 });
    } else if (value >= 57) {
      this.setState({ scale: 0.63 });
    } else if (value >= 53) {
      this.setState({ scale: 0.68 });
    } else if (value >= 49) {
      this.setState({ scale: 0.73 });
    } else if (value >= 37) {
      this.setState({ scale: 0.75 });
    } else if (value >= 34) {
      this.setState({ scale: 0.79 });
    } else if (value >= 31) {
      this.setState({ scale: 0.86 });
    } else if (value >= 28) {
      this.setState({ scale: 0.95 });
    } else if (value >= 19) {
      this.setState({ scale: 1 });
    } else if (value >= 17) {
      this.setState({ scale: 1.06 });
    } else if (value >= 15) {
      this.setState({ scale: 1.16 });
    } else if (value >= 13) {
      this.setState({ scale: 1.28 });
    } else if (value >= 6) {
      this.setState({ scale: 1.42 });
    } else if (value >= 5) {
      this.setState({ scale: 1.58 });
    } else if (value >= 4) {
      this.setState({ scale: 1.76 });
    } else if (value >= 3) {
      this.setState({ scale: 1.97 });
    } else {
      this.setState({ scale: 2.2 });
    }
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
      min_rating: this.state.min_rating,
      max_rating: this.state.max_rating,
      orderby: this.state.orderby,
      scale: this.state.scale,
      counter: this.state.counter,
      packable: this.state.packable,
      promo: this.state.promo,
      insta: this.state.insta,
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
        if (result !== null) {
          const user = result.user;
          // write user object to local storage
          localStorage.setItem("user", JSON.stringify(user));

          this.setState({ user: user });
        }
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

    // count the cards
    this.calculatePossibleCards();
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
    let { name, value, selectedOptions } = event.target;
    // check if value is an array
    if (selectedOptions !== undefined && selectedOptions.length > 0) {
      value = Array.from(selectedOptions, (option) => option.value);
    }

    this.calculateScale();

    this.setState(
      {
        [name]: value,
      },
      () => {
        this.calculatePossibleCards();
      }
    );
  }

  handleSingleSelect(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleCheckboxChange(event) {
    const { name } = event.target;
    this.setState(
      (prevState) => {
        let oldState = prevState[name];
        if (name === "insta" && oldState === false) {
          this.setState({
            limit: 15,
            scale: 0.5,
          });
        }
        return {
          [name]: !oldState,
        };
      },
      () => {
        this.calculatePossibleCards();
      }
    );
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
          main: "#ff6a00",
        },
        secondary: {
          main: "#edf2ff",
        },
        lightgray: {
          main: "#292f35",
        },
        lightergray: {
          main: "#505a64",
        },
      },
    });

    let rarityOptions = [];
    this.state.rarities.forEach((rarity) => {
      rarityOptions.push({
        value: rarity.param,
        label: rarity.name,
      });
    });

    const customStyles = {
      control: (provided, state) => {
        // none of react-select's styles are passed to <Control />
        const background = theme.palette.lightgray.main;
        const minWidth = 200;
        const borderColor = theme.palette.lightergray.main;
        const height = 50;
        const paddingTop = 0;
        return {
          ...provided,
          background,
          minWidth,
          borderColor,
          height,
          paddingTop,
        };
      },
      menu: (provided) => {
        // none of react-select's styles are passed to <Control />
        const zIndex = 3;
        const background = theme.palette.lightgray.main;
        const width = 200;
        const right = 0;
        return { ...provided, background, zIndex, width, right };
      },
      multiValue: (provided) => {
        const background = theme.palette.lightergray.main;
        const height = 27;
        const marginTop = 12;
        return { ...provided, background, height, marginTop };
      },
      multiValueLabel: (provided) => {
        const color = "white";
        const fontSize = 16;
        return { ...provided, color, fontSize };
      },
      menuList: (provided) => {
        return { ...provided };
      },
      indicatorSeparator: (provided) => {
        const height = 30;
        return { ...provided, height };
      },
      option: (provided, state) => {
        const backgroundColor = state.isFocused
          ? theme.palette.primary.main
          : "transparent";
        return { ...provided, backgroundColor };
      },
      valueContainer: (provided) => {
        const alignItems = "flex-start";
        return { ...provided, alignItems };
      },
      placeholder: (provided) => {
        const position = "absolute";
        const top = 15;
        const fontSize = "1.2rem";
        return { ...provided, position, top, fontSize };
      },
    };

    return (
      <ThemeProvider theme={theme}>
        {!this.state.user && (
          <img
            alt="Google Login"
            onClick={this.triggerGoogleLogin}
            src={GoogleLogin}
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
          <Accordion
            expanded={this.state.optionsExpanded}
            onChange={this.handleOptionExpansion}
          >
            <AccordionSummary>
              <Typography>Please choose your options...</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                <div className="filter__item">
                  <select
                    id="background"
                    onChange={this.change}
                    value={this.state.background}
                  >
                    <option key="0" value="0">
                      -- Please choose a background --
                    </option>
                    {this.state.user !== undefined &&
                      (this.state.user.email === "freakpants@gmail.com" ||
                        this.state.user.email === "gisalegendyt@gmail.com") && (
                        <option key="-1" value="gisalegend">
                          GISALEGEND
                        </option>
                      )}
                    <option value="generic">Generic Fifa 23</option>
                    <option value="heroes">Heroes</option>
                    <option value="icon">Icon</option>
                    <option value="otw">OTW</option>
                    <option value="rulebreakers">Rulebreakers</option>
                    <option value="totw">TOTW</option>
                    <option value="uefa">UEFA</option>
                    <option value="oop">Out of Packs</option>
                  </select>
                  <label htmlFor="background">Background</label>
                </div>
                <div className="filter__item">
                  <select
                    id="promo"
                    onChange={this.handleSingleSelect}
                    name="promo"
                    value={this.state.promo}
                    multiple={false}
                  >
                    <option key="0" value="0">
                      -- Please choose a promo --
                    </option>
                    <option key="1" value="totw15">
                      TOTW 1 - 5
                    </option>
                    <option value="totw6">TOTW 6</option>
                  </select>
                  <label htmlFor="promo">Promo</label>
                </div>
                <div className="filter__item">
                  <select
                    id="orderby"
                    name="orderby"
                    onChange={this.handleInputChange}
                    value={this.state.orderby}
                  >
                    <option value="rating">Rating</option>
                    <option value="console_price">Price on Consoles</option>
                  </select>
                  <label htmlFor="orderby">Order by</label>
                </div>
                <div className="filter__item">
                  <input
                    name="title"
                    id="title"
                    onChange={this.handleInputChange}
                    value={this.state.title}
                    placeholder="Title"
                  />
                  <label htmlFor="title">Title</label>
                </div>
                <div className="filter__item">
                  <input
                    name="emphasis"
                    id="emphasis"
                    onChange={this.handleInputChange}
                    value={this.state.emphasis}
                    placeholder="Emphasis"
                  />
                  <label htmlFor="emphasis">Emphasis</label>
                </div>

                <div className="filter__item">
                  <input
                    type="number"
                    max="126"
                    name="limit"
                    id="limit"
                    onChange={this.handleInputChange}
                    value={this.state.limit}
                    placeholder="Limit"
                  />
                  <label htmlFor="limit">Amount of Cards</label>
                </div>
                <div className="filter__item">
                  <input
                    type="number"
                    name="scale"
                    id="scale"
                    value={this.state.scale}
                    placeholder="Scale"
                    disabled={true}
                  />
                  <label htmlFor="scale">Scale</label>
                </div>

                <div className="filter__item">
                  <input
                    type="number"
                    name="min_rating"
                    id="min_rating"
                    min="0"
                    max="99"
                    onChange={this.handleInputChange}
                    value={this.state.min_rating}
                    placeholder="Min Rating"
                  />
                  <label htmlFor="min_rating">Min Rating</label>
                </div>
                <div className="filter__item">
                  <input
                    type="number"
                    name="max_rating"
                    id="max_rating"
                    min="0"
                    max="99"
                    onChange={this.handleInputChange}
                    value={this.state.max_rating}
                    placeholder="Max Rating"
                  />
                  <label htmlFor="max_rating">Max Rating</label>
                </div>
                <div className="filter__item">
                  {this.state.rarities.length > 0 && (
                    <Select
                      onChange={this.handleReactSelect}
                      options={rarityOptions}
                      isMulti={true}
                      styles={customStyles}
                    />
                  )}
                  <label htmlFor="rarity">Card Types</label>
                </div>
                <div className="filter__checkboxes">
                  <div className="filter__item checkbox">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.insta}
                          name="insta"
                          id="prices"
                          onChange={this.handleCheckboxChange}
                        />
                      }
                      label="Instagram Format"
                    />
                  </div>

                  <div className="filter__item checkbox">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.prices}
                          name="prices"
                          id="prices"
                          onChange={this.handleCheckboxChange}
                        />
                      }
                      label="Show prices on graphic"
                    />
                  </div>
                  <div className="filter__item checkbox">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.counter}
                          name="counter"
                          id="counter"
                          onChange={this.handleCheckboxChange}
                        />
                      }
                      label="Show counter on graphic"
                    />
                  </div>
                  <div className="filter__item checkbox">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.packable}
                          name="packable"
                          id="packable"
                          onChange={this.handleCheckboxChange}
                        />
                      }
                      label="Exclude SBC's/Objectives"
                    />
                  </div>
                </div>

                <div>
                  {this.state.possibleCardCount} Cards fulfill the conditions
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
