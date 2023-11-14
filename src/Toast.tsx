import type Lestin from "lestin";

/**
 * An enumeration of the different types of toasts that can be created.
 */
export enum ToastType {
	/**
	 * A toast indicating a successful operation.
	 */
	Successful = "Success",

	/**
	 * A toast indicating an error.
	 */
	Error = "Error",

	/**
	 * A toast providing information.
	 */
	Info = "Info",
}

/**
 * An object containing data for each type of toast.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const ToastTypeData: {
	[name in keyof typeof ToastType]: {
		classname: string;
		text: string;
		color: string;
	};
} = {
	/**
	 * Data for a successful toast.
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	Successful: {
		classname: "Success",
		text: "Operation successful",
		color: "#47B35F",
	},

	/**
	 * Data for an error toast.
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	Error: {
		classname: "Error",
		text: "An error occurred",
		color: "#47B35F",
	},

	/**
	 * Data for an informational toast.
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	Info: {
		classname: "Info",
		text: "Processing...",
		color: "#47B35F",
	},
};

/**
 * An interface representing the properties that can be passed to a Toast instance to customize its appearance and behavior.
 */
export interface IToast_Props {
	/**
	 * How long to wait before automatically dismissing the toast (in milliseconds).
	 */
	duration?: number;

	/**
	 * The background color of the toast.
	 */
	backColor?: string;

	/**
	 * The title to display in the toast.
	 */
	title?: string;

	/**
	 * Whether the toast should be pinned or not.
	 */
	isPinned?: boolean;

	/**
	 * Whether to hide the pin button or not.
	 */
	noPin?: boolean;

	/**
	 * Whether to hide the dismiss button or not.
	 */
	noDismiss?: boolean;

	/**
	 * The text alignment of the toast text.
	 */
	textAlign?: "start" | "end" | "center";

	/**
	 * The font size of the toast text.
	 */
	textSize?: string;

	/**
	 * The font weight of the toast text.
	 */
	textWeight?: string;

	/**
	 * The text alignment of the toast title.
	 */
	titleAlign?: "start" | "end" | "center";

	/**
	 * The font size of the toast title.
	 */
	titleSize?: string;

	/**
	 * The font weight of the toast title.
	 */
	titleWeight?: string;

	/**
	 * An array of buttons to display in the toast.
	 */
	buttons?: IToastButton_Props[];
}

/**
 * Default properties for a Toast instance.
 */
const toast_DefaultProps: IToast_Props = {
	duration: 5000,
};

/**
 * An interface representing the properties of a button in a toast.
 */
interface IToastButton_Props {
	/**
	 * The text to display on the button.
	 */
	text: string;

	/**
	 * The CSS class to apply to the button.
	 */
	style?: string;

	/**
	 * The function to call when the button is clicked.
	 */
	onClick: Lestin.MouseEventHandler<HTMLButtonElement>;
}

/**
 * A class representing a toast notification.
 */
export class Toast {
	/**
	 * The HTML element representing the toast.
	 */
	public readonly toastElement: HTMLElement;

	/**
	 * The current percentage of the progress bar.
	 */
	public currentPercent: number | null = null;
	private _toastInterval: number | null | any = null;
	private _toastTextElement: HTMLElement | null = null;
	private _toastProgressBarValueElement: HTMLElement | null = null;
	private _toastActionPinElement: HTMLElement | null = null;
	private _toastInitialOptions = null;

	private _isPinned: boolean = false;
	/**
	 * Whether the toast is pinned or not.
	 */
	get isPinned(): boolean {
		return this._isPinned;
	}

	/**
	 * Creates a new Toast instance.
	 *
	 * @param {ToastType} [myToastType=ToastType.Info] - The type of toast to create.
	 * @param {string} [myToastText=""] - The text to display in the toast.
	 * @param {IToast_Props} [options={}] - An object containing options for customizing the appearance and behavior of the toast.
	 */
	constructor(myToastType: ToastType = ToastType.Info, myToastText: string = "", options: IToast_Props = {}) {
		options = { ...toast_DefaultProps, ...options };

		let myToastTypeSpecs = ToastTypeData.Info;
		if (myToastType == ToastType.Successful) myToastTypeSpecs = ToastTypeData.Successful;
		else if (myToastType == ToastType.Error) myToastTypeSpecs = ToastTypeData.Error;

		if (!myToastText) myToastText = myToastTypeSpecs.text;

		this._isPinned = options.isPinned || options.duration === -1;

		const hasActionBox = !(options.noPin && options.noDismiss);
		const isUserPinable = !(options.noPin || this._isPinned);
		const isUserDismissable = !options.noDismiss;

		this._toastInitialOptions = options;

		this._toastTextElement = <></>;
		if (myToastText) {
			this._toastTextElement = (
				<p
					class="Toast-Text"
					style={{
						...(options.textAlign ? { textAlign: options.textAlign } : {}),
						...(options.textSize ? { fontSize: options.textSize } : {}),
						...(options.textWeight ? { fontWeight: options.textWeight } : {}),
					}}
				>
					{myToastText}
				</p>
			);
		}
		this._toastProgressBarValueElement = <div class="Toast-ProgressBar-Value"></div>;

		if (isUserPinable)
			this._toastActionPinElement = (
				<button class="Toast-Action Pin" onClick={() => this.Pin()}>
					<i class="fas fa-thumbtack"></i>
				</button>
			);

		this.toastElement = (
			<div class={"Toast " + myToastTypeSpecs.classname}>
				{hasActionBox && (
					<div class="Toast-ActionBox">
						{isUserPinable && this._toastActionPinElement}
						{isUserDismissable && (
							<button class={"Toast-Action Dismiss"} onClick={() => this.Dismiss()}>
								<i class="fas fa-times"></i>
							</button>
						)}
					</div>
				)}

				<div class="Toast-Content">
					{options.title && (
						<h5
							class="Toast-Title"
							style={{
								...(options.titleAlign ? { textAlign: options.titleAlign } : {}),
								...(options.titleSize ? { fontSize: options.titleSize } : {}),
								...(options.titleWeight ? { fontWeight: options.titleWeight } : {}),
							}}
						>
							{options.title}
						</h5>
					)}
					{this._toastTextElement}
					{options.buttons && (
						<div class="Toast-ButtonBox">
							{options.buttons?.map((i) => (
								<button class={"Toast-Button " + i.style} onClick={i.onClick}>
									{i.text}
								</button>
							))}
						</div>
					)}

					<div class="Toast-ProgressBar">{this._toastProgressBarValueElement}</div>
				</div>
			</div>
		);

		if (!this._isPinned) {
			this.SetInterval(options.duration);
		}

		return this;
	}

	/**
	 * Pins the toast so that it does not automatically dismiss.
	 *
	 * @param {number} [percent=0] - The percentage of the progress bar to fill.
	 * @returns {Toast} - The Toast instance.
	 */
	Pin(percent: number = 0): Toast {
		this._isPinned = true;
		if (this._toastInterval) clearInterval(this._toastInterval);
		if (this._toastActionPinElement) this._toastActionPinElement.remove();
		this._toastProgressBarValueElement.style.width = percent + "%";
		return this;
	}

	/**
	 * Sets the text of the toast.
	 *
	 * @param {string} [text=""] - The new text to display in the toast.
	 * @returns {Toast} - The Toast instance.
	 */
	SetText(text: string = ""): Toast {
		this._toastTextElement.textContent = text;
		return this;
	}

	/**
	 * Dismisses the toast.
	 *
	 * @param {number} [timeMs=0] - How long to wait before dismissing the toast (in milliseconds).
	 * @returns {number} - The ID of the timeout that was set.
	 */
	Dismiss(timeMs: number = 0): number | any {
		if (this._toastInterval) clearInterval(this._toastInterval);
		return setTimeout(() => {
			requestAnimationFrame(() => {
				this.toastElement.style.height = this.toastElement.scrollHeight + "px";
				requestAnimationFrame(() => {
					this.toastElement.classList.add("Bye");
					this.toastElement.style.height = "0";
					this.toastElement.style.margin = "0";
					setTimeout(() => this.toastElement.remove(), 500);
				});
			});
		}, timeMs);
	}

	/**
	 * Sets the percentage of the progress bar to fill.
	 *
	 * @param {number} [percentage=0] - The new percentage to fill the progress bar with.
	 * @returns {Toast} - The Toast instance.
	 */
	SetPercent(percentage: number = 0): Toast {
		return this.Pin(percentage);
	}

	/**
	 * Sets an interval for automatically dismissing the toast.
	 *
	 * @param {number} [durationMs=5000] - How long to wait before dismissing the toast (in milliseconds).
	 * @param {number} [initialPercent=0] - The initial percentage of the progress bar to fill.
	 * @returns {Toast} - The Toast instance.
	 */
	SetInterval(durationMs: number = 5000, initialPercent: number = 0): Toast {
		this._isPinned = false;
		if (this._toastInterval) clearInterval(this._toastInterval);
		// ToastProgressBar.style.display = "block";
		this.currentPercent = initialPercent;

		this._toastInterval = setInterval(
			() => {
				if (this.currentPercent >= 100) {
					clearInterval(this._toastInterval);
					this.Dismiss();
				} else {
					this.currentPercent++;
					this._toastProgressBarValueElement.style.width = this.currentPercent + "%";
				}
			},
			(durationMs - 200) / 100,
		);

		if (!this._toastInitialOptions.NoPauseOnHover) {
			this.toastElement.addEventListener("mouseenter", () => clearInterval(this._toastInterval));
			this.toastElement.addEventListener("mouseleave", () => {
				if (!this._isPinned) {
					this.SetInterval(durationMs, this.currentPercent);
				}
			});
		}
		return this;
	}

	/**
	 * Sets the inner HTML content of the toast element.
	 *
	 * @param {string} content - The new HTML content to set.
	 */
	set innerHTML(content: string) {
		this.toastElement.innerHTML = content;
	}
}

/**
 * A function component that returns a `ToastBox` element.
 *
 * @returns {HTMLDivElement} - A `ToastBox` element.
 */
export const ToastBox = (): HTMLDivElement => (<div id="ToastBox"></div>) as HTMLDivElement;

/**
 * Creates and displays a new toast notification.
 *
 * @param {ToastType} [myToastType=ToastType.Info] - The type of toast to create.
 * @param {string} [myToastText=""] - The text to display in the toast.
 * @param {IToast_Props} [options={}] - An object containing options for customizing the appearance and behavior of the toast.
 * @returns {Toast} - The new Toast instance that was created.
 */
// eslint-disable-next-line max-params
export function ShowToast(
	myToastType: ToastType = ToastType.Info,
	myToastText: string = "",
	options: IToast_Props = {},
	toastBoxParent: HTMLElement = document.body,
): Toast {
	const myToast = new Toast(myToastType, myToastText, options);

	let myToastBox = document.getElementById("ToastBox");
	if (myToastBox === null) {
		myToastBox = <ToastBox />;
		toastBoxParent.prepend(myToastBox);
	}
	myToastBox.appendChild(myToast.toastElement);
	return myToast;
}
