import { Component, h } from "preact";

import "./Input.css";

//----------------------------------------------------------------------------------------------------------------------
// Properties and state
//----------------------------------------------------------------------------------------------------------------------

export interface InputProps {
    readonly onChange: (newValue: string) => void;
}

//----------------------------------------------------------------------------------------------------------------------
// Component
//----------------------------------------------------------------------------------------------------------------------

export class Input extends Component<InputProps, never> {
    private previousValue = "";
    private textArea: HTMLTextAreaElement | undefined;

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
            <div class="Input">
                <div>Plain text or encrypted data</div>
                <div>
                    <textarea
                        onInput={this.onChange}
                        ref={(element: HTMLTextAreaElement | null) => (this.textArea = element ?? undefined)}
                    />
                </div>
            </div>
        );
    }

    //------------------------------------------------------------------------------------------------------------------
    // API
    //------------------------------------------------------------------------------------------------------------------

    setContent(content: string) {
        const textArea = this.textArea;
        if (textArea) {
            textArea.value = content;
            this.props.onChange(content);
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Event handlers
    //------------------------------------------------------------------------------------------------------------------

    onChange(event: InputEvent) {
        const currentValue = (event.target as HTMLTextAreaElement).value;
        if (currentValue !== this.previousValue) {
            this.props.onChange(currentValue);
            this.previousValue = currentValue;
        }
    }
}
