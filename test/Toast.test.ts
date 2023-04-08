import { ShowToast, ToastType, Toast_Props } from "../Toast";
// import { Toast_Props } from "../Toast";
// import { ShowToast, ToastType } from "../dist/Toast";

describe("ShowToast", () => {
	let container: HTMLDivElement;

	beforeEach(() => {
		container = document.createElement("div");
		container.id = "container";
		document.body.appendChild(container);
	});

	afterEach(() => {
		document.body.removeChild(container);
	});

	it("should create a new Toast and append it to the ToastBox", () => {
		const toast = ShowToast(ToastType.Info, "Test Toast", {}, container);
		const toastBox = document.getElementById("ToastBox");
		expect(toastBox).not.toBeNull();
		expect(toastBox!.children.length).toBe(1);
		expect(toastBox!.children[0]).toBe(toast.ToastElement);
	});

	it("should create a new ToastBox if one does not exist", () => {
		const toast = ShowToast(ToastType.Info, "Test Toast", {}, container);
		const toastBox = document.getElementById("ToastBox");
		expect(toastBox).not.toBeNull();
		expect(toastBox!.parentElement).toBe(container);
		expect(toastBox!.children.length).toBe(1);
		expect(toastBox!.children[0]).toBe(toast.ToastElement);
	});

	it("should use the provided options to customize the appearance and behavior of the toast", () => {
		const options: Toast_Props = {
			Duration: 10000,
			BackColor: "red",
			Title: "Test Title",
			IsPinned: true,
			NoPin: true,
			NoDismiss: true,
			TextAlign: "center",
			TextSize: "20px",
			TextWeight: "bold",
			TitleAlign: "start",
			TitleSize: "30px",
			TitleWeight: "bold",
			Buttons: [
				{
					Text: "Button 1",
					Style: "btn-primary",
					OnClick: () => {},
				},
				{
					Text: "Button 2",
					Style: "btn-secondary",
					OnClick: () => {},
				},
			],
		};
		const toast = ShowToast(ToastType.Info, "Test Toast", options, container);

		// Check that the provided options were used to customize the appearance and behavior of the toast
		expect(toast.IsPinned).toBe(true);

		// Check that the provided options were used to customize the appearance of the toast element
		const titleElement = toast.ToastElement.querySelector(".Toast-Title") as HTMLElement;
		expect(titleElement).not.toBeNull();
		expect(titleElement.textContent).toBe("Test Title");
		// TODO
		// expect(titleElement.style.textAlign).toBe("center");
		// expect(titleElement.style.fontSize).toBe("30px");
		// expect(titleElement.style.fontWeight).toBe("bold");

		const textElement = toast.ToastElement.querySelector(".Toast-Text") as HTMLElement;
		expect(textElement).not.toBeNull();
		expect(textElement.textContent).toBe("Test Toast");
		// TODO
		// expect(textElement.style.textAlign).toBe("center");
		// expect(textElement.style.fontSize).toBe("20px");
		// expect(textElement.style.fontWeight).toBe("bold");

		const buttonElements = toast.ToastElement.querySelectorAll(".Toast-Button") as NodeListOf<HTMLButtonElement>;
		expect(buttonElements.length).toBe(2);
		expect(buttonElements[0].textContent).toBe("Button 1");
		expect(buttonElements[0].classList.contains("btn-primary")).toBe(true);
		expect(buttonElements[1].textContent).toBe("Button 2");
		expect(buttonElements[1].classList.contains("btn-secondary")).toBe(true);

		// Check that the pin and dismiss buttons are not present
		const pinButton = toast.ToastElement.querySelector(".Toast-Action.Pin") as HTMLButtonElement;
		expect(pinButton).toBeNull();

		const dismissButton = toast.ToastElement.querySelector(".Toast-Action.Dismiss") as HTMLButtonElement;
		expect(dismissButton).toBeNull();
	});
});
