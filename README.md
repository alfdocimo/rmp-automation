# RPM Automation script (Puppeteer)

### ⚠️READ BEFORE USING⚠️

This is a script build with the sole purpose of generating images from completed PR's for Pasiona's **RPMs**

**I AM NOT RESPONSIBLE FOR THE MISUSE OF THIS SCRIPT**

Please disconnect from any kind of VPN before executing this script. 

### You will need to create two new environment variables:

- RPM*VSTS_USER (set your Travelport user in this format: \_firstname.lastname*) **DO NOT USE @TRAVELPORT.COM**
- RPM_VSTS_PASSWORD (ser your Travelport password)

Example:

- RPM_VSTS_USER alfredo.narvaez
- RPM_VSTS_PASSWORD **\*\*\*\***

### To run the script:

first run:

`yarn`

then

`yarn start --project=pos-web`

You can set the start date and end date through args as well:

`yarn start --project=pos-fes --start_date=01/01/2019 --end_date=01/01/2020`

### Accepted args:

| Name       | Type   | Example    |
| ---------- | ------ | ---------- |
| project    | String | pos-fes    |
| start_date | Date   | 01/01/2019 |
| end_date   | Date   | 01/01/2020 |

Feel free to email me for any other questions:
anarvaez@pasiona.com
alfredo.narvaez@travelport.com
