# Toastification

Toast notifications for TypeScript & [Lestin](https://github.com/movahhedi/lestin).

Zero-dependency.

Import Font Awesome for Toast actions' icons.

```ts
import { ShowToast, ToastType } from "toastification/Toast";
import "toastification/dist/Toast.css";
import("@fortawesome/fontawesome-free/js/all.min.js");

ShowToast(ToastType.Success, "Done! Now go get some coffee!");
```

## License
Developed by [Shahab Movahhedi](https://shmovahhedi.com)

MIT Licensed.
