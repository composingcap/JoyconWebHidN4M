# JoyconWebHidN4M
Implementation of  tomayac's [joy-con-webhid driver](https://github.com/tomayac/joy-con-webhid) built into a locally hosted web server using node for Max.


To install, download this repo and add it to your Max8 Packages folder.


It works well on Mac OS using chrome, but the seems to have some minor issues on windows.

Once it is installed, create a cp.joycon abstraction in Max. You can open the help file to see an implementation of the system. 

Once the web server is up, you will need to pair your joycons to the web page. This information is piped into Max and sent to the first outlet of the cp.joycon abstraction.

Sometimes they motion controls do not work when initally conected. I have found reconnecting the controllers tends to fix this problem.
