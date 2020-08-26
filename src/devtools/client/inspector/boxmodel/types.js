/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const PropTypes = require("prop-types");

/**
 * The box model data for the current selected node.
 */
exports.boxModel = {
  // The layout information of the current selected node
  layout: PropTypes.object,

  // The offset parent for the selected node
  offsetParent: PropTypes.object,
};
