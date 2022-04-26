# spinner-amax

Spinner experiment with Maxxon AMAX 32 motor, upgraded for 2022 usage by Controls and Instrumentation 3, School of Engineering, University of Edinburgh. This design has now been used for over 2,500 hours in total across 12 separate instances. It is based on the [spinner-nidec](https://github.com/practable/spinner-nidec).

<figure>
<img src="./img/spinner.png"alt="Spinner hardware using Amax motor in tri-pod mount" style="width:80%">
<figcaption align = "center"><b>Fig. 2. Spinner hardware using AMAX motor</b></figcaption>
</figure>

## Contents

  - Firmware `./fw`
  - Hardware `./hw`
  - Printed Circuit Board - TODO Add this
  - UI - TODO Add this
   
## New Motor

The experiment is now using an AMAX 32 motor variant (part number: 236668)

![motor](./img/A-max-32-236666-NEW.jpg)

The technical specs are [here](./hw/docEN-21-176.pdf/)

## Performance

The varaibility of the step response is reduced significantly compared to the spinner using the nidec motor.
Meanwhile, here is a measured step response (average of seven runs)

![step](./img/step.png)


