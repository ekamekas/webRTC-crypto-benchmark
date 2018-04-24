const Constant = {

    SDP_TYPE : {
        OFFER : "offer",
        ANSWER : "answer"
    },
    SERVER : {
        HTTP : "http://192.168.43.5:8081",
        HTTPS : "https://192.168.43.5:8081"
    },
    ICE_SERVER : [
        {
            'urls':'stun.l.google.com:19302'
        }
    ],
    CRYPTO : {
        ALGORITHM_ID : {

        },
        RSA : {
            ALGORITHM_ID : {
                'name': 'RSASSA-PKCS1-v1_5',
                'hash': 'SHA-256',
                'modulusLength': 2048,
                'publicExponent': new Uint8Array([1, 0, 1])
            },
            HASH : {
                SHA_1 : 'SHA-1',
                SHA_256 : 'SHA-256',
                SHA_384 : 'SHA-384',
                SHA_384 : 'SHA-512'
            }
        },
        ECDSA : {
            ALGORITHM_ID : {
                'name': 'ECDSA',
                'namedCurve': 'P-256'
            },
            NAMED_CURVE : {
                P_256 : "P-256",
                P_384 : "P-384",
                P_521 : "P-521"
            }
        },
        KEYSIZE : {
            KEY_256 : 256,
            KEY_384 : 384,
            KEY_521 : 521,
            KEY_1024 : 1024,
            KEY_2048 : 2048,
            KEY_4096 : 4096
        }
    }

};

export default Constant;