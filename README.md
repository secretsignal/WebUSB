# WebUSB

WebUSB lets us interact with USB devices from Chrome using Javascript.
WebUSB is a DRAFT spec, but is supported in CHROME.

### TLDR What do I need to know?

- Requires Chrome version 61 or higher
- The Nonin works out of the box on MacOS and Linux.
- Windows 10 requires a custom driver be used to support the Nonin 3230 Pulse Oximeter. [details below](#custom-windows-drivers-for-nonin-3230-pulseOx)

---

# Interesting... tell me more.

I highly recommend reading this short post from Google. It covers most of what you will need to know.

[Access USB Devices on the Web](https://developers.google.com/web/updates/2016/03/access-usb-devices-on-the-web).

---

# A few notes about using WebUSB

### HTTPS only

Because this API is a powerful new feature added to the Web, Chrome aims to make it available only to secure contexts. This means you'll need to build with TLS in mind.

### A Feature-Policy wil be required

A feature policy is a mechanism that allows developers to selectively enable and disable various browser features and APIs. It can be defined via a HTTP header and/or an iframe "allow" attribute.

You can define a feature that controls whether the usb attribute is exposed on the Navigator object, or in other words if you allow WebUSB.

Below is an example of a header policy where WebUSB is allowed \*;

```
Feature-Policy: usb *;
```

Below is another example of a different container policy where USB is allowed:

```Html
<iframe allowpaymentrequest allow=’usb fullscreen’></iframe>
```

### User gesture required

As a security feature, getting access to connected USB devices with navigator.usb.requestDevice must be called via a user gesture like a touch or mouse click.

---

# Whats this about custom drivers on Windows?

Chrome relies on libusb for its USB device communication.
When the Nonin 3230 is plugged into a computer running Windows 10, the operating system assigns the Nonin a generic windows driver: `USBSerial`.

This can be worked around by replacing this driver with a generic one: `WinUSB`. We do this by creating a "custom driver"

# Custom Windows Drivers for Nonin 3230 PulseOx

To Install this Custom Driver, open the Device Manager on Windows, locate the Nonin device. (It will show up as a COM port device) and manually update the device driver. `Update Driver / Browse for Drivers on my Computer` and point to `/drivers/windows/nonin-custom` in this repo.

An example driver created for the Microsoft Surface Pro can be found in: `drivers/windows/nonin-custom`

This driver should be fairly universal, but at the time of this writing has only been tested on the Microsoft Surface and Windows 10.

This driver was generated using `Zadig` https://zadig.akeo.ie/

---

# Resources

### tools

- [Zadig](https://zadig.akeo.ie/) Tool for replacing drivers on windows
- [PnPUtil.exe](https://docs.microsoft.com/en-us/windows-hardware/drivers/devtest/pnputil) a command line tool that lets an administrator install/update device drivers on Windows systems.

### knowledge

- [USB In a Nutshell](https://www.beyondlogic.org/usbnutshell/usb1.shtml)
- Nonin 3231 Technical Specifications: located in `/documentation/`
- [Wikipedia article on USB CDC devices](https://en.wikipedia.org/wiki/USB_communications_device_class)

### helpful internet posts

- [Usefull discussion going on inside this issue thread on github](https://github.com/WICG/webusb/issues/75#issuecomment-272592135)
