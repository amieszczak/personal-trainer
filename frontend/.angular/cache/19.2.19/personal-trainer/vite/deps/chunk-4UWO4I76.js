// node_modules/@angular/cdk/fesm2022/boolean-property-DaaVhX5A.mjs
function coerceBooleanProperty(value) {
  return value != null && `${value}` !== "false";
}

// node_modules/@angular/cdk/fesm2022/css-pixel-value-C_HEqLhI.mjs
function coerceCssPixelValue(value) {
  if (value == null) {
    return "";
  }
  return typeof value === "string" ? value : `${value}px`;
}

// node_modules/@angular/cdk/fesm2022/coercion.mjs
function coerceStringArray(value, separator = /\s+/) {
  const result = [];
  if (value != null) {
    const sourceValues = Array.isArray(value) ? value : `${value}`.split(separator);
    for (const sourceValue of sourceValues) {
      const trimmedString = `${sourceValue}`.trim();
      if (trimmedString) {
        result.push(trimmedString);
      }
    }
  }
  return result;
}

// node_modules/@angular/cdk/fesm2022/test-environment-CT0XxPyp.mjs
function _isTestEnvironment() {
  return (
    // @ts-ignore
    typeof __karma__ !== "undefined" && !!__karma__ || // @ts-ignore
    typeof jasmine !== "undefined" && !!jasmine || // @ts-ignore
    typeof jest !== "undefined" && !!jest || // @ts-ignore
    typeof Mocha !== "undefined" && !!Mocha
  );
}

export {
  _isTestEnvironment,
  coerceBooleanProperty,
  coerceCssPixelValue,
  coerceStringArray
};
//# sourceMappingURL=chunk-4UWO4I76.js.map
