const semver = require('semver');
const settings = require('./Settings');
const request = require('request');

let infos;

function loadEtherpadInformations() {
  return new Promise((resolve, reject) => {
    request('https://static.etherpad.org/info.json', (er, response, body) => {
      if (er) return reject(er);

      try {
        infos = JSON.parse(body);
        return resolve(infos);
      } catch (err) {
        return reject(err);
      }
    });
  });
}

exports.getLatestVersion = function () {
  exports.needsUpdate();
  return infos.latestVersion;
};

exports.needsUpdate = function (cb) {
  loadEtherpadInformations().then((info) => {
    if (semver.gt(info.latestVersion, settings.getEpVersion())) {
      if (cb) return cb(true);
    }
  }).catch((err) => {
    console.error(`Can not perform Etherpad update check: ${err}`);
    if (cb) return cb(false);
  });
};

exports.check = function () {
  exports.needsUpdate((needsUpdate) => {
    if (needsUpdate) {
      console.warn(`Update available: Download the actual version ${infos.latestVersion}`);
    }
  });
};
