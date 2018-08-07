/*
  Notes:
  Nonin VendorId:  0x1c3d
  Nonin 3230 Packet size:  4096
  

  Things a developer working with WebUSB should understand:

  USBDevice.ControlTransferOut( setup, data)
  https://developer.mozilla.org/en-US/docs/Web/API/USBDevice/controlTransferOut#Syntax

  */

document.addEventListener('DOMContentLoaded', async () => {
  console.warn(
    'Page Loaded, Attempting to get a list of devices.\nThis will Fail if the user has not previously granted permissions.'
  );
  let devices = await navigator.usb.getDevices();
  devices.forEach(device => {
    // prettier-ignore
    console.log(`USB Device Detected: ${device.productName}     serial# ${device.serialNumber}     vendorId: ${device.vendorId}`);
  });
});

navigator.usb.addEventListener('connect', event => {
  console.log('A USB Device was connected');
});

navigator.usb.addEventListener('disconnect', event => {
  console.log('A USB Device was disconnected!');
});

let button = document.getElementById('request-device');
button.addEventListener('click', async () => {
  if (button.innerHTML === 'Connect') {
    // connect to the USB device
    navigator.usb
      .requestDevice({ filters: [{ vendorId: 0x1c3d }] })
      .then(device => {
        button.innerHTML = 'Connecting';
        // prettier-ignore
        console.log(`User has selected: ${device.productName}     serial# ${device.serialNumber}     vendorId: ${device.vendorId}`);
        console.log(device);
        OpenDevice(device);
      })
      .catch(error => {
        console.log(error);
      });
  }
});

async function OpenDevice(device) {
  await device.open();
  if (device.configuration === null) await device.selectConfiguration(1);
  await device.claimInterface(1);

  let button = document.getElementById('request-device');
  button.innerHTML = 'Connected!';
  button.disabled = true;

  // control transfer -- just throwing out some random guesses here.
  await device.controlTransferOut({
    requestType: 'class',
    recipient: 'interface',
    request: 0x00,
    value: 0x0000,
    index: 0x0001
  });

  while (true) {
    let result = await device.transferIn(1, 4096);

    if (result.data) {
      if (result.status === 'ok') {
        var spo2 = result.data.getUint8(8);
        var pulseRate = getShortValue(
          result.data.getUint8(9),
          result.data.getUint8(10)
        );
        document.getElementById('spo2').innerText = `SpO2 - ${spo2}`;
        // prettier-ignore
        document.getElementById('pulseox').innerText = `PulseRate - ${pulseRate}`;
        console.log(`spo2: ${spo2}		pulse rate: ${pulseRate}`);
      }
    }

    if (result.status === 'stall') {
      console.warn('Endpoint stalled.  Clearing.');
      await device.clearHalt(1);
    }
  }
}
var getShortValue = function(msb, lsb) {
  return msb * 256 + lsb;
};
