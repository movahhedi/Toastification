import type Lestin from "lestin/jsx-runtime";

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
export const ToastTypeData = {
	/**
	 * Data for a successful toast.
	 */
	Successful: {
		Classname: "Success",
		Text: "Operation successful",
		Color: "#47B35F",
	},

	/**
	 * Data for an error toast.
	 */
	Error: {
		Classname: "Error",
		Text: "An error occurred",
		Color: "#47B35F",
	},

	/**
	 * Data for an informational toast.
	 */
	Info: {
		Classname: "Info",
		Text: "Processing...",
		Color: "#47B35F",
	},
};

/**
 * An interface representing the properties that can be passed to a Toast instance to customize its appearance and behavior.
 */
export interface Toast_Props {
	/**
	 * How long to wait before automatically dismissing the toast (in milliseconds).
	 */
	Duration?: number;

	/**
	 * The background color of the toast.
	 */
	BackColor?: string;

	/**
	 * The title to display in the toast.
	 */
	Title?: string;

	/**
	 * Whether the toast should be pinned or not.
	 */
	IsPinned?: boolean;

	/**
	 * Whether to hide the pin button or not.
	 */
	NoPin?: boolean;

	/**
	 * Whether to hide the dismiss button or not.
	 */
	NoDismiss?: boolean;

	/**
	 * The text alignment of the toast text.
	 */
	TextAlign?: "start" | "end" | "center";

	/**
	 * The font size of the toast text.
	 */
	TextSize?: string;

	/**
	 * The font weight of the toast text.
	 */
	TextWeight?: string;

	/**
	 * The text alignment of the toast title.
	 */
	TitleAlign?: "start" | "end" | "center";

	/**
	 * The font size of the toast title.
	 */
	TitleSize?: string;

	/**
	 * The font weight of the toast title.
	 */
	TitleWeight?: string;

	/**
	 * An array of buttons to display in the toast.
	 */
	Buttons?: ToastButton_Props[];
}

/**
 * Default properties for a Toast instance.
 */
const Toast_DefaultProps: Toast_Props = {
	Duration: 5000,
};

/**
 * An interface representing the properties of a button in a toast.
 */
interface ToastButton_Props {
	/**
	 * The text to display on the button.
	 */
	Text: string;

	/**
	 * The CSS class to apply to the button.
	 */
	Style?: string;

	/**
	 * The function to call when the button is clicked.
	 */
	OnClick: Lestin.MouseEventHandler<HTMLButtonElement>;
}

/**
 * A class representing a toast notification.
 */
export class Toast {
	/**
	 * The HTML element representing the toast.
	 */
	public readonly ToastElement: HTMLElement;

	/**
	 * The current percentage of the progress bar.
	 */
	public CurrentPercent: number | null = null;
	private _ToastInterval: number | null | any = null;
	private _ToastTextElement: HTMLElement | null = null;
	private _ToastProgressBar_Value_Element: HTMLElement | null = null;
	private _ToastAction_Pin_Element: HTMLElement | null = null;
	private _ToastInitialOptions = null;

	private _IsPinned: boolean = false;
	/**
	 * Whether the toast is pinned or not.
	 */
	get IsPinned(): boolean {
		return this._IsPinned;
	}

	/**
	 * Creates a new Toast instance.
	 *
	 * @param {ToastType} [myToastType=ToastType.Info] - The type of toast to create.
	 * @param {string} [myToastText=""] - The text to display in the toast.
	 * @param {Toast_Props} [Options={}] - An object containing options for customizing the appearance and behavior of the toast.
	 */
	constructor(myToastType: ToastType = ToastType.Info, myToastText: string = "", Options: Toast_Props = {}) {
		Options = { ...Toast_DefaultProps, ...Options };

		let myToastTypeSpecs = ToastTypeData.Info;
		if (myToastType == ToastType.Successful) myToastTypeSpecs = ToastTypeData.Successful;
		else if (myToastType == ToastType.Error) myToastTypeSpecs = ToastTypeData.Error;

		if (!myToastText) myToastText = myToastTypeSpecs.Text;

		this._IsPinned = Options.IsPinned || Options.Duration === -1;

		let HasActionBox = !(Options.NoPin && Options.NoDismiss);
		let IsUserPinable = !(Options.NoPin || this._IsPinned);
		let IsUserDismissable = !Options.NoDismiss;

		this._ToastInitialOptions = Options;

		this._ToastTextElement = <></>;
		if (myToastText) {
			this._ToastTextElement = (
				<p
					class="Toast-Text"
					style={{
						...(Options.TextAlign ? { textAlign: Options.TextAlign } : {}),
						...(Options.TextSize ? { fontSize: Options.TextSize } : {}),
						...(Options.TextWeight ? { fontWeight: Options.TextWeight } : {}),
					}}
				>
					{myToastText}
				</p>
			);
		}
		this._ToastProgressBar_Value_Element = <div class="Toast-ProgressBar-Value"></div>;

		if (IsUserPinable)
			this._ToastAction_Pin_Element = (
				<button class="Toast-Action Pin" onClick={() => this.Pin()}>
					<i class="fas fa-thumbtack"></i>
				</button>
			);

		this.ToastElement = (
			<div class={"Toast " + myToastTypeSpecs.Classname}>
				{HasActionBox && (
					<div class="Toast-ActionBox">
						{IsUserPinable && this._ToastAction_Pin_Element}
						{IsUserDismissable && (
							<button class={"Toast-Action Dismiss"} onClick={() => this.Dismiss()}>
								<i class="fas fa-times"></i>
							</button>
						)}
					</div>
				)}

				<div class="Toast-Content">
					{Options.Title && (
						<h5
							class="Toast-Title"
							style={{
								...(Options.TitleAlign ? { textAlign: Options.TitleAlign } : {}),
								...(Options.TitleSize ? { fontSize: Options.TitleSize } : {}),
								...(Options.TitleWeight ? { fontWeight: Options.TitleWeight } : {}),
							}}
						>
							{Options.Title}
						</h5>
					)}
					{this._ToastTextElement}
					{Options.Buttons && (
						<div class="Toast-ButtonBox">
							{Options.Buttons?.map((i) => (
								<button class={"Toast-Button " + i.Style} onClick={i.OnClick}>
									{i.Text}
								</button>
							))}
						</div>
					)}

					<div class="Toast-ProgressBar">{this._ToastProgressBar_Value_Element}</div>
				</div>
			</div>
		);

		if (!this._IsPinned) {
			this.SetInterval(Options.Duration);
		}

		return this;
	}

	/**
	 * Pins the toast so that it does not automatically dismiss.
	 *
	 * @param {number} [Percent=0] - The percentage of the progress bar to fill.
	 * @returns {Toast} - The Toast instance.
	 */
	Pin(Percent: number = 0): Toast {
		this._IsPinned = true;
		if (this._ToastInterval) clearInterval(this._ToastInterval);
		if (this._ToastAction_Pin_Element) this._ToastAction_Pin_Element.remove();
		this._ToastProgressBar_Value_Element.style.width = Percent + "%";
		return this;
	}

	/**
	 * Sets the text of the toast.
	 *
	 * @param {string} [Text=""] - The new text to display in the toast.
	 * @returns {Toast} - The Toast instance.
	 */
	SetText(Text: string = ""): Toast {
		this._ToastTextElement.textContent = Text;
		return this;
	}

	/**
	 * Dismisses the toast.
	 *
	 * @param {number} [TimeInMs=0] - How long to wait before dismissing the toast (in milliseconds).
	 * @returns {number} - The ID of the timeout that was set.
	 */
	Dismiss(TimeInMs: number = 0): number | any {
		if (this._ToastInterval) clearInterval(this._ToastInterval);
		return setTimeout(() => {
			requestAnimationFrame(() => {
				this.ToastElement.style.height = this.ToastElement.scrollHeight + "px";
				requestAnimationFrame(() => {
					this.ToastElement.classList.add("Bye");
					this.ToastElement.style.height = "0";
					this.ToastElement.style.margin = "0";
					setTimeout(() => this.ToastElement.remove(), 500);
				});
			});
		}, TimeInMs);
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
	 * @param {number} [DurationMS=5000] - How long to wait before dismissing the toast (in milliseconds).
	 * @param {number} [InitialPercent=0] - The initial percentage of the progress bar to fill.
	 * @returns {Toast} - The Toast instance.
	 */
	SetInterval(DurationMS: number = 5000, InitialPercent: number = 0): Toast {
		this._IsPinned = false;
		if (this._ToastInterval) clearInterval(this._ToastInterval);
		// ToastProgressBar.style.display = "block";
		this.CurrentPercent = InitialPercent;

		this._ToastInterval = setInterval(() => {
			if (this.CurrentPercent >= 100) {
				clearInterval(this._ToastInterval);
				this.Dismiss();
			} else {
				this.CurrentPercent++;
				this._ToastProgressBar_Value_Element.style.width = this.CurrentPercent + "%";
			}
		}, (DurationMS - 200) / 100);

		if (!this._ToastInitialOptions.NoPauseOnHover) {
			this.ToastElement.addEventListener("mouseenter", () => clearInterval(this._ToastInterval));
			this.ToastElement.addEventListener("mouseleave", () => {
				if (!this._IsPinned) {
					this.SetInterval(DurationMS, this.CurrentPercent);
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
		this.ToastElement.innerHTML = content;
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
 * @param {Toast_Props} [Options={}] - An object containing options for customizing the appearance and behavior of the toast.
 * @returns {Toast} - The new Toast instance that was created.
 */
export function ShowToast(
	myToastType: ToastType = ToastType.Info,
	myToastText: string = "",
	Options: Toast_Props = {},
	ToastBoxParent: HTMLElement = document.body
): Toast {
	let myToast = new Toast(myToastType, myToastText, Options);

	let myToastBox = document.getElementById("ToastBox");
	if (myToastBox === null) {
		myToastBox = <ToastBox />;
		ToastBoxParent.prepend(myToastBox);
	}
	myToastBox.appendChild(myToast.ToastElement);
	return myToast;
}
