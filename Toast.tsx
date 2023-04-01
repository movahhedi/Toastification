import type Lestin from "lestin/jsx-runtime";

export enum ToastType {
	Successful = "Success",
	Error = "Error",
	Info = "Info",
}

export const ToastTypeData = {
	Successful: {
		Classname: "Success",
		Text: "Operation successful",
		Color: "#47B35F",
	},
	Error: {
		Classname: "Error",
		Text: "An error occurred",
		Color: "#47B35F",
	},
	Info: {
		Classname: "Info",
		Text: "Processing...",
		Color: "#47B35F",
	},
};

interface Toast_Props {
	Duration?: number;
	BackColor?: string;
	Title?: string;
	IsPinned?: boolean;
	NoPin?: boolean;
	NoDismiss?: boolean;
	TextAlign?: "start" | "end" | "center";
	TextSize?: string;
	TextWeight?: string;
	TitleAlign?: "start" | "end" | "center";
	TitleSize?: string;
	TitleWeight?: string;
	Buttons?: ToastButton_Props[];
}

const Toast_DefaultProps: Toast_Props = {
	Duration: 5000,
};

interface ToastButton_Props {
	Text: string;
	Style?: string;
	OnClick: Lestin.MouseEventHandler<HTMLButtonElement>;
}

export class Toast {
	public readonly ToastElement: HTMLElement;

	public CurrentPercent: number | null = null;
	private _ToastInterval: number | null | any = null;
	private _ToastTextElement: HTMLElement | null = null;
	private _ToastProgressBar_Value_Element: HTMLElement | null = null;
	private _ToastAction_Pin_Element: HTMLElement | null = null;
	private _ToastInitialOptions = null;

	private _IsPinned: boolean = false;
	get IsPinned(): boolean {
		return this._IsPinned;
	}

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

	Pin(Percent: number = 0) {
		this._IsPinned = true;
		if (this._ToastInterval) clearInterval(this._ToastInterval);
		if (this._ToastAction_Pin_Element) this._ToastAction_Pin_Element.remove();
		this._ToastProgressBar_Value_Element.style.width = Percent + "%";
		return this;
	}
	SetText(Text = "") {
		this._ToastTextElement.textContent = Text;
		return this;
	}
	Dismiss(TimeInMs: number = 0) {
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
	SetPercent(percentage: number = 0) {
		return this.Pin(percentage);
	}
	SetInterval(DurationMS: number = 5000, InitialPercent: number = 0) {
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

	set innerHTML(content: string) {
		this.ToastElement.innerHTML = content;
	}
}

export const ToastBox = () => <div id="ToastBox"></div>;

export function ShowToast(myToastType: ToastType = ToastType.Info, myToastText: string = "", Options: Toast_Props = {}) {
	let myToast = new Toast(myToastType, myToastText, Options);

	let myToastBox = document.getElementById("ToastBox");
	if (myToastBox === null) {
		myToastBox = <ToastBox />;
		document.body.prepend(myToastBox);
	}
	myToastBox.appendChild(myToast.ToastElement);
	return myToast;
}
