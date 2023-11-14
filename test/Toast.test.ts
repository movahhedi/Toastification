import { ShowToast, ToastType, type IToast_Props } from "../src/Toast";
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
		expect(toastBox!.children[0]).toBe(toast.toastElement);
	});

	it("should create a new ToastBox if one does not exist", () => {
		const toast = ShowToast(ToastType.Info, "Test Toast", {}, container);
		const toastBox = document.getElementById("ToastBox");
		expect(toastBox).not.toBeNull();
		expect(toastBox!.parentElement).toBe(container);
		expect(toastBox!.children.length).toBe(1);
		expect(toastBox!.children[0]).toBe(toast.toastElement);
	});

	it("should use the provided options to customize the appearance and behavior of the toast", () => {
		const options: IToast_Props = {
			duration: 10000,
			backColor: "red",
			title: "Test Title",
			isPinned: true,
			noPin: true,
			noDismiss: true,
			textAlign: "center",
			textSize: "20px",
			textWeight: "bold",
			titleAlign: "start",
			titleSize: "30px",
			titleWeight: "bold",
			buttons: [
				{
					text: "Button 1",
					style: "btn-primary",
					onClick: () => {},
				},
				{
					text: "Button 2",
					style: "btn-secondary",
					onClick: () => {},
				},
			],
		};
		const toast = ShowToast(ToastType.Info, "Test Toast", options, container);

		// Check that the provided options were used to customize the appearance and behavior of the toast
		expect(toast.isPinned).toBe(true);

		// Check that the provided options were used to customize the appearance of the toast element
		const titleElement = toast.toastElement.querySelector(".Toast-Title") as HTMLElement;
		expect(titleElement).not.toBeNull();
		expect(titleElement.textContent).toBe("Test Title");
		// TODO
		// expect(titleElement.style.textAlign).toBe("center");
		// expect(titleElement.style.fontSize).toBe("30px");
		// expect(titleElement.style.fontWeight).toBe("bold");

		const textElement = toast.toastElement.querySelector(".Toast-Text") as HTMLElement;
		expect(textElement).not.toBeNull();
		expect(textElement.textContent).toBe("Test Toast");
		// TODO
		// expect(textElement.style.textAlign).toBe("center");
		// expect(textElement.style.fontSize).toBe("20px");
		// expect(textElement.style.fontWeight).toBe("bold");

		const buttonElements = toast.toastElement.querySelectorAll(".Toast-Button") as NodeListOf<HTMLButtonElement>;
		expect(buttonElements.length).toBe(2);
		expect(buttonElements[0].textContent).toBe("Button 1");
		expect(buttonElements[0].classList.contains("btn-primary")).toBe(true);
		expect(buttonElements[1].textContent).toBe("Button 2");
		expect(buttonElements[1].classList.contains("btn-secondary")).toBe(true);

		// Check that the pin and dismiss buttons are not present
		const pinButton = toast.toastElement.querySelector(".Toast-Action.Pin") as HTMLButtonElement;
		expect(pinButton).toBeNull();

		const dismissButton = toast.toastElement.querySelector(".Toast-Action.Dismiss") as HTMLButtonElement;
		expect(dismissButton).toBeNull();
	});
});
