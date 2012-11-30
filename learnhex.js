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

/** @const {integer} The number of rows on the board. */
var NUM_ROWS = 3;
/** @const {integer} The number of columns on the board. */
var NUM_COLS = 10;

/**
 * The game types/mathematical operations that can be played.
 */
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

/**
 * A Problem is a pair of factors and an operation that can compute the right
 * answer for them. It records the user's answer for comparision.
 */
function Problem(fac1, fac2, op) {
  /** @var {integer} The first factor. This is always larger than {@see facB}. */
  this.facA = (fac1 > fac2) ? fac1 : fac2;
  /** @var {integer} The second factor. This is always smaller than {@see facA}. */
  this.facB = (fac1 > fac2) ? fac2 : fac1;

  /** @var {Operation} The operation by which the factors will be evaluated. */
  this.op = op;

  /** @var {string} The answer that the user gave. */
  this.userAnswer = null;

  /** @var {string} The CSS class to apply to the problem's UI. */
  this.answerClass = null;
}

/**
 * Computes the result of the operation on the two factors.
 * @return {integer}
 */
Problem.prototype.answer = function() {
  return this.op.func(this.facA, this.facB);
};

/**
 * LearningController manages the creation and evaluation of the game board.
 */
function LearningController($scope, $window) {
  /** @var {boolean} Whether the game has been begun with the user playing. */
  $scope.playing = false;

  /** @var {boolean} Whether the user finished playing and the answers have
   *                 been graded. */
  $scope.graded = false;

  /** @var {Operator} The operator for this gameplay. */
  $scope.operator = null;

  /** @var {integer} A counter increased every millisecond to time the gameplay. */
  $scope.timeTicks = null;

  /**
   * @var {*} The token returned from setInterval().
   * @private
   */
  $scope._intervalId = null;

  /**
   * @var {boolean} Show the answers (for testing).
   * @private
   */
  $scope._answerKey = false;

  /** @var {Array.<Array.<Problem>>} The game board matrix containing the set
   *                                 of Problems. */
  $scope.rows = [];

  /**
   * Returns the size of the game board.
   * @returns {integer}
   */
  $scope.boardSize = function() {
    return NUM_ROWS * NUM_COLS;
  };

  /**
   * Changes the board type to the one specified by the operator.
   * @param {string} Operator name.
   */
  $scope.changeBoard = function(op) {
    $scope.operator = Operators[op];
    $scope.rows = [];

    // Generate boardSize() random numbers.
    var rand = [];
    var boardSize = $scope.boardSize();
    var stepSize = 255 / boardSize;
    for (var i = 1, j = 1; i <= boardSize; ++i, j += stepSize) {
      rand.push(Math.min(255, Math.floor(8 + (i*stepSize * Math.random()))));
    }
    rand.sort(function(a, b) {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      }
      return 0;
    });
    if ($scope._answerKey)
      console.log(rand);

    // Construct the game board.
    var rowMin = 10;
    for (var i = 0; i < NUM_ROWS; ++i) {
      var row = [];
      for (var j = 0; j < NUM_COLS; ++j) {
        // Compute the result of adding the two factors.
        var bigNum = rand[j + i * NUM_COLS];

        // Devise two factors randomly from the result.
        var fac1 = bigNum / Math.floor(2 + Math.random() * 6);
        fac1 = Math.floor(fac1);
        var fac2 = bigNum - fac1;

        var problem = new Problem(fac1, fac2, $scope.operator);
        if ($scope._answerKey)
          problem.userAnswer = problem.answer().toString(16);
        row.push(problem);
      }
      $scope.rows.push(row);
      rowMin += 255 / NUM_ROWS;
    }
  };
  // Default to addition.
  $scope.changeBoard('Addition');

  /**
   * Called when the user begins playing the game.
   */
  $scope.start = function() {
    $scope.playing = true;
    $scope.timeTicks = 0;
    $scope._intervalId = $window.setInterval(function() {
      $scope.$apply('timeTicks = timeTicks + 1');
    }, 1000);
  };

  /**
   * Called when the user stops playing the game and should have the answers
   * evaluated.
   */
  $scope.end = function() {
    $window.clearInterval($scope._intervalId);
    $scope.checkAllAnswers();
  };

  /**
   * Returns a HH:MM:SS string showing for how long the user has been playing.
   * @return string
   */
  var timeInMinutes = 60;
  var timeInHours = timeInMinutes * 60;
  $scope.formattedTime = function () {
    var t = $scope.timeTicks;
    var hours = Math.floor(t / timeInHours);
    t -= hours * timeInHours;
    var minutes = Math.floor(t / timeInMinutes);
    t -= minutes * timeInMinutes;
    return formatInt2d(hours) + ':' + formatInt2d(minutes) + ':' + formatInt2d(t);
  };

  /**
   * Evaluates the game board and marks each Problem as correct or incorrect.
   * It then calculates the percentage correct and issues a letter grade, just
   * like in elementary school.
   */
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

    // Convert the percent to a letter grade, just because...
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

/**
 * Formats an integer to have a leading 0 if it is less than 10. JavaScript is
 * stupid because it doesn't have fmt.Printf("%2d", N).
 * @param {integer} The number to format
 * @return {string}
 */
function formatInt2d(n) {
  if (n < 10) {
    return '0' + n;
  }
  return n;
}
