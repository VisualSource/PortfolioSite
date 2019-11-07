const jwt = require('jsonwebtoken');
const fs = require('fs');


var privateKey = fs.readFileSync('../https/key.pem');
var token = jwt.sign({ sub: 'athu0' }, privateKey, { algorithm: 'RS256' });

console.log(token);

/** eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdGh1MCIsImlhdCI6MTU3MzE0MzkxMH0.MVSRqlz0PvK
oI5VHi12UWkXJeuEs82sOi-z-_1hnBYwz3f9ud2JU-3JHd0k-AjU9XPptVrhjwge_RFWc9RV4Mnv3X4kglyVNvJ_mfNH
zWodb034w8CvCNKYKm6yBdccQLna1Unu7KNtSyeFjRoE5RLhY9CiRR2x1OViLp83qYSrOHfho4fc346QX7rNPykrnwES
MzfKR-vNUu15JYvGThjLtHWKvTSz3KIA_X9ePbkui8u6NdFNEfXNwv6TnC81G-m9mVZZ972B2tX3HnU1eRxL4X1aOtYP
ro61FTW6g1BOZaZHh9o9Q_nDPtG5pGBUqRB_PaA6-FW4cG9tNxp8qr3iVDD6vvs9Js2WThpW_rb0EzVEqILNtdxg6ivy
4WqN0VmFWu9h_Kto-2udoTWaHuC558qmjcyvbHCwJqIhBqGL4MzStjyv5c8frxzid6OsGUM4JNuAIeCOzku6Ls8JZWSo
OSmqt_OX52pv_8v1bnxaRJ8-XZ74dgv7_h7VIpdBHOTEQaf6JsmbJC1ff1AlegLKUR1oVu8hbbqh_ZpW8D66TBk6AdQT
_oXmU4qu-Bed6LAvUnYOwEcleSilJYWnnG9Qwx1XZSwihIrHKLgFaAovv3_Uz5tRFycisIfcbOdYbjSe6ceBNUtkEIYl
hd6GwTZdSQqGG2HyHUWy3RCXznt */
