import { Component, h } from "preact";

import "./PasswordField.css";

//----------------------------------------------------------------------------------------------------------------------
// Properties and state
//----------------------------------------------------------------------------------------------------------------------

export interface PasswordFieldProps {
    readonly onChange: (newValue: string) => void;
}

//----------------------------------------------------------------------------------------------------------------------
// Component
//----------------------------------------------------------------------------------------------------------------------

export class PasswordField extends Component<PasswordFieldProps, never> {
    private previousValue = "";
    private inputField: HTMLInputElement | null = null;

    //------------------------------------------------------------------------------------------------------------------
    // Initialization
    //------------------------------------------------------------------------------------------------------------------

    public constructor() {
        super();
        this.onChange = this.onChange.bind(this);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Render
    //------------------------------------------------------------------------------------------------------------------

    render() {
        return (
            <div class="PasswordField">
                <div>Password</div>
                <div>
                    <input
                        type="password"
                        onInput={this.onChange}
                        ref={(element: HTMLInputElement | null) => (this.inputField = element)}
                    ></input>
                </div>
                {/* <Keyboard onKeyPress={key => this.appendCharacter(key)} /> */}
            </div>
        );
    }

    //------------------------------------------------------------------------------------------------------------------
    // API
    //------------------------------------------------------------------------------------------------------------------

    focus() {
        const inputField = this.inputField;
        if (inputField) {
            inputField.focus();
            setTimeout(() => (inputField.selectionStart = inputField.selectionEnd = inputField.value.length), 0);
        }
    }

    appendCharacter(character: string) {
        const inputField = this.inputField;
        if (inputField) {
            inputField.value += character;
            this.focus();
            this.props.onChange(inputField.value);
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Event handlers
    //------------------------------------------------------------------------------------------------------------------

    onChange(event: InputEvent) {
        const currentValue = (event.target as HTMLInputElement).value.trim();
        if (currentValue !== this.previousValue) {
            this.props.onChange(currentValue);
            this.previousValue = currentValue;
        }
    }
}
