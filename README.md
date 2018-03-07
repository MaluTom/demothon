# demothon VMRs Information
1.	Azure
* 52.187.108.151 - standard admin login credentials
2.	AWS
(VMRs configured in HA)
* 13.56.60.2 (primary) - standard admin login credentials
* 13.57.22.20 (backup) - standard admin login credentials
* 18.144.69.59 (monitor) - standard admin login credentials
* myvmr-65adcf863688d1a9.elb.us-west-1.amazonaws.com (Load Balancer - Can be used by apps instead of using host list)

3.	GCP
* 104.196.188.129 - standard admin login credentials

4.	Singapore Appliance (Simulating On-Premise)
* Management: sgdemo.solace.com
* SEMP Port is 1180
* Admin User is ‘demothon1’

* Data: sgdemo1.solace.com

# demothon General Comments
Whatever you are building, please make sure, start your topic hierarchy with “solace/<sin|gcp|azure|aws>/…” 

I am adding “solace/<sin|gcp|azure|aws>/>” subscription on all the bridge links between on-prem and cloud VMR bridge links. It will be bi-directional links, so please use the above convention to avoid looping. 
