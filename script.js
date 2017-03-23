class Vehicle {
  constructor(plate) {
    this.plate = plate;
  }

  get isStolen() {
    return this.plate == "1111111"; 
  }

  get isTruck() {
    return this.vehicleType === "truck";
  }

}

class Car extends Vehicle {

  constructor(plate) {
    super(plate)
    this.vehicleType = "car";
  }
  
}

class Truck extends Vehicle {
  
  constructor(plate, bed) {
    super(plate)
    this.vehicleType = "truck";
    this.bed = bed;
  }

  get isBedDown() {
    return this.bed.down
  }

  get isBedDirty() {
    return this.bed.dirty;
  }

}

function bedInfo(dirty, down) {
  return {
    dirty: dirty,
    down: down,
  }
}

var dog = new Car("abc123");

var cat = new Car("1111111");

var woof = new Truck("bcd321", bedInfo(true, false));

var bedDown = new Truck("asd999", bedInfo(true, true));

var cleanBed = new Truck("jfj959", bedInfo(false, false));


function checkout(vehicle) {

  var total = getTotal(vehicle);

  vehicle.total = total;

  vehicleLog.saveVehicle(vehicle);
  
  console.log(vehicleLog.log);
  
}

function validateVehicle(vehicle) {
  var valid = true;

  if(vehicle.isStolen) valid = false;
  if(vehicle.isTruck && vehicle.isBedDown) valid = false;


  if(valid) {
    $("#checkout").prop("disabled", false);
  } else {
    $("#checkout").prop("disabled", true);
  }
}

function getTotal(vehicle) {
  var total; 

  if(vehicle.isTruck) {
    total = 10;
    if(vehicle.isBedDirty) total += 2;
  } else {
    total = 5;
  }

  total = vehicleLog.isReturnCustomer(vehicle) ? total / 2 : total;

  $("#total").html(total);

  return total;
}

class VehicleLog {
  constructor() {
    this._log = initLog;
  }

  saveVehicle(vehicle) {
    this._log.push(vehicle);
  }

  isReturnCustomer(vehicle) {
    var log = this._log;
    for (var i = 0; i < log.length; i++) {
      if(log[i].plate == vehicle.plate) return true;
    }
    return false;
  }

  get log() {
    return this._log;
  }
}

var initLog = JSON.parse('[{"plate":"123truck","vehicleType":"truck","bed":{"dirty":true,"down":false},"total":12},{"plate":"123truck","vehicleType":"truck","bed":{"dirty":true,"down":false},"total":6},{"plate":"123car","vehicleType":"car","total":5},{"plate":"123car","vehicleType":"car","total":2.5},{"plate":"321truck","vehicleType":"truck","bed":{"dirty":false,"down":false},"total":10},{"plate":"321truck","vehicleType":"truck","bed":{"dirty":false,"down":false},"total":5},{"plate":"123beep","vehicleType":"car","total":5},{"plate":"beep123","vehicleType":"truck","bed":{"dirty":true,"down":false},"total":12},{"plate":"beep123","vehicleType":"truck","bed":{"dirty":false,"down":false},"total":5},{"plate":"123truck","vehicleType":"truck","bed":{"dirty":false,"down":false},"total":5}]');
var vehicleLog = new VehicleLog();
var currentVehicle;

$("input[name='vehicleType']").on('change', function() {
  currentVehicle = $(this).val() === "car" ? new Car("") : new Truck("", bedInfo(false, false));
  if(currentVehicle.isTruck) $("#truckInfo").css("display", "block");
  if(!currentVehicle.isTruck) {
    $("#truckInfo").css("display", "none");
    $("input[name='dirty']").prop("checked", false);
    $("input[name='down']").prop("checked", false);
  }
  
  getTotal(currentVehicle);
});

$("input[name='dirty']").on('change', function() {
  currentVehicle.bed.dirty = $(this).is(':checked');
  getTotal(currentVehicle);
});

$("input[name='down']").on('change', function() {
  currentVehicle.bed.down = $(this).is(':checked');

});

$("input[name='plate']").on('change', function() {
  currentVehicle.plate = $(this).val();

  validateVehicle(currentVehicle);
  getTotal(currentVehicle);
});

$("#checkout").on('click', function(event) {
  event.preventDefault();

  checkout(currentVehicle);

  $("#done").css("display", "block");
  $("form").css("display", "none");
});

$("#back").on('click', function(event) {
  event.preventDefault();

  $("#done").css("display", "none");
  $("form").css("display", "block");

  currentVehicle = currentVehicle.vehicleType === "car" ? new Car() : new Truck("", bedInfo(false, false));
  console.log(currentVehicle);
  $("input[name='plate']").val("");
  $("input[name='dirty']").prop("checked", false);
  $("input[name='down']").prop("checked", false);
  getTotal(currentVehicle);

});