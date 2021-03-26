
// modulo principal
var app = angular.module('app', ['ngRoute'])

// base url API
const API_URL = "http://localhost:3000/";
const MAILBOX_KEY = "b5577c51ebfa29f6292cda54515f8b5d";

const API_URL_MAILBOX = "http://apilayer.net/api/check?"


// serializador

function serializeObject(params, parent = null) {

    let esc = encodeURIComponent;
    let query = [];

    for (let i in params) {
      let element = params[i];
      if ('object' == typeof element) {
        let qr = serializeObject(element, (parent ? parent + `[${esc(i)}]` : esc(i) ) );

        Object.keys(qr).map(el => {
          query.push(qr[el]);
        })
      } else {
        parent ? query.push(`${parent}[${esc(i)}]=${esc(element)}`) : query.push(`${esc(i)}=${esc(element)}`);
      }
    }

    return query;
}
