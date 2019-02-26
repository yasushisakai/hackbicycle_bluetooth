// bluetooth peripheral test
require("date-utils");
const bleno = require("bleno");
const util = require("util");

// configuration bleno
const MyName = "rasp-blue-test";
const MyServiceUUID = "FF00";
const serviceUUIDs = [MyServiceUUID];
const CommCharacteristicUUID = "FF01";

// create characteristic
const CommCharacteristic = function() {
  CommCharacteristic.super_.call(this, {
    uuid: CommCharacteristicUUID,
    properties: ["read", "write", "notify"]
  });
  this._updateValueCallback = null;
};
util.inherits(CommCharacteristic, bleno.Characteristic);

CommCharacteristic.prototype.onReadRequest = function(offset, callback){
  var dt = new Date();
  var str = dt.toFormat("YYYY-MM-DD HH24:MI:SS");
  console.log("read request -> " + str);
  var data = Buffer.from(str, "UTF-8"); 
  callback(this.RESULT_SUCCESS, data);
};
CommCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback){
  console.log("write request: " + data.toString("UTF-8"));
  callback(this.RESULT_SUCCESS);
};

CommCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback){
  console.log("registed notification.");
  this._updateValueCallback = updateValueCallback;
};
CommCharacteristic.prototype.onUnsbscribe = function(){
  console.log("un-registed notification.");
  this._updateValueCallback = null;
};

CommCharacteristic.prototype.sendNotification = function(val){
  if(this._updateValueCallback != null){
    this._updateValueCallback(val);
    console.log("send notification: " + val);
  } else {
    console.log("can not send notification!");
  }
};
const commChara = new CommCharacteristic();

// create Service
const MyService = new bleno.PrimaryService({
  uuid: MyServiceUUID,
  characteristics: [ commChara ]
});

// --------------------------------------------------------------------------- 
// bluetooth event
bleno.on("stateChange", function(state) {
  console.log("stateChange: " + state);
  if(state == "poweredOn"){
    bleno.startAdvertising(MyName, serviceUUIDs, function(error){
      if(error) console.error(error);
    });
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on("advertisingStart", function(error){
  if(!error){
    console.log("start advertising...");
    bleno.setServices([MyService]);
  } else {
    console.error(error);
  }
});

// ---------------------------------------------------------------------------
function exit(){
  process.exit();
}
process.on('SIGINT', exit);