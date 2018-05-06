/\/\/\/\/\\/
.\.\\\.\.\.
README...

How to generate CA and Cert for HTTPS

Section 1 - Generate CA
1.1 Generate Key
openssl genrsa -des3 -out lamanCA.key 2048

1.2 Generate root CA
openssl req -x509 -new -nodes -key lamanCA.key -sha256 -days 1825 -out lamanCA.pem

1.3 Install to your browser

Section 2 - Generate Cert
2.1 Generate Key
openssl genrsa -out dev.laman.local.key 2048

2.2 Generate CSR
openssl req -new -key dev.laman.local.key -out dev.laman.local.csr

2.3 Create Subject Alternative Name (SAN)
vim lamanSAN.ext
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = dev.mergebot.com
DNS.2 = dev.mergebot.com.192.168.1.19.xip.io

2.4 Generate Cert
openssl x509 -req -in dev.laman.local.csr -CA myCA.pem -CAkey lamanCA.key -CAcreateserial -out dev.laman.local.crt -days 1825 -sha256 -extfile lamanSAN.ext