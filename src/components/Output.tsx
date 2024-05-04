import { Component, h } from "preact";
import "./Output.css";

//----------------------------------------------------------------------------------------------------------------------
// Properties and state
//----------------------------------------------------------------------------------------------------------------------

export const ENCRYPTED = "encrypted";
export const DECRYPTED = "decrypted";
export type OutputType = typeof ENCRYPTED | typeof DECRYPTED;

export interface OutputProps {
    readonly output: string;
    readonly type: OutputType;
}

//----------------------------------------------------------------------------------------------------------------------
// Component
//----------------------------------------------------------------------------------------------------------------------

export class Output extends Component<OutputProps, never> {
    //------------------------------------------------------------------------------------------------------------------
    // Render
    //------------------------------------------------------------------------------------------------------------------

    render() {
        return this.props.type === ENCRYPTED ? this.renderEncryptedOutput() : this.renderDecryptedOutput();
    }

    renderEncryptedOutput() {
        return (
            <div class="Output">
                <div>Encrypted</div>
                <div class="encrypted">{this.renderOutputAsParagraph()}</div>
            </div>
        );
    }

    renderDecryptedOutput() {
        return (
            <div class="Output">
                <div>Decrypted</div>
                <div>{this.renderOutputAsParagraph()}</div>
            </div>
        );
    }

    renderOutputAsParagraph() {
        return this.props.output.split(/\r?\n/).map(line => (
            <span>
                {line}
                <br />
            </span>
        ));
    }

    renderOutputAsTextArea() {
        return <textarea readOnly={true} value={this.props.output} rows={this.props.output.split(/\n/).length} />;
    }
}
