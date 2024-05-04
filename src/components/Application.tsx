import "./Application.css";

import { Component, h } from "preact";
import { decrypt, encrypt } from "../utils/web-crypto-api.js";
import { Header } from "./Header.js";
import { Input } from "./Input.js";
import { DECRYPTED, ENCRYPTED, Output, OutputType } from "./Output.js";
import { PasswordField } from "./PasswordField.js";

//----------------------------------------------------------------------------------------------------------------------
// Properties and state
//----------------------------------------------------------------------------------------------------------------------

export interface ApplicationProps {}

interface ApplicationState {
    readonly password: string;
    readonly input: string;
    readonly output:
        | undefined
        | {
              readonly data: string;
              readonly type: OutputType;
          };
}

//----------------------------------------------------------------------------------------------------------------------
// Component
//----------------------------------------------------------------------------------------------------------------------

export class Application extends Component<ApplicationProps, ApplicationState> {
    private passwordField?: PasswordField;

    //------------------------------------------------------------------------------------------------------------------
    // Initialization
    //------------------------------------------------------------------------------------------------------------------

    public constructor(props: ApplicationProps) {
        super(props);
        this.state = { password: "", input: "", output: undefined };
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onInputChanged = this.onInputChanged.bind(this);
        this.recalculate = this.recalculate.bind(this);
    }

    render() {
        return (
            <div class="Application">
                <Header />
                <Input onChange={this.onInputChanged} />
                <PasswordField
                    onChange={this.onPasswordChange}
                    ref={(passwordField: PasswordField) => (this.passwordField = passwordField)}
                />
                {this.renderOutput()}
            </div>
        );
    }

    renderOutput() {
        if (this.state.output) {
            return <Output type={this.state.output.type} output={this.state.output.data}></Output>;
        } else if (this.state.input && this.state.password) {
            return <div>Calculating...</div>;
        } else {
            return false;
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Event handlers
    //------------------------------------------------------------------------------------------------------------------

    override componentDidMount() {
        this.passwordField?.focus();
    }

    onPasswordChange(password: string) {
        this.setState({ ...this.state, password: password.trim() }, this.recalculate);
    }

    onInputChanged(content: string) {
        this.setState({ ...this.state, input: content }, this.recalculate);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Internal functions
    //------------------------------------------------------------------------------------------------------------------

    private async recalculate() {
        const [input, password] = [this.state.input, this.state.password];
        this.setEmptyOutput(input, password, async () => {
            if (password && this.state.input) {
                const decrypted = await decrypt(this.state.password, this.state.input);
                if (decrypted) {
                    return this.setDecryptedOutput(input, password, decrypted);
                }
                const encrypted = await encrypt(this.state.password, this.state.input);
                if (encrypted) {
                    this.setEncryptedOutput(input, password, encrypted);
                }
            }
        });
    }

    private setEmptyOutput(input: string, password: string, then?: () => void) {
        if (input === this.state.input && password === this.state.password) {
            this.setState({ ...this.state, output: undefined }, then);
        }
    }

    private setEncryptedOutput(input: string, password: string, output: string) {
        if (input === this.state.input && password === this.state.password) {
            this.setState({ ...this.state, output: { data: output, type: ENCRYPTED } });
        }
    }
    private setDecryptedOutput(input: string, password: string, output: string) {
        if (input === this.state.input && password === this.state.password) {
            this.setState({ ...this.state, output: { data: output, type: DECRYPTED } });
        }
    }
}
