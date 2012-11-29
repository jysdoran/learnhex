/**
 * Learn HEX Math
 * Copyright 2012 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var NUM_ROWS = 25;
var NUM_COLS = 10;

var Operators = {
  Addition: {
              name: "Addition",
              sign: "+",
              func: function(a, b) { return a + b; }
            },
  Subtraction: {
                 name: "Subtraction",
                 sign: "\u2212",
                 func: function(a, b) { return a - b; }
               }
};

function Problem(facA, facB, op) {
  this.facA = facA;
  this.facB = facB;
  this.userAnswer = null;
  this.op = op;
}

Problem.prototype.answer = function() {
  return this.op.func(this.facA, this.facB);
};

Problem.prototype.checkAnswerClass = function() {
  if (this.userAnswer == null)
    return '';
  return this.answer() == parseInt(this.userAnswer, 16) ? 'correct' : 'incorrect';
};

function LearningController($scope, $window) {
  $scope.timeTicks = null;

  $scope.start = function() {
    $scope.timeTicks = 0;
    $scope._intervalId = $window.setInterval(function() {
      $scope.$apply('timeTicks = timeTicks + 1');
    }, 1);
  };

  var timeInSeconds = 100;
  var timeInMinutes = timeInSeconds * 60;
  var timeInHours = timeInMinutes * 60;
  $scope.formattedTime = function () {
    var t = $scope.timeTicks;
    var hours = Math.floor(t / timeInHours);
    t -= hours * timeInHours;
    var minutes = Math.floor(t / timeInMinutes);
    t -= minutes * timeInMinutes;
    var seconds = t / timeInSeconds;
    return hours + ':' + minutes + ':' + seconds;
  };

  $scope.operator = Operators.Addition;

  $scope.rows = [];
  for (var i = 1; i <= NUM_ROWS; ++i) {
    var row = [];
    for (var j = 1; j <= NUM_COLS; ++j) {
      var bigNum = Math.min(Math.floor(i + (i * 16 * Math.random())), 255);
      var fac1 = Math.max(Math.floor(Math.random() * (bigNum - 1)), 1);
      var fac2 = bigNum - fac1;
      var problem = new Problem(fac1, fac2, $scope.operator);
      row.push(problem);
    }
    $scope.rows.push(row);
  }
}
