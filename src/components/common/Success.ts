import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface SuccessData {
    total: number;
}

interface SuccessActions {
    onClick?: () => void;
}

export class Success extends Component<SuccessData> {
    private closeButton: HTMLElement;
    private totalElement: HTMLElement;

    constructor(container: HTMLElement, actions: SuccessActions, value: number) {
        super(container);

        this.closeButton = ensureElement<HTMLElement>('.order-success__close', this.container);
        this.totalElement = ensureElement<HTMLElement>('.order-success__description', this.container);

        this.setupActions(actions, value);
    }

    private setupActions(actions: SuccessActions, value: number): void {
        if (actions?.onClick) {
            this.closeButton.addEventListener('click', actions.onClick);
        }
        this.updateTotalText(value);
    }

    private updateTotalText(value: number): void {
        this.totalElement.textContent = `Списано ${value} синапсов`;
    }
}
