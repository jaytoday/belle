// The following helper functions are based on Underscore.js and tailored to specific needs of react / belle

/**
 * Returns true if the object contain the given key.
 *
 * @param {object} obj - object to be inspected
 * @param {string} key - name of the property
 */
export function has(obj, key) {
  return obj !== undefined && obj !== null && Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Return a copy of the object, filtered to omit the blacklisted keys (or array of keys).
 *
 * @param {object} obj - object the returned object is based on
 * @param {string|string[]} fields - the key or list of keys of the property to omit
 */
export function omit(obj, fields) {
  if (obj) {
    const result = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && (!fields || fields.indexOf(key) < 0)) {
        result[key] = obj[key];
      }
    }
    return result;
  }
}

/**
 * The function will execute predicate for each object in iterable object passed. Its different from javascript forEach in ways:
 * 1. In case obj is undefined / null it will not break but will just return undefined.
 * 2. In case obj is not iterable it will consider obj as single element array and iterate over it (unlike underscore it will not iterate over each field of the object).
 *
 * @param {object} obj - object to be iterated
 * @param {function} predicate - function to be called for each element in the object
 * @param {object} [context] - context for the predicate function call
 */
export function each(obj, predicate, context) {
  if (obj) {
    if (isArrayLike(obj)) {
      obj.forEach((elm) => {
        predicate.call(context, elm);
      });
    } else {
      predicate.call(context, obj);
    }
  }
}

/**
 * Looks through each value in the list, returning an array of all the values
 * that pass a truth test (predicate).
 * In case the parameter passed is not iterable the function will execute predicate for single object and return array of that object is its filtered.
 *
 * @param {array} iterable - the iterable object to be filtered
 * @param {function} predicate - function returning true when provided with an entry as argument
 * @param {object} [context] - context for the predicate function call
 */
export function filter(iterable, predicate, context) {
  if (iterable) {
    const result = [];
    each(iterable, (obj) => {
      if (predicate && predicate.call(context, obj)) {
        result.push(obj);
      }
    });
    return result;
  }
}

/**
 * Returns true if the provided object is an array.
 *
 * @param {object} obj - object to be inspected
 */
export function isArrayLike(obj) {
  if (Array.isArray(obj)) return true;
  if (typeof obj === 'string') return false;
  const length = obj.length;
  return typeof length === 'number' && length >= 0;
}

/**
 * Returns all the names of the object's properties.
 *
 * @param {object} obj - object to be used
 */
function keys(obj) {
  const objKeys = [];
  for (const key in obj) if (has(obj, key)) objKeys.push(key);
  return objKeys;
}

/**
 * Returns a new array of values by mapping each value in list through a transformation function (predicate).
 * If object is a not an array, predicate's arguments will be (value, key).
 *
 * @param {object|array} obj - object to be based upon
 * @param {function} predicate - function returning the a new version of the entry
 * @param {object} [context] - context for the predicate function call
 */
export function map(obj, predicate, context) {
  if (obj) {
    const result = [];
    const objKeys = !isArrayLike(obj) && keys(obj);
    const length = (objKeys || obj).length;
    for (let index = 0; index < length; index++) {
      const currentKey = objKeys ? objKeys[index] : index;
      if (predicate) {
        result[index] = predicate.call(context, obj[currentKey], currentKey);
      }
    }
    return result;
  }
}

/**
 * Returns the first value that passes a truth test (predicate), or undefined if
 * no value passes the test. Only works for iterable objects e.g. arrays.
 * In case the parameter passed is not iterable the function will execute predicate for it considering it to be a single element array.
 *
 * @param {array} iterable - the iterable object to be searched
 * @param {function} predicate - function returning true in case of a positive match
 * @param {object} [context] - context for the predicate function call
 */
export function find(iterable, predicate, context) {
  if (iterable) {
    let source;
    if (isArrayLike(iterable)) {
      source = iterable;
    } else {
      source = [iterable];
    }
    let result;
    for (let index = 0; index < source.length; index++) {
      if (predicate && predicate.call(context, source[index])) {
        result = source[index];
        break;
      }
    }
    return result;
  }
}

/**
 * Returns true if object contains no values (no enumerable own-properties).
 *
 * @param {array} iterable - an iterable object
 */
export function isEmpty(iterable) {
  return !iterable || iterable.length === 0;
}

/**
 * Returns the index of the first value that passes a truth test (predicate), or undefined if
 * no value passes the test. Only works for iterable objects e.g. arrays.
 * In case the parameter passed is not iterable the function will execute predicate for it considering it to be a single element array.
 *
 * @param {array} iterable - the iterable object to be searched
 * @param {function} predicate - function returning true in case of a positive match
 * @param {object} [context] - context for the predicate function call
 */
export function findIndex(iterable, predicate, context) {
  if (iterable) {
    let source;
    if (isArrayLike(iterable)) {
      source = iterable;
    } else {
      source = [iterable];
    }
    let result;
    for (let index = 0; index < source.length; index++) {
      if (predicate && predicate.call(context, source[index])) {
        result = index;
        break;
      }
    }
    return result;
  }
}

/**
 * Returns the first element of an iterable object.
 * In case a single object is passed as parameter the function will return the object as is.
 *
 * @param {array} iterable - must be an iterable object
 */
export function first(iterable) {
  if (iterable) {
    if (isArrayLike(iterable)) {
      if (iterable.length > 0) {
        return iterable[0];
      }
    } else {
      return iterable;
    }
  }
}

/**
 * Returns the last element of an iterable object.
 * In case a single object is passed as parameter the function will return the object as is.
 *
 * @param {array} iterable - must be an iterable object
 */
export function last(iterable) {
  if (iterable) {
    if (isArrayLike(iterable)) {
      if (iterable.length > 0) {
        return iterable[iterable.length - 1];
      }
    } else {
      return iterable;
    }
  }
}

/**
 * Return the number of values in the list.
 * For non-iterable objects it will return 1.
 *
 * @param {array} iterable - must be an iterable object
 */
export function size(iterable) {
  if (iterable) {
    let source;
    if (isArrayLike(iterable)) {
      source = iterable;
    } else {
      source = [iterable];
    }
    return source.length;
  }
  return 0;
}

/**
 * Returns true if any of the values in the list pass the predicate truth test.
 * In case the parameter passed is not iterable the function will execute predicate for it considering it to be a single element array.
 *
 * @param {array} iterable - iterable object to be searched
 * @param {function} predicate - function returning true in case of a positive match
 * @param {object} [context] - context for the predicate function call
 */
export function some(iterable, predicate, context) {
  if (iterable) {
    let source;
    if (isArrayLike(iterable)) {
      source = iterable;
    } else {
      source = [iterable];
    }
    let result;
    for (let index = 0; index < source.length; index++) {
      if (predicate && predicate.call(context, source[index])) {
        result = true;
        break;
      }
    }
    return result;
  }
}

/**
 * Returns the union of the passed-in arrays: the list of unique items, in order, that are present in one or more of the arrays.
 *
 * @param {...array} arrs - at least two iterable objects must be provide
 */
export function union(...arrs) {
  if (arrs) {
    const result = [];
    arrs.forEach((arr) => {
      if (arr) {
        each(arr, (obj) => {
          if (result.indexOf(obj) < 0) {
            result.push(obj);
          }
        });
      }
    });
    return result;
  }
}

let idCounter = 0;

/**
 * Generate a globally-unique id.
 *
 * @param {string} [prefix] - if prefix is passed, the id will be appended to it.
 */
export function uniqueId(prefix) {
  const id = ++idCounter + '';
  return prefix ? prefix + id : id;
}

/**
 * Copy all of the properties in the source objects over to the destination object, and return the destination object. It's in-order, so the last source will override properties of the same name in previous arguments.
 *
 * @param {object} obj1 - object to be extended
 * @param {...object} objs - at least one but optionally more objects an be provided
 */
export function extend(obj1, ...objs) {
  if (obj1 && objs) {
    objs.forEach((obj) => {
      if (obj) {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            obj1[key] = obj[key];
          }
        }
      }
    });
  }
  return obj1;
}

/**
 * Recursive function for flattening an iterable.
 *
 * @param {object} output - base object to be updated
 * @param {object} element - input object to be merged into the output
 */
function flattenInternal(output, element) {
  if (element) {
    each(element, (obj) => {
      if (Array.isArray(obj)) {
        flattenInternal(output, obj);
      } else {
        output.push(obj);
      }
    });
  }
}

/**
 * Flattens a nested array (the nesting can be to any depth).
 *
 * @param {...array} arrays - at least one array must be provided
 */
export function flatten(...arrays) {
  if (arrays) {
    const result = [];
    flattenInternal(result, arrays);
    return result;
  }
}
