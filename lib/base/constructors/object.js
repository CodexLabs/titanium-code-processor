/**
 * <p>Copyright (c) 2009-2013 by Appcelerator, Inc. All Rights Reserved.
 * Please see the LICENSE file for information about licensing.</p>
 *
 * Definition for the object constructor
 *
 * @module base/constructors/object
 */
/*global
util,
FunctionTypeBase,
areAnyUnknown,
UnknownType,
BooleanType,
prototypes,
type,
handleRecoverableNativeException,
toString,
fromPropertyDescriptor,
ArrayType,
ObjectType,
toPropertyDescriptor,
toObject,
isDataDescriptor,
StringType,
isType,
wrapNativeCall,
addNonEnumerableProperty,
NullType
*/

/*****************************************
 *
 * Object Constructor
 *
 *****************************************/

/**
 * getPrototypeOf() prototype method
 *
 * @private
 * @see ECMA-262 Spec Chapter 15.2.3.2
 */
function ObjectGetPrototypeOfFunc(className) {
	FunctionTypeBase.call(this, 1, className || 'Function');
}
util.inherits(ObjectGetPrototypeOfFunc, FunctionTypeBase);
ObjectGetPrototypeOfFunc.prototype.callFunction = wrapNativeCall(function callFunction(thisVal, args) {

	// Variable declarations
	var o = args[0];

	// Validate the parameters
	if (areAnyUnknown((args || []).concat(thisVal))) {
		return new UnknownType();
	}

	if (!o || type(o) !== 'Object') {
		handleRecoverableNativeException('TypeError', 'Value is not an object');
		return new UnknownType();
	}
	return o.objectPrototype ? o.objectPrototype : new NullType();
});

/**
 * getOwnPropertyDescriptor() prototype method
 *
 * @private
 * @see ECMA-262 Spec Chapter 15.2.3.3
 */
function ObjectGetOwnPropertyDescriptorFunc(className) {
	FunctionTypeBase.call(this, 2, className || 'Function');
}
util.inherits(ObjectGetOwnPropertyDescriptorFunc, FunctionTypeBase);
ObjectGetOwnPropertyDescriptorFunc.prototype.callFunction = wrapNativeCall(function callFunction(thisVal, args) {

	// Variable declarations
	var o = args[0],
		p = args[1],
		name;

	// Validate the parameters
	if (areAnyUnknown((args || []).concat(thisVal))) {
		return new UnknownType();
	}

	// Step 1
	if (type(o) !== 'Object') {
		handleRecoverableNativeException('TypeError', 'Value is not an object');
		return new UnknownType();
	}

	// Step 2
	name = toString(p).value;

	// Steps 3 and 4
	return fromPropertyDescriptor(o.getOwnProperty(name));
});

/**
 * getOwnPropertyNames() prototype method
 *
 * @private
 * @see ECMA-262 Spec Chapter 15.2.3.4
 */
function ObjectGetOwnPropertyNamesFunc(className) {
	FunctionTypeBase.call(this, 1, className || 'Function');
}
util.inherits(ObjectGetOwnPropertyNamesFunc, FunctionTypeBase);
ObjectGetOwnPropertyNamesFunc.prototype.callFunction = wrapNativeCall(function callFunction(thisVal, args) {

	// Variable declarations
	var o = args[0],
		array,
		n = 0;

	// Validate the parameters
	if (areAnyUnknown((args || []).concat(thisVal))) {
		return new UnknownType();
	}

	// Step 1
	if (!o || type(o) !== 'Object') {
		handleRecoverableNativeException('TypeError', 'Value is not an object');
		return new UnknownType();
	}

	// Step 2
	array = new ArrayType();

	// Step 4
	o._getPropertyNames().forEach(function (name) {
		array.defineOwnProperty(n, {
			value: new StringType(name),
			writable: true,
			enumerable: true,
			configurable: true
		}, false, true);
		n++;
	});

	// Step 5
	return array;
});

/**
 * create() prototype method
 *
 * @private
 * @see ECMA-262 Spec Chapter 15.2.3.5
 */
function ObjectCreateFunc(className) {
	FunctionTypeBase.call(this, 2, className || 'Function');
}
util.inherits(ObjectCreateFunc, FunctionTypeBase);
ObjectCreateFunc.prototype.callFunction = wrapNativeCall(function callFunction(thisVal, args) {

	// Variable declarations
	var o = args[0],
		properties = args[1],
		obj;

	// Validate the parameters
	if (areAnyUnknown((args || []).concat(thisVal))) {
		return new UnknownType();
	}

	// Step 1
	if (!o || (type(o) != 'Object' && type(o) != 'Null')) {
		handleRecoverableNativeException('TypeError', 'Value is not an object');
		return new UnknownType();
	}

	// Step 2
	obj = new ObjectType();

	// Step 3
	obj.objectPrototype = o;

	// Step 4
	if (properties && type(properties) !== 'Undefined') {
		ObjectDefinePropertiesFunc.prototype.callFunction(thisVal, [obj, properties]);
	}

	// Step 5
	return obj;
});

/**
 * defineProperties() prototype method
 *
 * @private
 * @see ECMA-262 Spec Chapter 15.2.3.6
 */
function ObjectDefinePropertyFunc(className) {
	FunctionTypeBase.call(this, 3, className || 'Function');
}
util.inherits(ObjectDefinePropertyFunc, FunctionTypeBase);
ObjectDefinePropertyFunc.prototype.callFunction = wrapNativeCall(function callFunction(thisVal, args) {

	// Variable declarations
	var o = args[0],
		p = args[1],
		attributes = args[2],
		name,
		desc;

	// Validate the parameters
	if (areAnyUnknown((args || []).concat(thisVal))) {
		return new UnknownType();
	}

	// Step 1
	if (!o || type(o) !== 'Object') {
		handleRecoverableNativeException('TypeError', 'Value is not an object');
		return new UnknownType();
	}

	// Step 2
	name = toString(p).value;

	// Step 3
	desc = toPropertyDescriptor(attributes);

	// Step 4
	o.defineOwnProperty(name, desc, true);

	// Step 5
	return o;
});

/**
 * defineProperties() prototype method
 *
 * @private
 * @see ECMA-262 Spec Chapter 15.2.3.7
 */
function ObjectDefinePropertiesFunc(className) {
	FunctionTypeBase.call(this, 2, className || 'Function');
}
util.inherits(ObjectDefinePropertiesFunc, FunctionTypeBase);
ObjectDefinePropertiesFunc.prototype.callFunction = wrapNativeCall(function callFunction(thisVal, args) {

	// Variable declarations
	var o,
		properties,
		props,
		names,
		i,
		len,
		p;

	// Validate the parameters
	if (areAnyUnknown((args || []).concat(thisVal))) {
		return new UnknownType();
	}

	o = args[0];
	properties = args[1];
	props = toObject(properties);
	names = props._getPropertyNames();

	// Step 1
	if (!o || type(o) !== 'Object') {
		handleRecoverableNativeException('TypeError', 'Value is not an object');
		return new UnknownType();
	}

	// Steps 5 and 6
	for (i = 0, len = names.length; i < len; i++) {
		p = names[i];
		if (props.getProperty(p).enumerable) {
			o.defineOwnProperty(p, toPropertyDescriptor(props.get(p)), true);
		}
	}

	// Step 7
	return o;
});

/**
 * seal() prototype method
 *
 * @private
 * @see ECMA-262 Spec Chapter 15.2.3.8
 */
function ObjectSealFunc(className) {
	FunctionTypeBase.call(this, 1, className || 'Function');
}
util.inherits(ObjectSealFunc, FunctionTypeBase);
ObjectSealFunc.prototype.callFunction = wrapNativeCall(function callFunction(thisVal, args) {

	// Variable declarations
	var o = args[0],
		desc;

	// Validate the parameters
	if (areAnyUnknown((args || []).concat(thisVal))) {
		return new UnknownType();
	}

	// Step 1
	if (!o || type(o) !== 'Object') {
		handleRecoverableNativeException('TypeError', 'Value is not an object');
		return new UnknownType();
	}

	// Step 2
	o._getPropertyNames().forEach(function (p) {
		desc = o.getOwnProperty(p);
		desc.configurable = false;
		o.defineOwnProperty(p, desc, true);
	});

	// Step 3
	o.extensible = false;

	// Step 4
	return o;
});

/**
 * freeze() prototype method
 *
 * @private
 * @see ECMA-262 Spec Chapter 15.2.3.9
 */
function ObjectFreezeFunc(className) {
	FunctionTypeBase.call(this, 1, className || 'Function');
}
util.inherits(ObjectFreezeFunc, FunctionTypeBase);
ObjectFreezeFunc.prototype.callFunction = wrapNativeCall(function callFunction(thisVal, args) {

	// Variable declarations
	var o = args[0],
		desc;

	// Validate the parameters
	if (areAnyUnknown((args || []).concat(thisVal))) {
		return new UnknownType();
	}

	// Step 1
	if (!o || type(o) !== 'Object') {
		handleRecoverableNativeException('TypeError', 'Value is not an object');
		return new UnknownType();
	}

	// Step 2
	o._getPropertyNames().forEach(function (p) {
		desc = o.getOwnProperty(p);
		if (isDataDescriptor(desc)) {
			desc.writable = false;
		}
		desc.configurable = false;
		o.defineOwnProperty(p, desc, true);
	});

	// Step 3
	o.extensible = false;

	// Step 4
	return o;
});

/**
 * preventExtensions() prototype method
 *
 * @private
 * @see ECMA-262 Spec Chapter 15.2.3.10
 */
function ObjectPreventExtensionsFunc(className) {
	FunctionTypeBase.call(this, 1, className || 'Function');
}
util.inherits(ObjectPreventExtensionsFunc, FunctionTypeBase);
ObjectPreventExtensionsFunc.prototype.callFunction = wrapNativeCall(function callFunction(thisVal, args) {

	// Variable declarations
	var o = args[0];

	// Validate the parameters
	if (areAnyUnknown((args || []).concat(thisVal))) {
		return new UnknownType();
	}

	// Step 1
	if (!o || type(o) !== 'Object') {
		handleRecoverableNativeException('TypeError', 'Value is not an object');
		return new UnknownType();
	}

	// Step 2
	o.extensible = false;

	// Step 3
	return o;
});

/**
 * isSealed() prototype method
 *
 * @private
 * @see ECMA-262 Spec Chapter 15.2.3.11
 */
function ObjectIsSealedFunc(className) {
	FunctionTypeBase.call(this, 1, className || 'Function');
}
util.inherits(ObjectIsSealedFunc, FunctionTypeBase);
ObjectIsSealedFunc.prototype.callFunction = wrapNativeCall(function callFunction(thisVal, args) {

	// Variable declarations
	var o = args[0];

	// Validate the parameters
	if (areAnyUnknown((args || []).concat(thisVal))) {
		return new UnknownType();
	}

	// Step 1
	if (!o || type(o) !== 'Object') {
		handleRecoverableNativeException('TypeError', 'Value is not an object');
		return new UnknownType();
	}

	// Step 2
	o._getPropertyNames().forEach(function (p) {
		if (o.getOwnProperty(p).configurable) {
			return new BooleanType(false);
		}
	});

	// Step 3
	return new BooleanType(!o.extensible);
});

/**
 * isFrozen() prototype method
 *
 * @private
 * @see ECMA-262 Spec Chapter 15.2.3.12
 */
function ObjectIsFrozenFunc(className) {
	FunctionTypeBase.call(this, 1, className || 'Function');
}
util.inherits(ObjectIsFrozenFunc, FunctionTypeBase);
ObjectIsFrozenFunc.prototype.callFunction = wrapNativeCall(function callFunction(thisVal, args) {

	// Variable declarations
	var o = args[0],
		desc;

	// Validate the parameters
	if (areAnyUnknown((args || []).concat(thisVal))) {
		return new UnknownType();
	}

	// Step 1
	if (!o || type(o) !== 'Object') {
		handleRecoverableNativeException('TypeError', 'Value is not an object');
		return new UnknownType();
	}

	// Step 2
	o._getPropertyNames().forEach(function (p) {
		desc = o.getOwnProperty(p);
		if ((isDataDescriptor(desc) && desc.writable) || desc.configurable) {
			return new BooleanType(false);
		}
	});

	// Step 3
	return new BooleanType(!o.extensible);
});

/**
 * isExtensible() prototype method
 *
 * @private
 * @see ECMA-262 Spec Chapter 15.2.3.13
 */
function ObjectIsExtensibleFunc(className) {
	FunctionTypeBase.call(this, 1, className || 'Function');
}
util.inherits(ObjectIsExtensibleFunc, FunctionTypeBase);
ObjectIsExtensibleFunc.prototype.callFunction = wrapNativeCall(function callFunction(thisVal, args) {

	// Variable declarations
	var o = args[0];

	// Validate the parameters
	if (areAnyUnknown((args || []).concat(thisVal))) {
		return new UnknownType();
	}

	// Step 1
	if (!o || type(o) !== 'Object') {
		handleRecoverableNativeException('TypeError', 'Value is not an object');
		return new UnknownType();
	}

	// Step 2
	return new BooleanType(o.extensible);
});

/**
 * keys() prototype method
 *
 * @private
 * @see ECMA-262 Spec Chapter 15.2.3.14
 */
function ObjectKeysFunc(className) {
	FunctionTypeBase.call(this, 1, className || 'Function');
}
util.inherits(ObjectKeysFunc, FunctionTypeBase);
ObjectKeysFunc.prototype.callFunction = wrapNativeCall(function callFunction(thisVal, args) {

	// Variable declarations
	var o = args[0],
		array,
		index = 0;

	// Validate the parameters
	if (areAnyUnknown((args || []).concat(thisVal))) {
		return new UnknownType();
	}

	// Step 1
	if (!o || type(o) !== 'Object') {
		handleRecoverableNativeException('TypeError', 'Value is not an object');
		return new UnknownType();
	}

	// Step 3
	array = new ArrayType();

	// Step 5
	o._getPropertyNames().forEach(function (p) {
		if (o._lookupProperty(p).enumerable) {
			array.defineOwnProperty(index, {
				value: new StringType(p),
				writable: true,
				enumerable: true,
				configurable: true
			}, false);
			index++;
		}
	});

	// Step 6
	return array;
});

/**
 * Object constructor function
 *
 * @private
 * @see ECMA-262 Spec Chapter 15.2
 */
function ObjectConstructor(className) {
	FunctionTypeBase.call(this, 1, className || 'Function');

	this.defineOwnProperty('prototype', {
		value: prototypes.Object
	}, false, true);

	addNonEnumerableProperty(this, 'getPrototypeOf', new ObjectGetPrototypeOfFunc());
	addNonEnumerableProperty(this, 'getOwnPropertyDescriptor', new ObjectGetOwnPropertyDescriptorFunc());
	addNonEnumerableProperty(this, 'getOwnPropertyNames', new ObjectGetOwnPropertyNamesFunc());
	addNonEnumerableProperty(this, 'create', new ObjectCreateFunc());
	addNonEnumerableProperty(this, 'defineProperty', new ObjectDefinePropertyFunc());
	addNonEnumerableProperty(this, 'defineProperties', new ObjectDefinePropertiesFunc());
	addNonEnumerableProperty(this, 'seal', new ObjectSealFunc());
	addNonEnumerableProperty(this, 'freeze', new ObjectFreezeFunc());
	addNonEnumerableProperty(this, 'preventExtensions', new ObjectPreventExtensionsFunc());
	addNonEnumerableProperty(this, 'isSealed', new ObjectIsSealedFunc());
	addNonEnumerableProperty(this, 'isFrozen', new ObjectIsFrozenFunc());
	addNonEnumerableProperty(this, 'isExtensible', new ObjectIsExtensibleFunc());
	addNonEnumerableProperty(this, 'keys', new ObjectKeysFunc());
}
util.inherits(ObjectConstructor, FunctionTypeBase);
ObjectConstructor.prototype.callFunction = wrapNativeCall(function callFunction(thisVal, args) {

	// Variable declarations
	var value = args[0];

	// Validate the parameters
	if (areAnyUnknown((args || []).concat(thisVal))) {
		return new UnknownType();
	}

	// Step 1
	if (!value || isType(value, ['Null', 'Undefined'])) {
		return new ObjectType();
	}

	// Step 2
	return toObject(value);
});
ObjectConstructor.prototype.construct = wrapNativeCall(function construct(args) {

	// Variable declarations
	var value = args[0];

	// Validate the parameters
	if (areAnyUnknown(args)) {
		return new UnknownType();
	}

	// Step 1
	if (value && (!isType(value, ['Undefined', 'Null']))) {
		if (type(value) === 'Object') {
			return value;
		} else {
			return toObject(value);
		}
	}

	// Steps 3-8
	return new ObjectType();
}, true);