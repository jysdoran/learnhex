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

var NUM_ROWS = 10;
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
  this.userAnswer = null;
  this.answerClass = null;
}

Problem.prototype.answer = function() {
  return this.op.func(this.facA, this.facB);
};

function LearningController($scope, $window) {
  $scope.playing = false;

  $scope.timeTicks = null;

  $scope.start = function() {
    $scope.playing = true;
    $scope.timeTicks = 0;
    $scope._intervalId = $window.setInterval(function() {
      $scope.$apply('timeTicks = timeTicks + 1');
    }, 1);
  };
  $scope.end = function() {
    $window.clearInterval($scope._intervalId);
    $scope.checkAllAnswers();
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
    var seconds = Math.floor(t / timeInSeconds);
    return formatInt2d(hours) + ':' + formatInt2d(minutes) + ':' + formatInt2d(seconds);
  };

  $scope.operator = Operators.Addition;

  $scope.rows = [];
  var rowMin = 3;
  for (var i = 1; i <= NUM_ROWS; ++i) {
    var row = [];
    var rowMax = (256 / NUM_ROWS) * i;
    for (var j = 1; j <= NUM_COLS; ++j) {
      // Compute the result of adding the two factors.
      var bigNum = Math.min(256, rowMin + (rowMax - rowMin * Math.random()));
      bigNum = Math.max(2, Math.floor(bigNum));

      // Devise two factors randomly from the result.
      var fac1 = rowMax/3;
      fac1 = Math.floor(fac1 + (Math.random() * fac1));
      fac1 = Math.max(j, fac1);
      var fac2 = bigNum - fac1;

      var facA, facB;
      if (fac1 > fac2) {
        facA = fac1;
        facB = fac2;
      } else {
        facA = fac2;
        facB = fac1;
      }

      var problem = new Problem(facA, facB, $scope.operator);
      row.push(problem);
    }
    $scope.rows.push(row);
    rowMin = rowMax;
  }

  $scope.graded = false;
  $scope.checkAllAnswers = function() {
    var numCorrect = 0;
    for (var i = 0; i < $scope.rows.length; ++i) {
      for (var j = 0; j < $scope.rows[i].length; ++j) {
        var problem = $scope.rows[i][j];
        var correct = problem.answer() == parseInt(problem.userAnswer, 16);
        problem.answerClass = correct ? 'correct' : 'incorrect';
        if (correct)
          ++numCorrect;
      }
    };

    $scope.graded = true;
    var percent = numCorrect / (NUM_COLS * NUM_ROWS) * 100;
    $scope.gradePercent = Math.floor(percent);
    if ($scope.gradePercent == 100) {
      $scope.grade = 'A+';
    } else if ($scope.gradePercent >= 95) {
      $scope.grade = 'A';
    } else if ($scope.gradePercent > 90) {
      $scope.grade = 'A-';
    } else if ($scope.gradePercent >= 87) {
      $scope.grade = 'B+';
    } else if ($scope.gradePercent >= 84) {
      $scope.grade = 'B';
    } else if ($scope.gradePercent >= 80) {
      $scope.grade = 'B-';
    } else if ($scope.gradePercent >= 77) {
      $scope.grade = 'C+';
    } else if ($scope.gradePercent >= 74) {
      $scope.grade = 'C';
    } else if ($scope.gradePercent >= 70) {
      $scope.grade = 'C-';
    } else if ($scope.gradePercent >= 67) {
      $scope.grade = 'D+';
    } else if ($scope.gradePercent >= 64) {
      $scope.grade = 'D';
    } else if ($scope.gradePercent >= 60) {
      $scope.grade = 'D-';
    } else {
      $scope.grade = 'F';
    }
  };
}

function formatInt2d(n) {
  if (n < 10) {
    return '0' + n;
  }
  return n;
}
