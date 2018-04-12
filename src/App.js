import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from 'material-ui/AppBar';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import Slider from 'material-ui/Slider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import "./style.css"

const styles = {
    red: {
        backgroundColor: "#FF0000"
    },
    blue: {
        backgroundColor: "#0000FF"
    },
    green: {
        backgroundColor: "#00FF00"
    },
    magenta: {
        backgroundColor: "#FF00FF"
    },
    cyan: {
        backgroundColor: "#00FFFF"
    },
    yellow: {
        backgroundColor: "#FFFF00"
    },
};

class App extends Component {

    constructor(props) {
        
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.storeForUndo = this.storeForUndo.bind(this);
        this.buildHistoryEntry = this.buildHistoryEntry.bind(this);
        this.restoreHistoryEntry = this.restoreHistoryEntry.bind(this);
        this.undo = this.undo.bind(this);

        this.state = {
            //Select fields value.
            color: "red",
            //The current hex code.
            hex: "#FF0000",
            //RGB's red.
            red: 255,
            //RGB's green.
            green: 0,
            //RGB's blue.
            blue: 0,
            //List of added/saved colors.
            addedColors: [],
            //Keys for the saved colors.
            key: 0,
            //History for undo.
            history: [],
            //Future for redo.
            future: [],
        };
    }
	/**
	  * This function enable select field's functionality.
	  * Changes color name and hex color, which in turn
      * changes the box color and hed display's value.
	  */   
    handleNameChange = (event, index, value) => {
        this.sliderSetter(value);
        this.setState(() => {
            return {
                color: value,
                hex: styles[value].backgroundColor,
            };
        });
    }
	/**
	  * This function sets the sliders when the select field color changes.
	  * For example, if user picks Yellow, the sliders are set to 255, 255, 0.
	  */    
    sliderSetter = (color) => {
        let r = 0
        let g = 0
        let b = 0
        if(color === "red") {
            r = 255;
        }
        if(color === "green") {
            g = 255;
        }
        if(color === "blue") {
            b = 255;
        }
        if(color === "magenta") {
            r = 255;
            b = 255;
        }
        if(color === "cyan") {
            g = 255;
            b = 255
        }
        if(color === "yellow") {
            r = 255;
            g = 255;
        }
        this.storeForUndo();
        this.setState(() => {
            return {
                red: r,
                green: g,
                blue: b
            };
        });
    }
	/**
	  * These functions work similarly, but each main color has its own function.
	  * A function is triggered when a color slider is altered.
      * Alters the state of the color, which change's color boxes color and hex display.
	  */
    handleRed = (event, value) => {
        //Converts the new hex value from the rgb code.
        const newHex = "#" + this.rgbToHex(value, this.state.green, this.state.blue);
        //Saves the previous state.
        this.storeForUndo();
        //Update the states and render components.
        this.setState(() => {
            return {
                red: value,
                hex: newHex,
            }
        });
    }
    handleGreen = (event, value) => {
        //Converts the new hex value from the rgb code.
        const newHex = "#" + this.rgbToHex(this.state.red, value, this.state.blue);
        this.storeForUndo();
        this.setState(() => {
            return {
                green: value,
                hex: newHex,
            }
        });
    }
    handleBlue = (event, value) => {
        const newHex = "#" + this.rgbToHex(this.state.red, this.state.green, value);
        this.storeForUndo();
        this.setState(() => {
            return {
                blue: value,
                hex: newHex,
            }
        });
    }

	/**
	  * Converts a single rgb value to hex code.
	  * For example 255 -> "FF"
	  */
    toHex = (n) => {
        n = parseInt(n,10);
        if (isNaN(n)) return "00";
        n = Math.max(0,Math.min(n,255));
        return "0123456789ABCDEF".charAt((n-n%16)/16)
      + "0123456789ABCDEF".charAt(n%16);
    }
	/**
	  * Converts a whole rgb code to hex code. 
	  * For example 255,0,255 -> "#FF00FF"
	  */
    rgbToHex = (R,G,B) => {
        return this.toHex(R)+this.toHex(G)+this.toHex(B)
    }

	/**
	  * This function adds new color object to the addedColors array,
	  * which in turn will be rendered as a new saved color.
	  */
    handleAdd = () => {
        //Save previous state for history.
        this.storeForUndo();
        this.state.addedColors.push(
            {
                name: this.state.color,
                hex: this.state.hex,
                key: this.state.key,
            }
        );
        //Update key's value to enable uniqueness and to render color boxes.
        this.setState((prevState) => {
            return {
                key: prevState.key + 1
            };
        });
    }

	/**
	  * This function builds entries which go to
	  * history/future (added after the lecture)
	  */
     buildHistoryEntry = () => {
        return {
			r: this.state.red,
			g: this.state.green,
            b: this.state.blue,
            h: this.state.hex,
            ac: this.state.addedColors.slice(),
        }
    }
	/**
	  * This function put infor from a history entry
	  * to the state (added after the lecture).
	  */
    restoreHistoryEntry = (entry) => {
        this.setState(() => {
            return {
                red: entry.r,
                green: entry.g,
                blue: entry.b,
                hex: entry.h,
                addedColors: entry.ac,
            };
		});
	}
    /**
	  * This stores current state information to history so that "undo" 
	  * functionality can work.
	  */
	storeForUndo = () => {
		this.setState({
			history: this.state.history.concat([this.buildHistoryEntry()]),
			future: []
        });
    }
    /**
	  * Undo function for undoing action.
	  * 
	  */
    undo = () => {
		if (this.state.history.length > 0) {
            //Get the last action and remove it from the history.
            const c = this.state.history.pop();
            //Assign the new array tail for the new previous history.
            //This enables multiple undos.
            const h = this.state.history; // pop already removed the last entry in previous line
            //Add the acttion before undo to the  future array, this enables redo after undo.
            const f = this.state.future.concat([this.buildHistoryEntry()]);
            //Set the previous states and render.
            this.restoreHistoryEntry(c);
			this.setState({
				history: h,
				future: f
			});
        }
	}
	redo = () => {
		if (this.state.future.length > 0) {
			const h = this.state.history.concat([this.buildHistoryEntry()]);
			const c = this.state.future.pop();
			const f = this.state.future; // pop already removed the last entry in previous line
			this.restoreHistoryEntry(c);
			this.setState({
				history: h,
				future: f
			});
		}
	}

	render() {
        let boxColor = {backgroundColor: this.state.hex}
		return (
			<MuiThemeProvider>
				<div className="App">
					<AppBar title="Exercise 4.4"></AppBar>
                    
                    <div className="divMargins">

                        <SelectField
                            floatingLabelText="Color"
                            value={this.state.color}
                            onChange={this.handleNameChange}
                            className="il"
                        >
                            <MenuItem value={"red"} primaryText="Red" />
                            <MenuItem value={"green"} primaryText="Green" />
                            <MenuItem value={"blue"} primaryText="Blue" />
                            <MenuItem value={"magenta"} primaryText="Magenta" />
                            <MenuItem value={"cyan"} primaryText="Cyan" />
                            <MenuItem value={"yellow"} primaryText="Yellow" />
                        </SelectField>

                        <RaisedButton 
                            label="UNDO" 
                            primary={true} 
                            className="divMargins"
                            onClick={this.undo}
                            disabled={this.state.history.length === 0}
                        />
                        <RaisedButton 
                            label="REDO" 
                            primary={true} 
                            className="divMargins"
                            onClick={this.redo}
                            disabled={this.state.future.length === 0}
                        />

                    </div>
                    <div style={{maxWidth: 960}}>

                        <div className="root">
                            <Slider 
                                style={{height: 100}} 
                                axis="y" 
                                min={0}
                                max={255}
                                step={1} 
                                defaultValue={255}
                                onChange={this.handleRed}
                                value={this.state.red}
                            />
                            <Slider 
                                style={{height: 100}} 
                                axis="y" 
                                min={0}
                                max={255}
                                step={1} 
                                defaultValue={0}
                                onChange={this.handleGreen}
                                value={this.state.green}
                            />
                            <Slider 
                                style={{height: 100}} 
                                axis="y" 
                                min={0}
                                max={255}
                                step={1} 
                                defaultValue={0}
                                onChange={this.handleBlue}
                                value={this.state.blue}
                            />
                            <Paper className="paperStyle" style={boxColor} zDepth={1} />
                            <TextField value={this.state.hex} id="hexDisplay"/>                  
                        </div>

                        <RaisedButton 
                            label="ADD TO LIST" 
                            primary={true} 
                            className="divMargins"
                            onClick={this.handleAdd}
                        />

                        <div className="gridRoot">
                            <GridList
                                cellHeight={180}
                                className="gridList"
                            >
                                <Subheader>Added colors:</Subheader>
                                {this.state.addedColors.map((color) => (
                                    <GridTile
                                        key={color.key}
                                        title={color.name}
                                        subtitle={<span><b>{color.hex}</b></span>}
                                        style={{backgroundColor: color.hex}}
                                    >
                                    </GridTile>
                                ))}
                            </GridList>
                        </div>

                    </div>
				</div>
			</MuiThemeProvider>
		);
	}
}

export default App;