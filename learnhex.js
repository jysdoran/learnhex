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
  this.op = op;
}

Problem.prototype.answer = function() {
  return this.op(this.facA, this.facB);
};

function ProblemsController($scope) {
  $scope.operator = Operators.Addition;

  $scope.rows = [];
  for (var i = 1; i <= NUM_ROWS; ++i) {
    var row = [];
    for (var j = 1; j <= NUM_COLS; ++j) {
      var bigNum = Math.floor(i + (i * 16 * Math.random()));
      var fac1 = Math.floor(Math.random() * (bigNum - 3)) + 1;
      var fac2 = bigNum - fac1;
      var problem = new Problem(fac1, fac2, $scope.operator);
      row.push(problem);
    }
    $scope.rows.push(row);
  }
}
